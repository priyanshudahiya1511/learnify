# Learnify

A mini Learning Management System (LMS) mobile app built using React Native Expo.

---

## Purpose

This project was built to demonstrate real-world mobile development skills including authentication, WebView integration, performance optimization, and scalable architecture.

---

## Demo

Watch the demo here:  
https://drive.google.com/file/d/1mLixI9oDfXOYd_EBjgTDDVyLVyhHOGwd/view?usp=drive_link

---

## Features

### Authentication

- User login and registration
- Secure token storage using Expo SecureStore
- Auto-login on app restart
- Logout functionality

### Course Catalog

- Browse and search courses
- Pull-to-refresh support
- Bookmark courses with local persistence

### Course Details

- View detailed course information
- Bookmark toggle
- Enroll button with feedback

### WebView

- Embedded course content viewer
- Native to WebView communication
- WebView to Native communication

### Profile

- Display user information
- Update profile image
- Show basic stats

### Notifications

- Bookmark milestone notification
- 24-hour inactivity reminder

### Offline Support

- Network detection
- Offline banner
- Retry failed requests

---

## Screenshots

> Images are inside: `assets/screenshots/`

### Login Screen

![Login](./assets/screenshots/login.png)

### Course Detail Screen

![Course Detail](./assets/screenshots/course-detail.png)

### WebView Screen

![WebView](./assets/screenshots/webview.png)

### Profile Screen

![Profile](./assets/screenshots/profile.png)

### Offline Mode

![Offline](./assets/screenshots/offline.png)

---

## Tech Stack

- React Native Expo
- TypeScript
- Expo Router
- NativeWind
- AsyncStorage
- Expo SecureStore
- Axios
- react-native-webview
- expo-notifications
- expo-image-picker
- @legendapp/list
- @react-native-community/netinfo

---

## Project Structure

app/
(auth)/
(tabs)/
courses/
components/
hooks/
services/
lib/
assets/

---

## API Used

Base URL: https://api.freeapi.app

- POST /api/v1/users/register
- POST /api/v1/users/login
- POST /api/v1/users/logout
- GET /api/v1/users/current-user
- GET /api/v1/public/randomproducts
- GET /api/v1/public/randomproducts/:id
- GET /api/v1/public/randomusers

---

## Architecture

- SecureStore for tokens (secure storage)
- AsyncStorage for bookmarks and preferences
- Axios interceptors for retry and error handling
- Expo Router for file-based navigation
- WebView communication using injected JavaScript and postMessage

---

## Performance Optimizations

- LegendList for efficient rendering
- React.memo to prevent unnecessary re-renders
- useCallback for stable functions
- Optimized list rendering

---

## Error Handling

- Retry mechanism for API calls
- Timeout handling
- Offline UI feedback
- WebView fallback handling

---

## Security

- Tokens stored securely using SecureStore
- No sensitive data stored in AsyncStorage
- API calls handled via interceptors

---

## Limitations

- Some images may not load in Expo Go (fallback used)
- SecureStore may not persist in iOS Simulator
- Only local notifications supported
- Mock APIs used

---

## Build Instructions

### Android

```bash
npx expo run:android
Production APK
npm install -g eas-cli
eas build --platform android --profile preview
Author

Priyanshu Dahiya
GitHub: https://github.com/priyanshudahiya1511

Email: priyanshudahiya1234@gmail.com
```
