/**
 * Cryptocurrency type definitions for PULSE
 */

/**
 * Cryptocurrency price data
 */
export interface CryptoPrice {
  id: string; // 'bitcoin', 'ethereum'
  symbol: string; // 'BTC', 'ETH'
  name: string; // 'Bitcoin', 'Ethereum'
  price: number;
  change24h: number;
  changePercent24h: number;
  marketCap: number;
  volume24h: number;
  rank?: number;
  timestamp: number;
  source?: string;
  cached?: boolean;
}

/**
 * Crypto market data (extended)
 */
export interface CryptoMarketData extends CryptoPrice {
  high24h: number;
  low24h: number;
  ath: number; // All-time high
  athDate: string;
  atl: number; // All-time low
  atlDate: string;
  circulatingSupply: number;
  maxSupply: number | null;
}

/**
 * Crypto symbol to CoinGecko ID mapping
 */
export const CRYPTO_ID_MAP: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
  DOGE: 'dogecoin',
  ADA: 'cardano',
  XRP: 'ripple'
};
