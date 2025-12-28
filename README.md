# 1MarketPulse

**Your AI-Powered Market Intelligence Platform**

A comprehensive market intelligence and financial education platform featuring real market data, AI-driven insights powered by Ollama, and gamified learning experiences.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue.svg)
![Hono](https://img.shields.io/badge/Hono-4.x-orange.svg)
![Ollama](https://img.shields.io/badge/Ollama-AI-purple.svg)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)

## Features

- **Real-time Market Data** - Live quotes from Alpha Vantage, Finnhub, Yahoo Finance
- **AI-Powered Insights** - Local LLM via Ollama (qwen2.5, llama3.2)
- **AI Trading Coach** - Interactive chat with personalized advice
- **Morning Brief** - AI-generated daily market summary
- **Paper Trading** - Practice trading without risk
- **Daily Challenges** - Gamified learning with XP rewards
- **Authentication** - Secure login with JWT tokens
- **Admin Dashboard** - System settings and API management

## Quick Start

### Prerequisites

- Node.js 20.x or higher
- Ollama installed locally (for AI features)
- API keys for market data (see Environment Variables)

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit with your API keys
nano .env
```

### 3. Start Ollama (for AI features)

```bash
# Start Ollama service
ollama serve

# Pull required models (in another terminal)
ollama pull llama3.2:3b
ollama pull qwen2.5:14b  # Optional, for better quality
```

### 4. Start Development Servers

```bash
# Terminal 1: Start backend API
cd server && npm run dev

# Terminal 2: Start frontend
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`

### Default Login

```
Email: admin@pulse.local
Password: admin123
```

## Docker Deployment

### Production

```bash
# Build and start all services
docker-compose up -d

# Initialize Ollama models (first time only)
docker-compose --profile init run ollama-init
```

### Development

```bash
# Start backend + Ollama only (frontend via npm run dev)
docker-compose -f docker-compose.dev.yml up -d
```

## Project Structure

```
Pulse2/
├── src/                      # Frontend source
│   ├── app/
│   │   ├── components/       # React components
│   │   └── pages/           # Page components
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API clients & services
│   └── styles/              # CSS styles
├── server/                   # Backend API
│   └── src/
│       ├── routes/          # API routes
│       ├── services/        # Backend services
│       └── config/          # Configuration
├── docker-compose.yml        # Production Docker config
├── docker-compose.dev.yml    # Development Docker config
└── Dockerfile               # Frontend container
```

## Environment Variables

Create a `.env` file in the project root:

```env
# Market Data APIs
ALPHAVANTAGE_API_KEY=your_key_here      # Required - get free at alphavantage.co
FINNHUB_API_KEY=your_key_here           # Optional - get free at finnhub.io
FMP_API_KEY=your_key_here               # Optional - financialmodelingprep.com
FRED_API_KEY=your_key_here              # Optional - fred.stlouisfed.org
NEWS_API_KEY=your_key_here              # Optional - newsapi.org

# AI Configuration
OLLAMA_HOST=http://localhost:11434      # Ollama server URL

# Authentication
JWT_SECRET=your-secret-key-change-in-production

# Server
PORT=3001
NODE_ENV=development
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/auth/me` | Get current user |

### Market Data
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/quotes/:symbol` | Get stock quote |
| GET | `/api/quotes/batch` | Get multiple quotes |
| GET | `/api/fear-greed` | Fear & Greed Index |
| GET | `/api/news` | Market news feed |

### AI Features
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/ai/health` | AI service status |
| POST | `/api/ai/sentiment` | Analyze text sentiment |
| POST | `/api/ai/morning-brief` | Generate morning brief |
| POST | `/api/ai/coaching-tip` | Get coaching tip |
| POST | `/api/ai/generate` | General AI generation |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/settings` | Get system settings |
| PUT | `/api/admin/settings` | Update settings |

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS 4
- shadcn/ui components
- Recharts (visualizations)
- Zustand (state management)

### Backend
- Hono (web framework)
- Node.js 20
- JWT authentication
- Ollama integration

### AI
- Ollama (local LLM)
- qwen2.5:14b (primary model)
- llama3.2:3b (fast model)

### Infrastructure
- Docker & Docker Compose
- Nginx (production)

## Development

### Available Scripts

```bash
# Frontend
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview build

# Backend
cd server
npm run dev          # Start with hot reload
npm run build        # Compile TypeScript
npm start            # Run production

# Docker
docker-compose up -d                    # Start production
docker-compose -f docker-compose.dev.yml up -d  # Start development
docker-compose down                     # Stop all services
```

### Code Style

- TypeScript strict mode
- ESLint + Prettier
- Component-based architecture
- Custom hooks for data fetching

## Troubleshooting

### Ollama not connecting
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Restart Ollama
ollama serve
```

### API rate limits
- Alpha Vantage: 5 calls/minute (free tier)
- Finnhub: 60 calls/minute (free tier)
- Use caching to minimize API calls

### Docker GPU issues
```bash
# For systems without NVIDIA GPU, comment out the GPU section in docker-compose.yml
# deploy:
#   resources:
#     reservations:
#       devices:
#         - driver: nvidia
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Credits

- UI Components: [shadcn/ui](https://ui.shadcn.com/)
- Icons: [Lucide](https://lucide.dev/)
- AI: [Ollama](https://ollama.ai/)
- Market Data: Alpha Vantage, Finnhub, Yahoo Finance

---

Built with Claude Code
