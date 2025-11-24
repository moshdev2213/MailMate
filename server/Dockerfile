# -------------------------------
# Stage 1: Build the TypeScript app
# -------------------------------
FROM node:lts-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY tsconfig*.json ./

RUN npm install

# Copy Prisma schema first
COPY prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

# Copy the rest of the source
COPY . .

# Build the app (TS → JS)
RUN npm run build

# -------------------------------
# Stage 2: Production image
# -------------------------------
FROM node:lts-alpine AS runner

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy the generated Prisma Client from builder stage
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy the built dist folder from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

CMD ["npm", "run","prod"]