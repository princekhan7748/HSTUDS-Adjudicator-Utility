'use client';
import React, { useState } from 'react';
import useP2P from '../../hooks/useP2P';
import styles from './SharePage.module.css';

export default function SharePage() {
  const {
    isConnecting,
    isConnected,
    createOffer,
    handleOffer,
    handleAnswer,
    sendFile,
    receivedFile,
    error,
  } = useP2P();

  const [offer, setOffer] = useState('');
  const [answer, setAnswer] = useState('');
  const [file, setFile] = useState(null);
  const [offerInput, setOfferInput] = useState('');
  const [answerInput, setAnswerInput] = useState('');

  const handleCreateOffer = async () => {
    const offer = await createOffer();
    setOffer(offer);
  };

  const handleReceiveOffer = async () => {
    const answer = await handleOffer(offerInput);
    setAnswer(answer);
  };

  const handleReceiveAnswer = async () => {
    await handleAnswer(answerInput);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSendFile = () => {
    if (file) {
      sendFile(file);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Share Files Peer-to-Peer</h1>

      <div className={styles.grid}>
        {/* Sender Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Send File</h2>
          <div className={styles.stack}>
            <button onClick={handleCreateOffer} className={`${styles.button} ${styles.primaryButton}`} disabled={isConnecting || isConnected}>
              1. Create Offer
            </button>
            {offer && <textarea className={styles.textarea} value={offer} readOnly />}
            <input type="text" placeholder="Paste Answer here" onChange={(e) => setAnswerInput(e.target.value)} className={styles.input} />
            <button onClick={handleReceiveAnswer} className={`${styles.button} ${styles.secondaryButton}`} disabled={!answerInput || isConnected}>
              3. Connect
            </button>
            <input type="file" onChange={handleFileChange} className={styles.fileInput} />
            <button onClick={handleSendFile} className={`${styles.button} ${styles.tertiaryButton}`} disabled={!isConnected || !file}>
              Send File
            </button>
          </div>
        </div>

        {/* Receiver Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Receive File</h2>
          <div className={styles.stack}>
            <input type="text" placeholder="Paste Offer here" onChange={(e) => setOfferInput(e.target.value)} className={styles.input} />
            <button onClick={handleReceiveOffer} className={`${styles.button} ${styles.primaryButton}`} disabled={!offerInput || isConnected}>
              2. Create Answer
            </button>
            {answer && <textarea className={styles.textarea} value={answer} readOnly />}
          </div>
        </div>
      </div>

      {(isConnecting || isConnected) && (
        <div className={styles.statusBox}>
          <h3 className={styles.statusTitle}>Connection Status</h3>
          <p>{isConnecting ? 'Connecting...' : 'Connected'}</p>
        </div>
      )}

      {receivedFile && (
        <div className={styles.successBox}>
          <h3 className={styles.successTitle}>File Received!</h3>
          <a href={URL.createObjectURL(receivedFile)} download={receivedFile.name} className={styles.downloadLink}>
            Download {receivedFile.name}
          </a>
        </div>
      )}

      {error && (
        <div className={styles.errorBox}>
          <h3 className={styles.errorTitle}>Error</h3>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
