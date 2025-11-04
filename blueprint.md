# Adjudicator's Utility Tool - Blueprint

## 1. Overview

This document outlines the architecture, features, and development plan for the Adjudicator's Utility Tool. The application is a web-based utility for debate adjudicators, providing a timer, audible bells, and real-time speech-to-text transcription.

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
    *   Uses the Web Audio API for reliable playback, bypassing browser autoplay restrictions.
    *   Visual indicator for the browser's audio lock status.
*   **Real-time Transcription:**
    *   Uses the Deepgram API for live speech-to-text transcription.
    *   Requires microphone access.
    *   Displays the running transcript in a text area.
    *   A button to copy the full transcript to the clipboard.
*   **Recording:**
    *   Downloads a `.webm` audio file of the session when the "Stop" button is clicked.
*   **UI/UX:**
    *   Clean, modern interface using FontAwesome icons for controls.
    *   A collapsible settings panel to keep the main view uncluttered.
    *   Footer with branding and copyright information.

### Design Principles:

*   **Component-Based:** Built with React and Next.js.
*   **Client-Side Interactivity:** The entire application is a client component (`"use client"`) due to its heavy reliance on browser APIs (Web Audio, MediaRecorder, Timers).
*   **Modular & Scalable:** Code is organized into reusable components and hooks for maintainability.

## 3. Current Task: Code Modularization

**Objective:** Refactor the existing single-file application into a modular structure with clear separation of concerns. This will improve maintainability, readability, and scalability.

**Plan:**

1.  **Create Custom Hooks for Logic:**
    *   Create a `/hooks` directory.
    *   **`useTimer.js`:** To manage all timer state and `setInterval` logic.
    *   **`useAudio.js`:** To manage `AudioContext`, loading bell sounds, and playback.
    *   **`useTranscription.js`:** To manage microphone access, `MediaRecorder`, and the Deepgram WebSocket connection.

2.  **Create Presentational Components:**
    *   Create a `/components` directory.
    *   **`AudioStatus.js`:** A component to display the audio lock status.
    *   **`Timer.js`:** A component for the timer display and controls.
    *   **`Settings.js`:** A component for the settings panel.
    *   **`Transcription.js`:** A component for the transcription text area.

3.  **Refactor the Main Page (`/app/page.js`):**
    *   Transform `page.js` into a container component.
    *   It will import and use the new hooks to manage state.
    *   It will render the new presentational components, passing the necessary data and functions as props.
