'use client';
import { useState } from 'react';
import styles from '../app/page.module.css';

export default function TranscriptionPage() {
  const [transcription, setTranscription] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleTranscription = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    setIsTranscribing(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      setTranscription(result.transcript);
    } catch (error) {
      console.error('Error transcribing audio:', error);
      alert('There was an error transcribing the audio.');
    } finally {
      setIsTranscribing(false);
    }
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Transcribe Audio File</h1>
      <div className={styles.transcriptionContainer}>
        <input type="file" onChange={handleFileChange} accept="audio/*" />
        <button onClick={handleTranscription} disabled={isTranscribing}>
          {isTranscribing ? 'Transcribing...' : 'Transcribe'}
        </button>
        <textarea
          className={styles.transcript}
          value={transcription}
          readOnly
          placeholder="Transcription will appear here..."
        />
      </div>
    </main>
  );
}
