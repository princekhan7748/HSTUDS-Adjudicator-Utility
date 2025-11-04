'use client';
import styles from '../app/page.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faBell } from '@fortawesome/free-solid-svg-icons';

export default function Settings({ isRunning, showSettings, setShowSettings, bells, newBellTime, setNewBellTime, addBell, handleBellFileChange, formatTime, audioRef }) {
  return (
    <div className={styles.settingsContainer}>
      <button className={styles.settingsButton} onClick={() => setShowSettings(!showSettings)} disabled={isRunning}>
        <FontAwesomeIcon icon={faCog} /> Settings
      </button>
      {showSettings && (
        <div className={styles.settings}>
          <div className={styles.bellSection}>
            <h2><FontAwesomeIcon icon={faBell} /> Bell Timings</h2>
            <div className={styles.addBell}>
              <input
                type="number"
                placeholder="MM"
                value={newBellTime.minutes}
                onChange={(e) => setNewBellTime({ ...newBellTime, minutes: e.target.value })}
              />
              <input
                type="number"
                placeholder="SS"
                value={newBellTime.seconds}
                onChange={(e) => setNewBellTime({ ...newBellTime, seconds: e.target.value })}
              />
              <button onClick={addBell}>Add Bell</button>
            </div>
            <ul className={styles.bellList}>
              {bells.map((bell) => (
                <li key={bell.id}>{formatTime(bell.time)}</li>
              ))}
            </ul>
            <div className={styles.ringtoneUpload}>
              <label htmlFor="ringtone">Custom Bell Sound:</label>
              <input type="file" id="ringtone" accept="audio/*" onChange={handleBellFileChange} />
            </div>
            <audio ref={audioRef} src="/bell.mp3" preload="auto" />
          </div>
        </div>
      )}
    </div>
  );
}
