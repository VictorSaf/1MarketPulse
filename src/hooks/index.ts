/**
 * Central export for all PULSE data hooks
 */

export { useStockQuote } from './useStockQuote';
export type { UseStockQuoteOptions, UseStockQuoteResult } from './useStockQuote';

export { useCryptoPrice } from './useCryptoPrice';
export type { UseCryptoPriceOptions, UseCryptoPriceResult } from './useCryptoPrice';

export { useFearGreed } from './useFearGreed';
export type { UseFearGreedOptions, UseFearGreedResult } from './useFearGreed';

export { useMarketNews, useCompanyNews, useCryptoNews, useForexNews } from './useMarketNews';
export type { UseMarketNewsOptions, UseMarketNewsReturn } from './useMarketNews';

export { useSentimentAnalysis, useSingleSentiment, useMarketBrief, useMarketDNA } from './useSentimentAnalysis';
export type { UseSentimentAnalysisOptions, UseSentimentAnalysisReturn } from './useSentimentAnalysis';

export { useAdminStats } from './useAdminStats';
export type { UseAdminStatsResult, AdminStats, ServiceHealth, ServiceStats, CacheStats, ApiCallStats } from './useAdminStats';

export { useEconomicCalendar } from './useEconomicCalendar';
export type { UseEconomicCalendarOptions, UseEconomicCalendarResult } from './useEconomicCalendar';

export { useBackendHealth } from './useBackendHealth';
export type { BackendHealthStatus } from './useBackendHealth';
