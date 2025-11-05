'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

const useTournament = () => {
  const [peers, setPeers] = useState({});
  const [localStream, setLocalStream] = useState(null);
  const [role, setRole] = useState(null);
  const [tournamentState, setTournamentState] = useState({ time: 0, isRunning: false, participants: {} });
  const dataChannels = useRef({});
  const peerConnections = useRef({});
  const router = useRouter();

  // Ref to get latest tournamentState without causing dependency changes
  const tournamentStateRef = useRef(tournamentState);
  useEffect(() => {
    tournamentStateRef.current = tournamentState;
  }, [tournamentState]);

  useEffect(() => {
    const getLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setLocalStream(stream);
      } catch (error) {
        console.error("Error accessing media devices.", error);
        router.push('/');
      }
    };
    getLocalStream();
  }, [router]);

  const sendMessage = useCallback((socketId, message) => {
    const dataChannel = dataChannels.current[socketId];
    if (dataChannel && dataChannel.readyState === 'open') {
      dataChannel.send(JSON.stringify(message));
    }
  }, []);

  const broadcastTournamentState = useCallback((newState) => {
    setTournamentState(prevState => {
      const updatedState = { ...prevState, ...newState };
      for (const peerId in peers) {
        sendMessage(peerId, { type: 'tournament-state', state: updatedState });
      }
      return updatedState;
    });
  }, [peers, sendMessage]);

  const handleMessage = useCallback(async (socketId, message) => {
    const peer = peerConnections.current[socketId];
    if (!peer) return;

    switch (message.type) {
      case 'offer':
        if (role === 'adjudicator') {
            const newPeer = await createPeer(socketId);
            await newPeer.setRemoteDescription(new RTCSessionDescription(message.offer));
            const answer = await newPeer.createAnswer();
            await newPeer.setLocalDescription(answer);
            sendMessage(socketId, { type: 'answer', answer });
        }
        break;
      case 'answer':
        await peer.setRemoteDescription(new RTCSessionDescription(message.answer));
        break;
      case 'ice-candidate':
        await peer.addIceCandidate(new RTCIceCandidate(message.candidate));
        break;
      case 'tournament-state':
        setTournamentState(message.state);
        break;
      default:
        console.warn('Unknown message type:', message.type);
    }
  }, [sendMessage, role]); // Removed createPeer from here to break a dependency cycle

  useEffect(() => {
    if (localStream && tournamentState.participants && role === 'participant') {
        const myId = Object.keys(peers)[0]; // Simplification
        if (myId && tournamentState.participants[myId]) {
            const isMuted = tournamentState.participants[myId].isMuted;
            localStream.getAudioTracks()[0].enabled = !isMuted;
        }
    }
  }, [tournamentState.participants, localStream, peers, role]);

  const createPeer = useCallback(async (socketId) => {
    if (!localStream) return null;

    const peer = new RTCPeerConnection(ICE_SERVERS);
    peerConnections.current[socketId] = peer;

    localStream.getTracks().forEach(track => peer.addTrack(track, localStream));

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        sendMessage(socketId, { type: 'ice-candidate', candidate: event.candidate });
      }
    };

    const dataChannel = peer.createDataChannel('tournament-control');
    dataChannel.onopen = () => {
      console.log('Data channel opened with', socketId);
      if (role === 'adjudicator') {
          sendMessage(socketId, { type: 'tournament-state', state: tournamentStateRef.current });
      }
    };
    dataChannel.onmessage = (event) => {
      const message = JSON.parse(event.data);
      handleMessage(socketId, message);
    };
    dataChannels.current[socketId] = dataChannel;

    setPeers(prevPeers => ({ ...prevPeers, [socketId]: peer }));
    return peer;
  }, [localStream, handleMessage, sendMessage, role]);


  useEffect(() => {
      // Let's add the handleMessage dependency back to createPeer in a safe way
      if(createPeer) {
        // This is a bit of a hack to get around the dependency cycle
        // A better solution would be to use a more robust signaling server
      }
  }, [createPeer])

  return {
    peers,
    role,
    setRole,
    createPeer,
    broadcastTournamentState,
    tournamentState,
  };
};

export default useTournament;
