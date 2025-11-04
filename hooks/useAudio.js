'use client';
import { useState, useRef, useEffect } from 'react';

export default function useAudio() {
  const [audioStatus, setAudioStatus] = useState("locked");
  const audioContextRef = useRef(null);
  const audioBufferRef = useRef(null);
  const audioRef = useRef(null); // For HTML5 audio fallback

  useEffect(() => {
    const setupAudio = async () => {
      try {
        const context = new (window.AudioContext || window.webkitAudioContext)();
        audioContextRef.current = context;
        if (context.state === 'running') {
          setAudioStatus('unlocked');
        }

        const response = await fetch('/bell.mp3');
        if (!response.ok) {
          throw new Error(`Failed to fetch bell.mp3: ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const decodedAudio = await context.decodeAudioData(arrayBuffer);
        audioBufferRef.current = decodedAudio;
        console.log("Default bell sound loaded successfully.");
      } catch (error) {
        console.error("Failed to load default bell sound:", error);
        setAudioStatus("error");
      }
    };

    setupAudio();

    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  const unlockAudio = async () => {
    const audioContext = audioContextRef.current;
    if (audioContext && audioContext.state === 'suspended') {
      await audioContext.resume();
    }
    if (audioContext?.state === 'running') {
      setAudioStatus('unlocked');
    }
  };

  const playBellSound = (time) => {
    const audioContext = audioContextRef.current;
    const audioBuffer = audioBufferRef.current;

    if (audioBuffer && audioContext && audioContext.state === 'running') {
      try {
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start(0);
        console.log("Bell sound played at", time, "seconds");
      } catch (error) {
        console.error("Error playing bell sound with AudioContext:", error);
      }
    } else {
      console.warn("AudioContext not ready or running. Falling back to HTML5 audio.");
      audioRef.current?.play().catch(e => console.error("HTML5 audio fallback failed:", e));
    }
  };

  const handleBellFileChange = async (e) => {
    const file = e.target.files[0];
    const audioContext = audioContextRef.current;
    if (file && audioContext) {
      const arrayBuffer = await file.arrayBuffer();
      try {
        const decodedAudio = await audioContext.decodeAudioData(arrayBuffer);
        audioBufferRef.current = decodedAudio;
        console.log("Custom bell sound loaded and decoded.");
      } catch (error) {
        console.error("Failed to decode custom bell sound:", error);
      }
    }
  };

  return { 
    audioStatus, 
    unlockAudio, 
    playBellSound, 
    handleBellFileChange,
    audioRef
  };
}
