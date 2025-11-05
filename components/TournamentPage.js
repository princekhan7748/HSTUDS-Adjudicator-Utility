'use client';
import { useState, useEffect } from 'react';
import styles from '../app/page.module.css';
import useTournament from '../hooks/useTournament';
import useTimer from '../hooks/useTimer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faStop, faMicrophone, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons';

export default function TournamentPage() {
  const { 
    peers, 
    role, 
    setRole, 
    createPeer, 
    broadcastTournamentState, 
    tournamentState 
  } = useTournament();
  
  // Adjudicator uses a local timer
  const { time, isRunning, startTimer, stopTimer, pauseTimer, formatTime } = useTimer();
  
  const [roomId, setRoomId] = useState('');
  const [participants, setParticipants] = useState({});

  // Broadcast adjudicator's timer state
  useEffect(() => {
    if (role === 'adjudicator') {
      broadcastTournamentState({ time, isRunning });
    }
  }, [time, isRunning, role, broadcastTournamentState]);

  const handleStartTournament = () => {
    const newRoomId = Math.random().toString(36).substring(2, 9);
    setRoomId(newRoomId);
    setRole('adjudicator');
  };

  const handleJoinTournament = () => {
    if (roomId) {
      setRole('participant');
    }
  };

  const toggleMute = (participantId) => {
    const isMuted = tournamentState.participants?.[participantId]?.isMuted;
    broadcastTournamentState({ 
      participants: {
        ...tournamentState.participants,
        [participantId]: { isMuted: !isMuted }
      }
    });
  };

  // Simplified participant discovery for demo
  useEffect(() => {
    if (role === 'adjudicator') {
      const handleNewParticipant = (participantId) => {
        createPeer(participantId);
        setParticipants(prev => ({ ...prev, [participantId]: { id: participantId } }));
      };

      const interval = setInterval(() => {
        if (Object.keys(peers).length < 3) {
          const newParticipantId = `participant-${Object.keys(peers).length + 1}`;
          if (!peers[newParticipantId]) {
            handleNewParticipant(newParticipantId);
          }
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [role, createPeer, peers]);

  const displayTime = role === 'adjudicator' ? time : tournamentState.time;

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Tournament Mode</h1>

      {!role && (
        <div>
          <button onClick={handleStartTournament}>Start New Tournament</button>
          <div>
            <input
              type="text"
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
            <button onClick={handleJoinTournament}>Join Tournament</button>
          </div>
        </div>
      )}

      {role === 'adjudicator' && (
        <div>
          <h2>Adjudicator Control Panel</h2>
          <p>Room ID: {roomId}</p>
          <div className={styles.timerControls}>
            <button onClick={startTimer} disabled={isRunning}><FontAwesomeIcon icon={faPlay} /> Start</button>
            <button onClick={pauseTimer} disabled={!isRunning}><FontAwesomeIcon icon={faPause} /> Pause</button>
            <button onClick={stopTimer}><FontAwesomeIcon icon={faStop} /> Stop</button>
          </div>
          <h2>{formatTime(displayTime)}</h2>

          <h3>Participants</h3>
          <ul>
            {Object.keys(peers).map(peerId => (
              <li key={peerId}>
                {peerId}
                <button onClick={() => toggleMute(peerId)}>
                  <FontAwesomeIcon icon={tournamentState.participants?.[peerId]?.isMuted ? faMicrophoneSlash : faMicrophone} />
                  {tournamentState.participants?.[peerId]?.isMuted ? 'Unmute' : 'Mute'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {role === 'participant' && (
        <div>
          <h2>Participant View</h2>
          <p>Connected to Room: {roomId}</p>
          <h2>{formatTime(displayTime)}</h2>
          {/* Participant's mute status is controlled by the adjudicator */}
        </div>
      )}
    </main>
  );
}
