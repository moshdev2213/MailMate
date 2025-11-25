# MailMate Client

React frontend for MailMate - Gmail IMAP viewer with OAuth2 authentication.

## Features

- ✅ OAuth2 Google Authentication
- ✅ Redux Toolkit for state management
- ✅ Tailwind CSS for styling
- ✅ Protected routes
- ✅ Token refresh handling
- ✅ Error handling with user-friendly messages

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the client directory:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

3. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/       # Reusable components
│   └── ProtectedRoute.tsx
├── config/          # Configuration files
│   └── api.ts
├── pages/           # Page components
│   ├── LoginPage.tsx
│   ├── AuthCallbackPage.tsx
│   └── DashboardPage.tsx
├── services/        # API services
│   ├── api.ts       # Axios instance with interceptors
│   └── auth.service.ts
├── store/           # Redux store
│   ├── slices/
│   │   └── authSlice.ts
│   ├── hooks.ts     # Typed Redux hooks
│   └── store.ts
└── types/           # TypeScript types
    └── auth.types.ts
```

## Authentication Flow

1. User clicks "Continue with Google" on the login page
2. Frontend redirects to `/api/auth/google` (server endpoint)
3. Server redirects to Google OAuth consent screen
4. After user consent, Google redirects to server callback `/api/auth/google/callback`
5. Server processes OAuth code, creates/updates user, generates JWT tokens
6. Server redirects to frontend `/auth/callback` with tokens in URL params
7. Frontend extracts tokens, stores in Redux and localStorage
8. User is redirected to dashboard

## Environment Variables

- `VITE_API_BASE_URL`: Base URL for the API server (default: `http://localhost:3000/api`)

## Technologies

- React 19
- TypeScript
- Redux Toolkit
- React Router
- Axios
- Tailwind CSS
- Vite
