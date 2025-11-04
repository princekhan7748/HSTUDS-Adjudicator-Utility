'use client';
import { useState, useRef, useEffect } from 'react';
import { createClient, LiveClient, LiveTranscriptionEvents } from '@deepgram/sdk';

const DEEPGRAM_API_KEY = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY;

export default function useTranscription() {
  const [transcript, setTranscript] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const deepgramConnectionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startTranscription = async () => {
    if (isTranscribing) return;

    if (!DEEPGRAM_API_KEY) {
      alert("Please add your Deepgram API key to .env.local");
      return;
    }

    console.log("Starting transcription...");
    setTranscript("");
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const deepgram = createClient(DEEPGRAM_API_KEY);
      const connection = deepgram.listen.live({
        model: "nova-2",
        punctuate: true,
        smart_format: true,
        language: 'en-US'
      });

      connection.on(LiveTranscriptionEvents.Open, () => {
        console.log("Deepgram connection opened.");
        setIsTranscribing(true);

        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0 && connection.getReadyState() === 1) {
            connection.send(event.data);
            chunksRef.current.push(event.data);
          }
        };

        mediaRecorder.start(250);
      });

      connection.on(LiveTranscriptionEvents.Transcript, (data) => {
        const newTranscript = data.channel.alternatives[0].transcript;
        if (newTranscript) {
            setTranscript((prev) => prev + " " + newTranscript);
        }
      });

      connection.on(LiveTranscriptionEvents.Close, () => {
        console.log("Deepgram connection closed.");
        setIsTranscribing(false);
      });

      connection.on(LiveTranscriptionEvents.Error, (error) => {
        console.error("Deepgram Error:", error);
      });

      deepgramConnectionRef.current = connection;

    } catch (error) {
      console.error("Error starting transcription:", error);
    }
  };

  const stopTranscription = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "recording.webm";
      a.click();
      URL.revokeObjectURL(url);
    }

    if (deepgramConnectionRef.current) {
      deepgramConnectionRef.current.finish();
      console.log("Deepgram connection finished.");
    }
  };

  return { transcript, startTranscription, stopTranscription, isTranscribing, setTranscript };
}
