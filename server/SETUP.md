# Backend Server Setup

## Option 1: Bun (Recommended - Fastest)

### Install Bun
```bash
curl -fsSL https://bun.sh/install | bash
```

### Install Dependencies
```bash
cd server
bun install
```

### Run Server
```bash
# Development (with hot reload)
bun run dev

# Production
bun run start
```

## Option 2: Node.js (Alternative)

The backend also works with Node.js if Bun is not available.

### Install Dependencies
```bash
cd server
npm install
```

### Run Server
```bash
# Development
npm run dev

# Production
npm start
```

## Verify Installation

1. Server should start on http://localhost:3001
2. Test health endpoint:
   ```bash
   curl http://localhost:3001/api/health
   ```

3. Expected response:
   ```json
   {
     "status": "ok",
     "uptime": 0.123,
     "timestamp": 1234567890,
     "version": "1.0.0"
   }
   ```

## Environment Variables

Make sure `.env` file exists in `/server` directory with:
```env
FINNHUB_API_KEY=your_key_here
PORT=3001
NODE_ENV=development
```

## Troubleshooting

### Port already in use
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### Cannot find Hono
```bash
# Reinstall dependencies
rm -rf node_modules
bun install  # or npm install
```

### CORS errors
Check that `CORS_ORIGIN` includes your frontend URL:
```env
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
```
