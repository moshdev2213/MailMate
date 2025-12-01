# MailMate Client

A modern, responsive Next.js frontend application for MailMate - a full-stack Gmail IMAP viewer.

## 🌐 Live Application

**Backend API:** [https://mailmate-server-production-p8urd.ondigitalocean.app/](https://mailmate-server-production-p8urd.ondigitalocean.app/)

**API Documentation:** [https://mailmate-server-production-p8urd.ondigitalocean.app/api-docs](https://mailmate-server-production-p8urd.ondigitalocean.app/api-docs)

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm, yarn, or pnpm
- Backend API server running (see [server README](../server/README.md))
- Docker (optional, for containerized deployment)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/moshdev2213/MailMate.git
   cd MailMate/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the `client` directory:
   ```env
   NEXT_PUBLIC_API_URL=https://mailmate-server-production-p8urd.ondigitalocean.app
   ```
   
   For local development:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```
The application will start on `http://localhost:3000` with hot-reload enabled.

### Production Build
```bash
# Build the application
npm run build

# Start the production server
npm start
```

### Linting
```bash
npm run lint
```

## 🐳 Docker Deployment

### Build the Docker image
```bash
docker build --build-arg NEXT_PUBLIC_API_URL=https://mailmate-server-production-p8urd.ondigitalocean.app -t mailmate-client .
```

### Run the container
```bash
docker run -p 3000:3000 mailmate-client
```

The Dockerfile uses a multi-stage build for optimized production images. The `NEXT_PUBLIC_API_URL` build argument is embedded at build time.

## 📁 Project Structure

```
client/
├── app/                      # Next.js App Router pages
│   ├── auth/
│   │   └── callback/         # OAuth callback handler
│   ├── dashboard/            # Email dashboard page
│   ├── login/                # Login page
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   └── globals.css           # Global styles
├── components/               # React components
│   ├── dashboard/            # Dashboard components
│   │   └── dashboard-client.tsx
│   ├── email/                # Email-related components
│   │   ├── email-card.tsx
│   │   ├── email-list.tsx
│   │   ├── pagination-controls.tsx
│   │   └── search-bar.tsx
│   ├── layout/               # Layout components
│   │   ├── error-alert.tsx
│   │   └── header.tsx
│   ├── ui/                   # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ... (40+ UI components)
│   └── theme-provider.tsx    # Theme context provider
├── lib/                      # Utility libraries
│   ├── api/                  # API client functions
│   │   ├── auth.ts           # Authentication API
│   │   ├── client.ts         # API client config
│   │   ├── email.ts          # Email API
│   │   ├── fetchWithAuth.ts  # Authenticated fetch wrapper
│   │   └── token.ts          # Token management
│   └── utils.ts              # Utility functions
├── types/                    # TypeScript type definitions
│   └── index.ts
├── public/                   # Static assets
│   ├── icon.svg
│   └── ...
├── styles/                   # Additional styles
│   └── globals.css
├── Dockerfile                # Docker configuration
├── next.config.mjs          # Next.js configuration
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── components.json          # shadcn/ui configuration
```

## 🔑 Key Features Explained

### Authentication Flow
1. User clicks "Sign In with Gmail" on the home page
2. Redirects to `/login` which initiates Google OAuth
3. After OAuth callback, tokens are stored in HTTP-only cookies
4. User is redirected to `/dashboard` with authenticated access

### Email Management
- **Email List:** Displays paginated list of emails from Gmail
- **Search:** Real-time search across email subjects and senders
- **Pagination:** Efficient pagination with configurable page size
- **Refresh:** Option to fetch fresh emails from Gmail IMAP

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 UI Components

The application uses [shadcn/ui](https://ui.shadcn.com/) - a collection of re-usable components built with Radix UI and Tailwind CSS. All components are located in `components/ui/` and can be customized as needed.

## 🌐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API server URL | Yes |

**Note:** `NEXT_PUBLIC_*` variables are embedded at build time and are available in the browser.

## 📱 Responsive Design

The application is fully responsive and optimized for:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1440px+)

## 🎯 API Integration

The client communicates with the backend API through:

- **Authentication:** `/api/auth/*` endpoints
- **Email:** `/api/email` endpoint
- **Health Check:** `/api/health` endpoint

All API calls are handled through the `lib/api/` modules with automatic authentication and error handling.

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set `NEXT_PUBLIC_API_URL` environment variable
3. Deploy automatically on push

### Docker
1. Build the image with the API URL:
   ```bash
   docker build --build-arg NEXT_PUBLIC_API_URL=<your-api-url> -t mailmate-client .
   ```
2. Run the container:
   ```bash
   docker run -p 3000:3000 mailmate-client
   ```

## 👤 Author

**moshdev2213**

- GitHub: [@moshdev2213](https://github.com/moshdev2213)
- Repository: [MailMate](https://github.com/moshdev2213/MailMate)

---

**Note:** Make sure the backend API server is running and accessible before starting the client application. The `NEXT_PUBLIC_API_URL` must point to a valid backend server URL.

