# 🌱 AgronomAI

AI-powered farming assistant for farmers in Uzbekistan. It helps plan crop work, track the season, predict harvests and trade agricultural products in one app.

## Features

- **Smart Calendar**: AI-generated crop task schedule, editable by the user
- **Harvest Prediction**: yield estimates powered by the Gemini API
- **Marketplace**: farmers can post and browse product listings with photos
- **Alerts**: notifications based on the user's region (Khorezm)
- **Premium Subscription**: gated features with a paywall flow
- **Admin Dashboard**: platform statistics and management
- **Authentication**: registration and login with JWT, passwords hashed with bcrypt
- **Multi-language**: Uzbek, English and Russian
- **Mobile ready**: Android build via Capacitor

## Tech Stack

| Part | Technologies |
|------|--------------|
| Frontend | React, TypeScript, Vite, Capacitor |
| Backend | Node.js, TypeScript |
| Database | MongoDB (Mongoose) |
| AI | Google Gemini API |
| Auth | JWT, bcrypt |

## Project Structure

```
FrontAGRO2025/   React + TypeScript client (and Android project)
BackAGRO2025/    Node.js REST API
```

## Getting Started

**Prerequisites:** Node.js and a MongoDB instance (local or Atlas).

### 1. Backend

```bash
cd BackAGRO2025
npm install
```

Create a `.env` file in `BackAGRO2025`:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
GOOGLE_API_KEY=your_gemini_api_key
```

Start the server:

```bash
npm run dev
```

### 2. Frontend

```bash
cd FrontAGRO2025
npm install
```

Create a `.env.local` file in `FrontAGRO2025`:

```
GEMINI_API_KEY=your_gemini_api_key
```

Start the app:

```bash
npm run dev
```

## Security Notes

- Secrets are loaded from environment variables and are not committed to the repository.
- Passwords are hashed with bcrypt before being stored.
- Protected routes require a valid JWT.

## Development Notes

This project was built with the help of AI tools (Google AI Studio) for code generation and debugging. I designed the app's features and structure, reviewed and tested the code, and handled integration, deployment and security fixes myself.

## Author

**Ilhom Tajimuratov**
GitHub: [@ByTajimuratov](https://github.com/ByTajimuratov)
