# MailMate

A Simple full-stack Gmail IMAP viewer application that allows users to securely access and manage their Gmail inbox. Built with Next.js (frontend) and Express.js (backend), featuring Google OAuth 2.0 authentication and IMAP email fetching.

## 🌐 Live Application

**Backend API:** [https://mailmate-server-production-p8urd.ondigitalocean.app/](https://mailmate-server-production-p8urd.ondigitalocean.app/)

**API Documentation:** [https://mailmate-server-production-p8urd.ondigitalocean.app/api-docs](https://mailmate-server-production-p8urd.ondigitalocean.app/api-docs)

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm, yarn, or pnpm
- MySQL database (for backend)
- Google OAuth 2.0 credentials
- Docker (optional)

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/moshdev2213/MailMate.git
cd MailMate
```

### 2. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Set up environment variables
# Create .env file with required variables (see server/README.md)

# Set up database
npm run prisma:generate
npm run prisma:migrate

# Start development server
npm run dev
```

The backend will run on `http://localhost:3000`

### 3. Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Set up environment variables
# Create .env.local file:
# NEXT_PUBLIC_API_URL=http://localhost:3000

# Start development server
npm run dev
```

The frontend will run on `http://localhost:3000` (or next available port)

## 📁 Project Structure

```
MailMate/
├── server/                 # Backend API (Express.js)
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   └── config/         # Configuration files
│   ├── prisma/             # Database schema & migrations
│   └── Dockerfile
│
├── client/                 # Frontend (Next.js)
│   ├── app/                # Next.js App Router pages
│   ├── components/         # React components
│   ├── lib/                # Utilities & API clients
│   └── Dockerfile
│
└── README.md               # This file
```

## 🔑 Key Components

### Backend API Endpoints
- `GET /api/health` - Health check
- `GET /api/auth/google` - Initiate OAuth
- `GET /api/auth/google/callback` - OAuth callback
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user
- `GET /api/email` - Get emails (with pagination & search)

### Frontend Pages
- `/` - Home/Landing page
- `/login` - Login page (OAuth initiation)
- `/auth/callback` - OAuth callback handler
- `/dashboard` - Email dashboard

## 🐳 Docker Deployment

### Backend
```bash
cd server
docker build -t mailmate-server .
docker run -p 3000:3000 --env-file .env mailmate-server
```

### Frontend
```bash
cd client
docker build --build-arg NEXT_PUBLIC_API_URL=<api-url> -t mailmate-client .
docker run -p 3000:3000 mailmate-client
```

## 📚 Documentation

For detailed documentation, please refer to:
- **[Server README](./server/README.md)** - Backend setup, API documentation, and deployment
- **[Client README](./client/README.md)** - Frontend setup, components, and deployment

## 🔒 Security

- HTTP-only cookies for token storage
- Encrypted refresh tokens (AES-256-GCM)
- JWT-based authentication
- CORS protection
- Input validation

## 📝 Environment Variables

### Backend (server/.env)
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=mysql://user:password@host:port/database
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
ENCRYPTION_KEY=your_32_char_encryption_key
FRONTEND_URL=http://localhost:3000
```

### Frontend (client/.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 👤 Author

**moshdev2213**

- GitHub: [@moshdev2213](https://github.com/moshdev2213)
- Repository: [MailMate](https://github.com/moshdev2213/MailMate)

---

**Note:** Make sure to set up your Google OAuth credentials in the Google Cloud Console and configure the callback URLs correctly for authentication to work.

