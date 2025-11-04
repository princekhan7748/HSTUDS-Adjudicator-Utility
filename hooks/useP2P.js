'use client';
import { useState, useRef, useCallback } from 'react';

const CHUNK_SIZE = 64 * 1024; // 64KB

export default function useP2P() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [receivedFile, setReceivedFile] = useState(null);
  const [error, setError] = useState(null);
  const peerConnectionRef = useRef(null);
  const dataChannelRef = useRef(null);
  const fileChunksRef = useRef([]);
  const fileMetadataRef = useRef(null);

  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        // This is where you would send the ICE candidate to the other peer via a signaling server
        // For our manual setup, we will collect all candidates and include them in the offer/answer
      }
    };

    pc.ondatachannel = (event) => {
      const channel = event.channel;
      dataChannelRef.current = channel;
      setupDataChannel(channel);
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'connected') {
        setIsConnected(true);
        setIsConnecting(false);
      } else if (pc.connectionState === 'failed') {
        setError('Connection failed.');
        setIsConnected(false);
        setIsConnecting(false);
      } else {
        setIsConnected(false);
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  }, []);

  const setupDataChannel = (channel) => {
    channel.onopen = () => {
      console.log('Data channel is open');
    };

    channel.onclose = () => {
      console.log('Data channel is closed');
    };

    channel.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'metadata') {
        fileMetadataRef.current = data.payload;
        fileChunksRef.current = [];
      } else if (data.type === 'chunk') {
        const chunk = new Uint8Array(atob(data.payload).split('').map(c => c.charCodeAt(0)));
        fileChunksRef.current.push(chunk);
        
        if (fileChunksRef.current.reduce((acc, c) => acc + c.length, 0) >= fileMetadataRef.current.size) {
          const file = new Blob(fileChunksRef.current, { type: fileMetadataRef.current.type });
          file.name = fileMetadataRef.current.name;
          setReceivedFile(file);
        }
      }
    };
  };

  const createOffer = useCallback(async () => {
    setIsConnecting(true);
    const pc = createPeerConnection();
    const dataChannel = pc.createDataChannel('file-transfer');
    dataChannelRef.current = dataChannel;
    setupDataChannel(dataChannel);

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    return new Promise((resolve) => {
      setTimeout(() => { // Wait for ICE candidates to be gathered
        resolve(JSON.stringify(pc.localDescription));
      }, 1000);
    });
  }, [createPeerConnection]);

  const handleOffer = useCallback(async (offerString) => {
    setIsConnecting(true);
    const pc = createPeerConnection();
    const offer = JSON.parse(offerString);
    await pc.setRemoteDescription(offer);

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    return new Promise((resolve) => {
      setTimeout(() => { // Wait for ICE candidates to be gathered
        resolve(JSON.stringify(pc.localDescription));
      }, 1000);
    });
  }, [createPeerConnection]);

  const handleAnswer = useCallback(async (answerString) => {
    const answer = JSON.parse(answerString);
    await peerConnectionRef.current.setRemoteDescription(answer);
  }, []);

  const sendFile = useCallback(async (file) => {
    if (!isConnected) {
      setError('Not connected to a peer.');
      return;
    }

    const metadata = { name: file.name, type: file.type, size: file.size };
    dataChannelRef.current.send(JSON.stringify({ type: 'metadata', payload: metadata }));

    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const chunk = e.target.result;
      const payload = btoa(new Uint8Array(chunk).reduce((data, byte) => data + String.fromCharCode(byte), ''));
      dataChannelRef.current.send(JSON.stringify({ type: 'chunk', payload }));
      if (fileReader.offset < file.size) {
        readNextChunk();
      }
    };

    let offset = 0;
    const readNextChunk = () => {
        const slice = file.slice(offset, offset + CHUNK_SIZE);
        fileReader.readAsArrayBuffer(slice);
        offset += CHUNK_SIZE;
    };
    readNextChunk();
  }, [isConnected]);

  return { isConnecting, isConnected, createOffer, handleOffer, handleAnswer, sendFile, receivedFile, error };
}
