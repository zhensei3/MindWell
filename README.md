# MindWell

**MindWell** is a premium, privacy-focused mental health tracking application designed to help users monitor their well-being through mood tracking, journaling, and goal setting. Built with **Next.js 14**, **React**, **Tailwind CSS**, and **MySQL**, it features a modern, responsive UI with smooth animations and real-time analytics.

## Features

### 🎨 Premium UI/UX
*   **Smooth Transitions**: Global page transitions with `framer-motion` for a native-app feel.
*   **Skeleton Loading**: Premium loading states that mimic content layout for better perceived performance.
*   **Responsive Design**: Fully optimized for Desktop, Tablet, and Mobile (with custom Bottom Navigation).
*   **Modern Aesthetics**: Glassmorphism, gradients, and `Lucide` icons.

### 📊 Analytics & Core Features
*   **Mood Tracker**: Log daily moods (1-10) with notes.
*   **Dashboard Analytics**: Visual **Line Chart** (using `recharts`) showing mood trends over time.
*   **Journaling**: Create, edit, and delete entries with search functionality.
*   **Goal Setting**: Set and track personal growth goals.
*   **Profile Management**: Update username, email, and password securely.

### 🔒 Security & Tech Stack
*   **Framework**: Next.js 14 (App Router)
*   **Styling**: Tailwind CSS
*   **Database**: MySQL (via `mysql2`)
*   **Authentication**: Custom JWT-based auth with secure HttpOnly cookies.
*   **Charts**: Recharts
*   **Animations**: Framer Motion

## Instructions for Setup

1.  **Prerequisites**:
    *   Node.js installed.
    *   MySQL running (e.g., XAMPP).

2.  **Database Setup**:
    *   Create a database named `mindwell_db`.
    *   Import the provided `.sql` file (if available) or create tables for `users`, `moods`, `journal_entries`, and `goals`.
    *   *Note: Database configuration is located in `lib/db.ts` (default: root user, no password).*

3.  **Installation**:
    ```bash
    npm install
    ```

4.  **Running the App**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Submission Details
*   **App Name**: MindWell
*   **GitHub Repository**: [Insert your GitHub Link Here]
*   **Developed by**: [John Robert Gaufo, Mark Henry Galosmo, Christian Frades]

