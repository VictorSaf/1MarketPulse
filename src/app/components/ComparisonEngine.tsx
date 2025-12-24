import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { TrendingUp, TrendingDown, Award, AlertTriangle, X } from 'lucide-react';

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
}

const stockDatabase: StockData[] = [
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corp',
    price: 481.5,
    change: 2.3,
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
  },
  {
    symbol: 'AMD',
    name: 'Advanced Micro Devices',
    price: 142.3,
    change: 1.8,
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
  },
  {
    symbol: 'INTC',
    name: 'Intel Corporation',
    price: 44.8,
    change: -0.5,
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
  },
];

export function ComparisonEngine() {
  const [selectedStocks, setSelectedStocks] = useState<string[]>(['NVDA', 'AMD', 'INTC']);
  const [searchTerm, setSearchTerm] = useState('');

  const compareData = selectedStocks.map((symbol) =>
    stockDatabase.find((s) => s.symbol === symbol)
  ).filter(Boolean) as StockData[];

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
              placeholder="Add stock to compare (e.g., AAPL)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
              className="bg-gray-900/50 border-white/10 text-white"
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
                          variant="ghost"
                          size="sm"
                          onClick={() => removeStock(stock.symbol)}
                          className="text-gray-400 hover:text-white p-1"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="text-lg font-bold text-white mb-1">{stock.symbol}</div>
                      <div className="text-xs text-gray-400 mb-2">{stock.name}</div>
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
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* Performance Section */}
              <tr className="bg-purple-500/5">
                <td
                  colSpan={compareData.length + 1}
                  className="py-2 px-4 font-semibold text-purple-300 text-sm"
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
                  colSpan={compareData.length + 1}
                  className="py-2 px-4 font-semibold text-blue-300 text-sm"
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
                  colSpan={compareData.length + 1}
                  className="py-2 px-4 font-semibold text-green-300 text-sm"
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
                      <Progress value={stock.rsi} className="h-1 w-20" />
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
                  colSpan={compareData.length + 1}
                  className="py-2 px-4 font-semibold text-purple-300 text-sm"
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
                      <Progress value={stock.marketShare} className="h-2 w-24" />
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
            {compareData.map((stock) => (
              <div
                key={stock.symbol}
                className="p-4 rounded-lg bg-gray-900/50 border border-white/10"
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{stock.symbol === 'NVDA' ? '🥇' : stock.symbol === 'AMD' ? '🥈' : '🥉'}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-white mb-1">{stock.symbol}</div>
                    <p className="text-sm text-gray-300">
                      {stock.symbol === 'NVDA' &&
                        'Premium price for market leader. High risk, high reward. Dominant AI position.'}
                      {stock.symbol === 'AMD' &&
                        'Value alternative with good growth. Balanced choice. Growing AI presence.'}
                      {stock.symbol === 'INTC' &&
                        'Turnaround story. Cheap but uncertain. Contrarian bet with recovery potential.'}
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
