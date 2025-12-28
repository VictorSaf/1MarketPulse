import { useState, useMemo } from 'react';

import { TrendingUp, TrendingDown, Award, AlertTriangle, X, Loader2 } from 'lucide-react';

import { useStockQuote } from '@/hooks';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Progress } from './ui/progress';



interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  ytd: number;
  oneYear: number;
  threeYear: number;
  pe: number;
  peg: number;
  ps: number;
  trend: 'strong' | 'moderate' | 'weak';
  rsi: number;
  vs50dma: number;
  moat: number;
  aiRevenue: string;
  marketShare: number;
  // Additional metadata for UI state
  loading?: boolean;
  error?: Error | null;
  summary?: string;
}

// Mock metrics that cannot be fetched from basic stock API
// These would typically come from a financial data provider with fundamental data
interface StockMetrics {
  name: string;
  ytd: number;
  oneYear: number;
  threeYear: number;
  pe: number;
  peg: number;
  ps: number;
  trend: 'strong' | 'moderate' | 'weak';
  rsi: number;
  vs50dma: number;
  moat: number;
  aiRevenue: string;
  marketShare: number;
  summary: string;
}

const stockMetricsDatabase: Record<string, StockMetrics> = {
  NVDA: {
    name: 'NVIDIA Corp',
    ytd: 215,
    oneYear: 187,
    threeYear: 456,
    pe: 65,
    peg: 1.8,
    ps: 28,
    trend: 'strong',
    rsi: 68,
    vs50dma: 8,
    moat: 80,
    aiRevenue: '$15B',
    marketShare: 80,
    summary: 'Premium price for market leader. High risk, high reward. Dominant AI position.',
  },
  AMD: {
    name: 'Advanced Micro Devices',
    ytd: 89,
    oneYear: 72,
    threeYear: 145,
    pe: 45,
    peg: 1.2,
    ps: 9,
    trend: 'moderate',
    rsi: 58,
    vs50dma: 4,
    moat: 62,
    aiRevenue: '$3B',
    marketShare: 15,
    summary: 'Value alternative with good growth. Balanced choice. Growing AI presence.',
  },
  INTC: {
    name: 'Intel Corporation',
    ytd: -12,
    oneYear: -18,
    threeYear: -34,
    pe: 12,
    peg: 0,
    ps: 2,
    trend: 'weak',
    rsi: 42,
    vs50dma: -3,
    moat: 33,
    aiRevenue: '<$1B',
    marketShare: 5,
    summary: 'Turnaround story. Cheap but uncertain. Contrarian bet with recovery potential.',
  },
};

// Default metrics for stocks not in the database
const defaultMetrics: StockMetrics = {
  name: 'Unknown',
  ytd: 0,
  oneYear: 0,
  threeYear: 0,
  pe: 0,
  peg: 0,
  ps: 0,
  trend: 'moderate',
  rsi: 50,
  vs50dma: 0,
  moat: 50,
  aiRevenue: 'N/A',
  marketShare: 0,
  summary: 'No detailed analysis available for this stock.',
};

// Hook to fetch multiple stock quotes
function useMultipleStockQuotes(symbols: string[]) {
  const quote0 = useStockQuote({ symbol: symbols[0] || '', enabled: !!symbols[0] });
  const quote1 = useStockQuote({ symbol: symbols[1] || '', enabled: !!symbols[1] });
  const quote2 = useStockQuote({ symbol: symbols[2] || '', enabled: !!symbols[2] });
  const quote3 = useStockQuote({ symbol: symbols[3] || '', enabled: !!symbols[3] });
  const quote4 = useStockQuote({ symbol: symbols[4] || '', enabled: !!symbols[4] });

  return useMemo(() => {
    const quotes = [quote0, quote1, quote2, quote3, quote4];
    return symbols.map((symbol, index) => ({
      symbol,
      ...quotes[index],
    }));
  }, [symbols, quote0, quote1, quote2, quote3, quote4]);
}

