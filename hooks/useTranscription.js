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

    console.log("Starting recording and transcription...");
    setTranscript("");
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Start local recording immediately
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
        // Also send to Deepgram if connection is open
        if (deepgramConnectionRef.current && deepgramConnectionRef.current.getReadyState() === 1) {
          deepgramConnectionRef.current.send(event.data);
        }
      };

      mediaRecorder.start(250);
      setIsTranscribing(true); // Set to true to indicate recording has started

      // Attempt to connect to Deepgram
      if (DEEPGRAM_API_KEY) {
        try {
          const deepgram = createClient(DEEPGRAM_API_KEY);
          const connection = deepgram.listen.live({
            model: "nova-2",
            punctuate: true,
            smart_format: true,
            language: 'en-US'
          });

          connection.on(LiveTranscriptionEvents.Open, () => {
            console.log("Deepgram connection opened.");
            // Now that the connection is open, subsequent ondataavailable events will send data.
          });

          connection.on(LiveTranscriptionEvents.Transcript, (data) => {
            const newTranscript = data.channel.alternatives[0].transcript;
            if (newTranscript) {
                setTranscript((prev) => prev + " " + newTranscript);
            }
          });

          connection.on(LiveTranscriptionEvents.Close, () => {
            console.log("Deepgram connection closed.");
          });

          connection.on(LiveTranscriptionEvents.Error, (error) => {
            console.error("Deepgram Connection Error:", error);
          });

          deepgramConnectionRef.current = connection;

        } catch (deepgramError) {
            console.error("Could not connect to Deepgram:", deepgramError);
            // Recording will continue locally even if this fails.
        }
      } else {
        console.warn("No Deepgram API key found. Live transcription will be disabled. Recording will continue locally.");
      }

    } catch (error) {
      console.error("Error accessing microphone:", error);
      setIsTranscribing(false);
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
      chunksRef.current = [];
    }

    if (deepgramConnectionRef.current) {
      deepgramConnectionRef.current.finish();
      console.log("Deepgram connection finished.");
      deepgramConnectionRef.current = null;
    }
    
    setIsTranscribing(false);
  };

  return { transcript, startTranscription, stopTranscription, isTranscribing, setTranscript };
}
