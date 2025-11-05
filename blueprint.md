
# Blueprint: Debate Auditor

## Overview

Debate Auditor is a multi-functional utility tool designed for debate tournament management, real-time transcription, and secure file sharing. Initially a web application, it is being converted into a native mobile application using Capacitor to allow for installation on mobile devices and submission to app stores.

## Core Features & Design

*   **Tournament Management:**
    *   Real-time updates for tournament state.
    *   Roles for "Tournament Director" and "Adjudicator".
    *   WebRTC for peer-to-peer communication between participants.
*   **Live Transcription:**
    *   Uses the browser's SpeechRecognition API to transcribe spoken words in real-time.
*   **P2P File Sharing:**
    *   Securely share files directly between two users using WebRTC.
    *   Features a robust download mechanism compatible with mobile devices.
*   **Visual Design:**
    *   Modern, clean interface with a professional color scheme.
    *   Responsive layout for both desktop and mobile web.
    *   Custom favicon for brand identity.
*   **Technology Stack:**
    *   Next.js (React Framework)
    *   Socket.IO for real-time communication.
    *   WebRTC for peer-to-peer connections.
    *   Capacitor for native mobile app conversion.

---

## Current Plan: Convert to Native Mobile App

The following steps will be executed to convert the existing Next.js web application into a native mobile app for iOS and Android using Capacitor.

1.  **Install Capacitor:** Install the necessary Capacitor command-line tools and platform libraries (`@capacitor/cli`, `@capacitor/core`, `@capacitor/android`, `@capacitor/ios`).
2.  **Configure Next.js for Static Export:** Modify `next.config.js` to enable `output: 'export'` and disable image optimization, which is required for Capacitor integration.
3.  **Initialize Capacitor Project:** Create the `capacitor.config.json` file, defining the application's name and ID.
4.  **Add Native Platforms:** Generate the native Android and iOS project folders.
5.  **Provide Next Steps:** Instruct the user on how to build the web assets and sync them with the native projects to prepare for development in Android Studio and Xcode.