export function ComparisonEngine() {
  const [selectedStocks, setSelectedStocks] = useState<string[]>(['NVDA', 'AMD', 'INTC']);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch real stock quotes
  const stockQuotes = useMultipleStockQuotes(selectedStocks);

  // Combine real price data with mock metrics
  const compareData = useMemo(() => {
    return stockQuotes
      .filter(quote => quote.symbol)
      .map(quote => {
        const metrics = stockMetricsDatabase[quote.symbol] || { ...defaultMetrics, name: quote.symbol };
        const hasRealData = quote.data && !quote.loading;

        return {
          symbol: quote.symbol,
          name: metrics.name,
          price: hasRealData ? quote.data!.price : 0,
          change: hasRealData ? quote.data!.changePercent : 0,
          ytd: metrics.ytd,
          oneYear: metrics.oneYear,
          threeYear: metrics.threeYear,
          pe: metrics.pe,
          peg: metrics.peg,
          ps: metrics.ps,
          trend: metrics.trend,
          rsi: metrics.rsi,
          vs50dma: metrics.vs50dma,
          moat: metrics.moat,
          aiRevenue: metrics.aiRevenue,
          marketShare: metrics.marketShare,
          // Additional metadata for UI
          loading: quote.loading,
          error: quote.error,
          summary: metrics.summary,
        };
      });
  }, [stockQuotes]);

  // Check if any stock is still loading
  const isAnyLoading = stockQuotes.some(q => q.loading);

  const removeStock = (symbol: string) => {
    setSelectedStocks(selectedStocks.filter((s) => s !== symbol));
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'strong':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'moderate':
        return <TrendingUp className="w-4 h-4 text-yellow-400" />;
      case 'weak':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
    }
  };

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return <Badge className="bg-yellow-500/20 text-yellow-300">🥇</Badge>;
      case 1:
        return <Badge className="bg-gray-400/20 text-gray-300">🥈</Badge>;
      case 2:
        return <Badge className="bg-orange-500/20 text-orange-300">🥉</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-white/10 backdrop-blur-sm">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            ⚖️ COMPARISON ENGINE
          </h2>
          <p className="text-sm text-gray-400">Compare stocks side-by-side in detail</p>
        </div>

        {/* Stock Selector */}
        <div className="max-w-md mx-auto mb-8">
          <div className="flex gap-2">
            <Input
              className="bg-gray-900/50 border-white/10 text-white"
              placeholder="Add stock to compare (e.g., AAPL)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
            />
            <Button className="bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30">
              Add
            </Button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-white/20">
                <th className="text-left py-4 px-4 text-sm text-gray-400 sticky left-0 bg-gray-900/95 backdrop-blur-sm">
                  Metric
                </th>
                {compareData.map((stock, index) => (
                  <th key={stock.symbol} className="py-4 px-4 min-w-[200px]">
                    <div className="text-center">
                      <div className="flex items-center justify-between mb-2">
                        {getRankBadge(index)}
                        <Button
                          className="text-gray-400 hover:text-white p-1"
                          size="sm"
                          variant="ghost"
                          onClick={() => removeStock(stock.symbol)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="text-lg font-bold text-white mb-1">{stock.symbol}</div>
                      <div className="text-xs text-gray-400 mb-2">{stock.name}</div>
                      {stock.loading ? (
                        <div className="flex flex-col items-center justify-center py-2">
                          <Loader2 className="w-6 h-6 text-blue-400 animate-spin mb-1" />
                          <span className="text-xs text-gray-500">Loading...</span>
                        </div>
                      ) : stock.error ? (
                        <div className="flex flex-col items-center justify-center py-2">
                          <AlertTriangle className="w-5 h-5 text-yellow-400 mb-1" />
                          <span className="text-xs text-yellow-400">Error loading</span>
                        </div>
                      ) : (
                        <>
                          <div className="text-2xl font-bold text-white mb-1">
                            ${stock.price.toFixed(2)}
                          </div>
                          <div
                            className={`text-sm font-semibold ${
                              stock.change >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}
                          >
                            {stock.change >= 0 ? '+' : ''}
                            {stock.change.toFixed(1)}%
                          </div>
                        </>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* Performance Section */}
              <tr className="bg-purple-500/5">
                <td
                  className="py-2 px-4 font-semibold text-purple-300 text-sm"
                  colSpan={compareData.length + 1}
                >
                  📈 PERFORMANCE
                </td>
              </tr>

              {/* YTD */}
              <tr className="border-b border-white/5 hover:bg-white/5">
                <td className="py-3 px-4 text-sm text-gray-300 sticky left-0 bg-gray-900/95">
                  YTD
                </td>
                {compareData.map((stock) => (
                  <td key={stock.symbol} className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span
                        className={`text-lg font-bold ${
                          stock.ytd >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {stock.ytd >= 0 ? '+' : ''}
                        {stock.ytd}%
                      </span>
                      {stock.ytd === Math.max(...compareData.map((s) => s.ytd)) &&
                        getRankBadge(0)}
                    </div>
                  </td>
                ))}
              </tr>

              {/* 1 Year */}
              <tr className="border-b border-white/5 hover:bg-white/5">
                <td className="py-3 px-4 text-sm text-gray-300 sticky left-0 bg-gray-900/95">
                  1 Year
                </td>
                {compareData.map((stock) => (
                  <td key={stock.symbol} className="py-3 px-4 text-center">
                    <span
                      className={`text-sm font-semibold ${
                        stock.oneYear >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {stock.oneYear >= 0 ? '+' : ''}
                      {stock.oneYear}%
                    </span>
                  </td>
                ))}
              </tr>

              {/* 3 Year */}
              <tr className="border-b border-white/5 hover:bg-white/5">
                <td className="py-3 px-4 text-sm text-gray-300 sticky left-0 bg-gray-900/95">
                  3 Year
                </td>
                {compareData.map((stock) => (
                  <td key={stock.symbol} className="py-3 px-4 text-center">
                    <span
                      className={`text-sm font-semibold ${
                        stock.threeYear >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {stock.threeYear >= 0 ? '+' : ''}
                      {stock.threeYear}%
                    </span>
                  </td>
                ))}
              </tr>

              {/* Valuation Section */}
              <tr className="bg-blue-500/5">
                <td
                  className="py-2 px-4 font-semibold text-blue-300 text-sm"
                  colSpan={compareData.length + 1}
                >
                  💰 VALUATION
                </td>
              </tr>

              {/* P/E */}
              <tr className="border-b border-white/5 hover:bg-white/5">
                <td className="py-3 px-4 text-sm text-gray-300 sticky left-0 bg-gray-900/95">
                  P/E Ratio
                </td>
                {compareData.map((stock) => (
                  <td key={stock.symbol} className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm text-white">{stock.pe}x</span>
                      {stock.pe > 50 && (
                        <AlertTriangle className="w-3 h-3 text-yellow-400" />
                      )}
                      {stock.pe <= 20 && <Award className="w-3 h-3 text-green-400" />}
                    </div>
                  </td>
                ))}
              </tr>

              {/* PEG */}
              <tr className="border-b border-white/5 hover:bg-white/5">
                <td className="py-3 px-4 text-sm text-gray-300 sticky left-0 bg-gray-900/95">
                  PEG Ratio
                </td>
                {compareData.map((stock) => (
                  <td key={stock.symbol} className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm text-white">
                        {stock.peg > 0 ? stock.peg.toFixed(1) : 'N/A'}
                      </span>
                      {stock.peg > 0 && stock.peg < 1.5 && (
                        <Award className="w-3 h-3 text-green-400" />
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              {/* P/S */}
              <tr className="border-b border-white/5 hover:bg-white/5">
                <td className="py-3 px-4 text-sm text-gray-300 sticky left-0 bg-gray-900/95">
                  P/S Ratio
                </td>
                {compareData.map((stock) => (
                  <td key={stock.symbol} className="py-3 px-4 text-center">
                    <span className="text-sm text-white">{stock.ps}x</span>
                  </td>
                ))}
              </tr>

              {/* Technical Section */}
              <tr className="bg-green-500/5">
                <td
                  className="py-2 px-4 font-semibold text-green-300 text-sm"
                  colSpan={compareData.length + 1}
                >
                  📊 TECHNICAL
                </td>
              </tr>

              {/* Trend */}
              <tr className="border-b border-white/5 hover:bg-white/5">
                <td className="py-3 px-4 text-sm text-gray-300 sticky left-0 bg-gray-900/95">
                  Trend
                </td>
                {compareData.map((stock) => (
                  <td key={stock.symbol} className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {getTrendIcon(stock.trend)}
                      <span className="text-sm text-white capitalize">{stock.trend}</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* RSI */}
              <tr className="border-b border-white/5 hover:bg-white/5">
                <td className="py-3 px-4 text-sm text-gray-300 sticky left-0 bg-gray-900/95">
                  RSI
                </td>
                {compareData.map((stock) => (
                  <td key={stock.symbol} className="py-3 px-4">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-sm text-white">{stock.rsi}</span>
                      <Progress className="h-1 w-20" value={stock.rsi} />
                      {stock.rsi > 70 && (
                        <span className="text-xs text-yellow-400">Overbought</span>
                      )}
                      {stock.rsi < 30 && (
                        <span className="text-xs text-green-400">Oversold</span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              {/* vs 50 DMA */}
              <tr className="border-b border-white/5 hover:bg-white/5">
                <td className="py-3 px-4 text-sm text-gray-300 sticky left-0 bg-gray-900/95">
                  vs 50 DMA
                </td>
                {compareData.map((stock) => (
                  <td key={stock.symbol} className="py-3 px-4 text-center">
                    <span
                      className={`text-sm font-semibold ${
                        stock.vs50dma >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {stock.vs50dma >= 0 ? '+' : ''}
                      {stock.vs50dma}%
                    </span>
                  </td>
                ))}
              </tr>

              {/* AI Moat Section */}
              <tr className="bg-purple-500/5">
                <td
                  className="py-2 px-4 font-semibold text-purple-300 text-sm"
                  colSpan={compareData.length + 1}
                >
                  🤖 AI COMPETITIVE MOAT
                </td>
              </tr>

              {/* AI Revenue */}
              <tr className="border-b border-white/5 hover:bg-white/5">
                <td className="py-3 px-4 text-sm text-gray-300 sticky left-0 bg-gray-900/95">
                  AI Revenue
                </td>
                {compareData.map((stock) => (
                  <td key={stock.symbol} className="py-3 px-4 text-center">
                    <span className="text-sm font-semibold text-white">{stock.aiRevenue}</span>
                  </td>
                ))}
              </tr>

              {/* Market Share */}
              <tr className="border-b border-white/5 hover:bg-white/5">
                <td className="py-3 px-4 text-sm text-gray-300 sticky left-0 bg-gray-900/95">
                  Data Center Market Share
                </td>
                {compareData.map((stock) => (
                  <td key={stock.symbol} className="py-3 px-4">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-sm font-semibold text-white">
                        {stock.marketShare}%
                      </span>
                      <Progress className="h-2 w-24" value={stock.marketShare} />
                    </div>
                  </td>
                ))}
              </tr>

              {/* Moat Strength */}
              <tr className="border-b border-white/5 hover:bg-white/5">
                <td className="py-3 px-4 text-sm text-gray-300 sticky left-0 bg-gray-900/95">
                  Competitive Moat
                </td>
                {compareData.map((stock) => (
                  <td key={stock.symbol} className="py-3 px-4">
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex gap-1">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-6 rounded ${
                              i < stock.moat / 12.5
                                ? 'bg-gradient-to-t from-purple-500 to-blue-500'
                                : 'bg-gray-700'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">
                        {stock.moat >= 70
                          ? 'Very Strong'
                          : stock.moat >= 50
                          ? 'Strong'
                          : stock.moat >= 30
                          ? 'Moderate'
                          : 'Weak'}
                      </span>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mt-8 p-6 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
          <h3 className="text-lg font-bold text-white mb-4">💡 SUMMARY</h3>
          <div className="space-y-3">
            {compareData.map((stock, index) => (
              <div
                key={stock.symbol}
                className="p-4 rounded-lg bg-gray-900/50 border border-white/10"
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-white mb-1">{stock.symbol}</div>
                    <p className="text-sm text-gray-300">
                      {stock.summary}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <Button className="flex-1 bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30">
            🎓 Learn: How to compare stocks
          </Button>
          <Button className="flex-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30">
            📊 Overlay charts
          </Button>
        </div>
      </Card>
    </div>
  );
}
