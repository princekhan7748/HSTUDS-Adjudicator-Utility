'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import useTimer from '../hooks/useTimer';
import useAudio from '../hooks/useAudio';
import useTranscription from '../hooks/useTranscription';
import AudioStatus from '../components/AudioStatus';
import Timer from '../components/Timer';
import Settings from '../components/Settings';
import Transcription from '../components/Transcription';

export default function Home() {
  const {
    time,
    isRunning,
    isPaused,
    startTimer,
    stopTimer,
    pauseTimer,
    formatTime
  } = useTimer();

  const { 
    audioStatus, 
    unlockAudio, 
    playBellSound, 
    handleBellFileChange,
    audioRef 
  } = useAudio();

  const {
    transcript,
    startTranscription,
    stopTranscription,
  } = useTranscription();

  const [showSettings, setShowSettings] = useState(false);
  const [bells, setBells] = useState([
    { time: 60, id: 1 },
    { time: 120, id: 2 },
  ]);
  const [newBellTime, setNewBellTime] = useState({ minutes: "", seconds: "" });

  useEffect(() => {
    if (isRunning && !isPaused && bells.some(bell => bell.time === time)) {
      playBellSound(time);
    }
  }, [time, isRunning, isPaused, bells, playBellSound]);

  const addBell = () => {
    const minutes = parseInt(newBellTime.minutes, 10) || 0;
    const seconds = parseInt(newBellTime.seconds, 10) || 0;
    const totalSeconds = (minutes * 60) + seconds;

    if (totalSeconds > 0) {
      const newBell = { time: totalSeconds, id: Date.now() };
      const updatedBells = [...bells, newBell].sort((a, b) => a.time - b.time);
      setBells(updatedBells);
      setNewBellTime({ minutes: "", seconds: "" });
    }
  };

  const deleteBell = (id) => {
    const updatedBells = bells.filter(bell => bell.id !== id);
    setBells(updatedBells);
  };

  const updateBell = (id, newTime) => {
    const updatedBells = bells.map(bell => 
      bell.id === id ? { ...bell, time: newTime } : bell
    ).sort((a, b) => a.time - b.time);
    setBells(updatedBells);
  };

  const startSession = async () => {
    await unlockAudio();
    startTimer();
    startTranscription();
    setShowSettings(false);
  };

  const stopSession = () => {
    stopTimer();
    stopTranscription();
  };

  const pauseSession = () => {
    pauseTimer();
    // The transcription pausing is handled within the useTranscription hook
  };


  return (
    <div className={styles.container} onClick={unlockAudio}>
      <main className={styles.main}>
        <h1 className={styles.title}>Adjudicator's Utility Tool</h1>
        <AudioStatus status={audioStatus} />

        <Settings 
          isRunning={isRunning}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          bells={bells}
          newBellTime={newBellTime}
          setNewBellTime={setNewBellTime}
          addBell={addBell}
          deleteBell={deleteBell}
          updateBell={updateBell}
          handleBellFileChange={handleBellFileChange}
          formatTime={formatTime}
          audioRef={audioRef}
        />

        <Timer 
          time={time}
          isRunning={isRunning}
          startTimer={startSession}
          stopTimer={stopSession}
          pauseTimer={pauseSession}
          formatTime={formatTime}
        />

        <Transcription transcript={transcript} />
        <Link href="/transcribe" className={styles.transcribeButton}>
          Transcribe Audio File
        </Link>

      </main>

      <footer className={styles.footer}>
        <p>POWERED BY HSTUDS</p>
        <p>©Debating Society of Hajee Mohammad Danesh Science and Technology University, 2025</p>
      </footer>
    </div>
  );
}
