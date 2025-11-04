'use client';
import styles from '../app/page.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faStop } from '@fortawesome/free-solid-svg-icons';

export default function Timer({ time, isRunning, startTimer, stopTimer, pauseTimer, formatTime }) {
  return (
    <div className={styles.timerContainer}>
      <div className={styles.timer}>{formatTime(time)}</div>
      <div className={styles.controls}>
        <button onClick={startTimer} disabled={isRunning}><FontAwesomeIcon icon={faPlay} /> Start</button>
        <button onClick={stopTimer} disabled={!isRunning}><FontAwesomeIcon icon={faStop} /> Stop</button>
        <button onClick={pauseTimer} disabled={!isRunning}><FontAwesomeIcon icon={faPause} /> Pause</button>
      </div>
    </div>
  );
}
