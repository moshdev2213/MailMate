# MailMate Server

A simple Node.js/Express backend API for MailMate - a full-stack Gmail IMAP viewer application. This server provides authentication via Google OAuth, secure token management, and email fetching capabilities using IMAP.

## 🌐 Live Server

**Production URL:** [https://mailmate-server-production-p8urd.ondigitalocean.app/](https://mailmate-server-production-p8urd.ondigitalocean.app/)

**API Documentation:** [https://mailmate-server-production-p8urd.ondigitalocean.app/api-docs](https://mailmate-server-production-p8urd.ondigitalocean.app/api-docs)

## ✨ Features

- 🔐 **Google OAuth 2.0 Authentication** - Secure user authentication via Google
- 📧 **Gmail IMAP Integration** - Fetch and display emails from Gmail accounts
- 🔒 **JWT Token Management** - Access and refresh token system with encryption
- 📊 **Email Metadata Storage** - Efficient storage and retrieval of email data
- 🔍 **Email Search & Pagination** - Search emails with pagination support
- 📝 **Swagger API Documentation** - Interactive API documentation
- 🐳 **Docker Support** - Containerized deployment ready
- 📈 **Structured Logging** - Winston-based logging with ELK stack support
- 🛡️ **Error Handling** - Comprehensive error handling middleware
- ⚡ **TypeScript** - Full type safety and modern JavaScript features

## 🛠️ Tech Stack

- **Runtime:** Node.js (LTS)
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MySQL (via Prisma ORM)
- **Authentication:** Google OAuth 2.0, JWT
- **Email Protocol:** IMAP (via imapflow)
- **Documentation:** Swagger/OpenAPI
- **Logging:** Winston
- **Containerization:** Docker

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MySQL database
- Google OAuth 2.0 credentials (Client ID & Secret)
- Docker (optional, for containerized deployment)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/moshdev2213/MailMate.git
   cd MailMate/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the `server` directory with the following variables:
   ```env
   NODE_ENV=development
   PORT=3000
   
   # Database Configuration
   DATABASE_URL=mysql://user:password@host:port/database
   DATABASE_HOST=localhost
   DATABASE_USER=root
   DATABASE_PASSWORD=your_password
   DATABASE_NAME=mailmate_db
   DATABASE_PORT=3306
   DATABASE_CONNECTION_LIMIT=20
   DATABASE_CONNECTION_TIMEOUT=30000
   
   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
   
   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
   
   # Encryption Key (for storing refresh tokens)
   ENCRYPTION_KEY=your_32_character_encryption_key
   
   # Frontend URL
   FRONTEND_URL=http://localhost:5173
   
   # Logging Configuration
   LOG_LEVEL=info
   ELASTICSEARCH_URL=http://elasticsearch:9200
   LOGSTASH_HOST=logstash
   LOGSTASH_PORT=5044
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   npm run prisma:generate
   
   # Run database migrations
   npm run prisma:migrate
   ```

## 🏃 Running the Server

### Development Mode
```bash
npm run dev
```
The server will start on `http://localhost:3000` with hot-reload enabled.

### Production Mode
```bash
# Build the TypeScript code
npm run build

# Start the production server
npm run prod
```

### Staging Mode
```bash
npm run build
npm run staging
```

## 🐳 Docker Deployment

### Build the Docker image
```bash
docker build -t mailmate-server .
```

### Run the container
```bash
docker run -p 3000:3000 --env-file .env mailmate-server
```

The Dockerfile uses a multi-stage build for optimized production images.

## 📚 API Endpoints

### Health Check
- `GET /api/health` - Server health check

### Authentication
- `GET /api/auth/google` - Initiate Google OAuth flow
- `GET /api/auth/google/callback` - Handle OAuth callback
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user info (requires auth)
- `POST /api/auth/logout` - Logout user (requires auth)

### Email
- `GET /api/email` - Get emails with pagination (requires auth)
  - Query parameters:
    - `limit` (default: 20) - Number of emails per page
    - `offset` (default: 0) - Pagination offset
    - `search` - Search term to filter emails
    - `refresh` (default: false) - Fetch fresh emails from Gmail
    - `fetchLimit` (default: 50) - Max emails to fetch when refresh=true

## 📖 API Documentation

Interactive API documentation is available via Swagger UI:

- **Local:** http://localhost:3000/api-docs
- **Production:** https://mailmate-server-production-p8urd.ondigitalocean.app/api-docs
- **JSON Spec:** http://localhost:3000/api-docs.json

## 🗂️ Project Structure

```
server/
├── src/
│   ├── config/          # Configuration files
│   │   ├── app.ts       # App configuration
│   │   ├── env.ts       # Environment variables
│   │   ├── prisma.ts    # Prisma client setup
│   │   ├── swagger.ts   # Swagger configuration
│   │   └── logging.ts   # Logging configuration
│   ├── controllers/     # Route controllers
│   │   ├── auth.controller.ts
│   │   └── email.controller.ts
│   ├── middleware/      # Express middleware
│   │   ├── auth.middleware.ts
│   │   └── error.middleware.ts
│   ├── routes/          # API routes
│   │   ├── auth.routes.ts
│   │   ├── email.routes.ts
│   │   └── index.routes.ts
│   ├── services/        # Business logic
│   │   ├── email.service.ts
│   │   ├── jwt.service.ts
│   │   ├── token.service.ts
│   │   └── user.service.ts
│   ├── repositories/    # Data access layer
│   │   ├── email.repository.ts
│   │   └── user.repository.ts
│   ├── utils/           # Utility functions
│   │   ├── crypto.util.ts
│   │   ├── logger.util.ts
│   │   ├── response.util.ts
│   │   ├── validation.util.ts
│   │   └── xoauth.util.ts
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── migrations/      # Database migrations
├── dist/                # Compiled JavaScript (generated)
├── logs/                # Application logs
├── Dockerfile           # Docker configuration
├── package.json         # Dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

## 🗄️ Database Schema

### User Model
- `id` - Primary key
- `googleId` - Unique Google user ID
- `email` - User email address
- `name` - User display name
- `refreshToken` - Encrypted refresh token (AES-256-GCM)
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp

### EmailMetadata Model
- `id` - Primary key
- `userId` - Foreign key to User
- `gmailUid` - Gmail unique identifier
- `from` - Sender email address
- `subject` - Email subject
- `messageId` - Email message ID
- `date` - Email date/time

## 📝 Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Start development server with nodemon
- `npm run dev:tsx` - Start development server with tsx
- `npm run prod` - Start production server
- `npm run staging` - Start staging server
- `npm run start` - Start server (default)
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## 🔒 Security Features

- **Token Encryption:** Refresh tokens are encrypted using AES-256-GCM before storage
- **JWT Authentication:** Secure access tokens with configurable expiration
- **CORS Protection:** Configurable CORS policies
- **Input Validation:** Request validation middleware
- **Error Handling:** Secure error responses without exposing sensitive information

## 📊 Logging

The application uses Winston for structured logging with support for:
- Console output (development)
- File logging
- ELK stack integration (Elasticsearch, Logstash, Kibana)

Log levels: `error`, `warn`, `info`, `debug`

## 👤 Author

**moshdev2213**

- GitHub: [@moshdev2213](https://github.com/moshdev2213)
- Repository: [MailMate](https://github.com/moshdev2213/MailMate)
---

**Note:** Make sure to set up your Google OAuth credentials in the Google Cloud Console and configure the callback URL correctly for authentication to work.

