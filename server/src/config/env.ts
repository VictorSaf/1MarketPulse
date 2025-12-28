// Load environment variables from .env file
import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

// Environment configuration
export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  // API Keys
  finnhubApiKey: process.env.FINNHUB_API_KEY || '',

  // CORS
  corsOrigins: (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:5174')
    .split(',')
    .map(origin => origin.trim()),

  // Cache TTL (seconds)
  cacheTtl: {
    quotes: parseInt(process.env.CACHE_TTL_QUOTES || '15', 10),
    news: parseInt(process.env.CACHE_TTL_NEWS || '300', 10),
    sentiment: parseInt(process.env.CACHE_TTL_SENTIMENT || '3600', 10),
    crypto: parseInt(process.env.CACHE_TTL_CRYPTO || '10', 10),
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10), // 1 minute
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },

  // API Endpoints
  api: {
    finnhub: 'https://finnhub.io/api/v1',
    coingecko: 'https://api.coingecko.com/api/v3',
    fearGreed: 'https://production.dataviz.cnn.io/index/fearandgreed/graphdata',
  },

  // Ollama Configuration
  ollamaHost: process.env.OLLAMA_HOST || 'http://localhost:11434',
} as const;

// Validate required environment variables
export function validateEnv() {
  const errors: string[] = [];

  if (!config.finnhubApiKey) {
    errors.push('FINNHUB_API_KEY is required');
  }

  if (errors.length > 0) {
    console.error('Environment validation failed:');
    errors.forEach(error => console.error(`  - ${error}`));
    throw new Error('Invalid environment configuration');
  }
}
