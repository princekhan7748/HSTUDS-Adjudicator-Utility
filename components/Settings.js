'use client';
import styles from '../app/page.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faBell, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function Settings({ 
  isRunning, 
  showSettings, 
  setShowSettings, 
  bells, 
  newBellTime, 
  setNewBellTime, 
  addBell, 
  deleteBell, 
  updateBell, 
  handleBellFileChange, 
  formatTime, 
  audioRef 
}) {

  const handleTimeChange = (id, part, value) => {
    const bell = bells.find(b => b.id === id);
    const currentMinutes = Math.floor(bell.time / 60);
    const currentSeconds = bell.time % 60;

    let newTotalSeconds;
    if (part === 'minutes') {
      newTotalSeconds = (parseInt(value, 10) || 0) * 60 + currentSeconds;
    } else {
      newTotalSeconds = currentMinutes * 60 + (parseInt(value, 10) || 0);
    }
    updateBell(id, newTotalSeconds);
  };

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
              {bells.map((bell) => {
                const minutes = Math.floor(bell.time / 60);
                const seconds = bell.time % 60;
                return (
                  <li key={bell.id} className={styles.bellListItem}>
                    <input
                      type="number"
                      value={minutes}
                      onChange={(e) => handleTimeChange(bell.id, 'minutes', e.target.value)}
                      className={styles.bellInput}
                    />
                    <span>:</span>
                    <input
                      type="number"
                      value={seconds}
                      onChange={(e) => handleTimeChange(bell.id, 'seconds', e.target.value)}
                      className={styles.bellInput}
                    />
                    <button onClick={() => deleteBell(bell.id)} className={styles.deleteBellButton}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </li>
                );
              })}
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
