# Adjudicator's Utility Tool - Blueprint

## 1. Overview

This document outlines the architecture, features, and development plan for the Adjudicator's Utility Tool. The application is a web-based utility for debate adjudicators, providing a timer, audible bells, real-time speech-to-text transcription, and serverless file sharing.

## 2. Core Features & Design

### Implemented Features:

*   **Debate Timer:**
    *   A digital timer that counts up in seconds.
    *   Controls to Start, Stop, and Pause the session.
    *   Displays time in `MM:SS` format.
*   **Audible Bells:**
    *   Default bell sounds at 1-minute and 2-minute intervals.
    *   A settings panel to add custom bell timings (in minutes and/or seconds).
    *   Ability to upload a custom `.mp3` file to be used as the bell sound.
    *   Editable and deletable bell timings.
    *   Uses the Web Audio API for reliable playback, bypassing browser autoplay restrictions.
    *   Visual indicator for the browser's audio lock status.
*   **Real-time Transcription:**
    *   Uses the Deepgram API for live speech-to-text transcription.
    *   Requires microphone access.
    *   Displays the running transcript in a text area.
    *   A button to copy the full transcript to the clipboard.
*   **Offline Transcription:**
    *   A separate page (`/transcribe`) for transcribing audio files.
    *   Users can upload an audio file and get the transcription.
*   **Recording:**
    *   Downloads a `.webm` audio file of the session when the "Stop" button is clicked.
    *   **Offline-First Recording:** The local audio recording starts immediately upon granting microphone access, independent of the live transcription service. This ensures a recording is always saved, even if the user is offline or the Deepgram connection fails.
*   **UI/UX:**
    *   Clean, modern interface using FontAwesome icons for controls.
    *   A collapsible settings panel to keep the main view uncluttered.
    *   Footer with branding and copyright information.

### Design Principles:

*   **Component-Based:** Built with React and Next.js.
*   **Client-Side Interactivity:** The entire application is a client component (`"use client"`) due to its heavy reliance on browser APIs (Web Audio, MediaRecorder, Timers, WebRTC).
*   **Modular & Scalable:** Code is organized into reusable components and hooks for maintainability.

## 3. Current Task: Serverless Peer-to-Peer File Sharing

**Objective:** Implement a feature that allows two users to directly share audio files with each other without a server, using WebRTC.

**Plan:**

1.  **Create a New Share Page (`/app/share/page.js`):** A new page to host the file sharing UI.
2.  **Create a `SharePage` Component (`/components/SharePage.js`):** A component with a user interface for sending and receiving files.
    *   A "Send" section to select a file and generate a connection "Offer".
    *   A "Receive" section to paste an "Offer" and generate an "Answer".
    *   Status indicators to guide the users through the connection process.
3.  **Create a `useP2P` Hook (`/hooks/useP2P.js`):** A custom hook to abstract the complex WebRTC logic for establishing a peer-to-peer data channel.
4.  **Implement File Transfer Logic:** Logic to chunk the file, send it over the WebRTC data channel, and reassemble it on the receiver's end.
5.  **Add Navigation:** Add a link to the new `/share` page in the main application layout.