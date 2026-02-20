# Unrot

Unrot is a comprehensive full-stack application built with an Expo React Native frontend and a Python backend. Its primary features include real-time news aggregation based on specific topics and dynamic, interactive quiz generation to engage and test users' knowledge.

## Architecture

- **Frontend**: A cross-platform mobile application utilizing Expo Router for navigation and Expo EAS for builds (`eas.json`).
- **Backend**: A robust Python service providing APIs for authentication, news fetching (via DuckDuckGo Search API), quiz generation, and data storage. It is pre-configured for deployment on Render via `render.yaml`.

## Features

- **Topic-based News**: Fetches the latest global news matching user-defined topics.
- **Interactive Quizzes**: Generates dynamic quizzes based on aggregated news or topics.
- **Cross-Platform**: Accessible on iOS, Android, and Web platforms using a unified codebase.

## Getting Started

### Prerequisites

- Node.js & npm (for the frontend)
- Python 3.x & pip (for the backend)

### Frontend Environment

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start the Expo development server:**
   ```bash
   npx expo start
   ```

### Backend Environment

1. **Navigate to the backend directory:**

   ```bash
   cd backend
   ```

2. **Install required Python packages:**

   ```bash
   pip install -r requirements.txt
   ```

3. **Run the backend server:**
   ```bash
   python main.py
   ```

## Key Components

### Backend Modules

- `news_service.py`: Scraping logic connecting to DuckDuckGo search for the latest topic news.
- `quiz_service.py` & `quiz.py`: The core logic for preparing, generation, and evaluation of quizzes.
- `auth.py`: Authentication handler for managing user sessions.
- `models.py`: The robust data models defining application structure.
- `main.py`: Fast/Flask/Standard Entry point running the backend application.

## Deployment Strategy

- **Client (Frontend)**: Utilizes Expo Application Services (EAS) for streamlined deployment and OTA updates.
- **Server (Backend)**: Contains a `render.yaml` for straightforward PaaS deployment on Render.
