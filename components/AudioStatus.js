'use client';
import styles from '../app/page.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUnlock } from '@fortawesome/free-solid-svg-icons';

export default function AudioStatus({ status }) {
  return (
    <div className={styles.audioStatus}>
      <FontAwesomeIcon icon={status === 'unlocked' ? faUnlock : faLock} />
      Audio: {status}
    </div>
  );
}
