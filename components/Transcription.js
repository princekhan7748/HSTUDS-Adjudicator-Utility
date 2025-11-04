'use client';
import styles from '../app/page.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

export default function Transcription({ transcript }) {
  return (
    <div className={styles.transcriptionContainer}>
      <textarea
        className={styles.transcript}
        value={transcript}
        readOnly
        placeholder="Speech to text will appear here..."
      ></textarea>
      <button className={styles.copyButton} onClick={() => navigator.clipboard.writeText(transcript)}>
        <FontAwesomeIcon icon={faCopy} /> Copy
      </button>
    </div>
  );
}
