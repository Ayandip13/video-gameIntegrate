# 📱 Mobile Learning App (Expo)

This project is a mobile learning application built using **Expo (React Native + TypeScript)**.  
It demonstrates a continuous learning experience using **video playback with in-video activities** and an **offline games module**.

The focus of this project is **correct functionality, clean flow, and reliable state management**, not visual polish.

---

## 🚀 Features

### 1. Video Learning Module
- Displays a list of learning topics
- Selecting a topic starts video playback
- Video is interrupted **every 1 minute** by an activity
- User must complete the activity to continue watching
- Exactly **one activity per minute**
- Activities do not repeat once completed
- Video resumes automatically after activity completion

### 2. Games Module (Offline Support)
- Displays a list of games
- Games can be downloaded for offline play
- Games are HTML5-based and rendered using WebView
- Downloaded games are stored locally on the device
- Games can be played **without an internet connection**
- Downloaded games persist across app restarts

---

## 🧠 Technical Highlights

- **Expo (latest SDK)**
- **TypeScript**
- **expo-av** for video playback
- **expo-file-system (legacy)** for offline storage
- **react-native-webview** for HTML5 games
- **AsyncStorage** for persistence
- Clean, modular folder structure
- Deterministic state management
- Graceful handling of edge cases

---

## 🗂️ Project Structure

src/
├─ navigation/
│ └─ RootNavigator.tsx
├─ screens/
│ ├─ HomeScreen.tsx
│ ├─ VideoTopicsScreen.tsx
│ ├─ VideoPlayerScreen.tsx
│ ├─ GamesScreen.tsx
│ └─ GamePlayerScreen.tsx
├─ utils/
│ ├─ storage.ts
│ ├─ analytics.ts
│ └─ offlineGames.ts

---

## 🎬 Video Activity Logic

- Video playback time is tracked using `expo-av`
- Activities are generated based on video duration
- One activity triggers at:
  - 60s, 120s, 180s, etc.
- When triggered:
  - Video pauses automatically
  - Activity modal blocks playback
  - User must complete the activity
- Completed activities do not re-trigger
- Video resumes after activity completion

---

## 🎮 Offline Games Logic

- Games are HTML5-based
- Offline games are stored as local HTML files
- HTML content is written to the device filesystem
- Games are rendered using `WebView`
- Downloaded games persist using AsyncStorage
- Games can be played fully offline

---

## 📊 Analytics (Local Only)

Basic analytics events are logged locally for demonstration:
- `video_started`
- `activity_shown`
- `activity_completed`
- `game_downloaded`
- `game_played`

No external analytics services are used.

---

## ▶️ How to Run the Project

### Install dependencies
```bash
npm install
