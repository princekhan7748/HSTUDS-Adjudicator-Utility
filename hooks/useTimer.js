'use client';
import { useState, useRef, useEffect } from 'react';

export default function useTimer() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning && !isPaused) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, isPaused]);

  const startTimer = () => {
    setIsRunning(true);
    setIsPaused(false);
    setTime(0);
  };

  const stopTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTime(0);
  };

  const pauseTimer = () => {
    if (!isRunning) return;
    setIsPaused(!isPaused);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return {
    time,
    isRunning,
    isPaused,
    startTimer,
    stopTimer,
    pauseTimer,
    formatTime,
    setTime // Exposing setTime for bell checks
  };
}
