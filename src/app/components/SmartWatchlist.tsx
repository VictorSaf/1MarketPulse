import { Bell, TrendingUp, Activity, AlertCircle, Eye } from 'lucide-react';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';


interface WatchlistItem {
  symbol: string;
  name: string;
  price: string;
  change: number;
  alert?: string;
  status: 'quiet' | 'alert' | 'pattern' | 'momentum';
  correlation?: number;
}

const watchlist: WatchlistItem[] = [
  {
    symbol: 'NVDA',
    name: 'NVIDIA',
    price: '$481.50',
    change: 2.3,
    alert: 'Near your $485 target',
    status: 'alert',
  },
  {
    symbol: 'AAPL',
    name: 'Apple',
    price: '$194.80',
    change: -0.3,
    alert: 'Pattern forming',
    status: 'pattern',
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: '$44,123',
    change: 3.2,
    alert: 'Momentum strong',
    status: 'momentum',
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft',
    price: '$378.20',
    change: 0.8,
    status: 'quiet',
  },
  {
    symbol: 'TSLA',
    name: 'Tesla',
    price: '$248.50',
    change: -1.2,
    alert: 'Support test',
    status: 'alert',
  },
  {
    symbol: 'AMD',
    name: 'AMD',
    price: '$142.30',
    change: 1.8,
    alert: 'Following NVDA',
    status: 'pattern',
    correlation: 0.85,
  },
];

export function SmartWatchlist() {
  return (
    <Card className="p-8 bg-gradient-to-br from-green-500/10 to-blue-500/10 border-white/10">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              ⭐ SMART WATCHLIST
            </h2>
            <p className="text-sm text-gray-400">
              6 items | 2 alerts
            </p>
          </div>
          <Button className="bg-green-500/20 border border-green-500/30 text-green-300">
            + Add Asset
          </Button>
        </div>
      </div>

      {/* Watchlist Items */}
      <div className="space-y-3 mb-8">
        {watchlist.map((item) => (
          <Card
            key={item.symbol}
            className={`p-4 border transition-all hover:scale-[1.01] ${
              item.status === 'alert'
                ? 'bg-orange-500/5 border-orange-500/20'
                : item.status === 'pattern'
                ? 'bg-blue-500/5 border-blue-500/20'
                : item.status === 'momentum'
                ? 'bg-green-500/5 border-green-500/20'
                : 'bg-gray-900/30 border-white/5'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  item.status === 'alert'
                    ? 'bg-orange-500/20 border border-orange-400/30'
                    : item.status === 'pattern'
                    ? 'bg-blue-500/20 border border-blue-400/30'
                    : item.status === 'momentum'
                    ? 'bg-green-500/20 border border-green-400/30'
                    : 'bg-gray-500/20 border border-gray-400/30'
                }`}>
                  {item.status === 'alert' && <Bell className="w-5 h-5 text-orange-400" />}
                  {item.status === 'pattern' && <Activity className="w-5 h-5 text-blue-400" />}
                  {item.status === 'momentum' && <TrendingUp className="w-5 h-5 text-green-400" />}
                  {item.status === 'quiet' && <Eye className="w-5 h-5 text-gray-400" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-semibold">{item.symbol}</span>
                    <span className="text-sm text-gray-400">{item.name}</span>
                    {item.correlation && (
                      <Badge className="text-xs" variant="secondary">
                        Corr: {item.correlation}
                      </Badge>
                    )}
                  </div>
                  {item.alert && (
                    <div className={`text-xs flex items-center gap-1 ${
                      item.status === 'alert'
                        ? 'text-orange-400'
                        : item.status === 'pattern'
                        ? 'text-blue-400'
                        : 'text-green-400'
                    }`}>
                      {item.status === 'alert' && '🔔'}
                      {item.status === 'pattern' && '📊'}
                      {item.status === 'momentum' && '🚀'}
                      {item.alert}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right">
                <div className="text-white font-semibold">{item.price}</div>
                <div className={`text-sm ${item.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {item.change >= 0 ? '+' : ''}{item.change}%
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Insights */}
      <Card className="p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20 mb-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h3 className="text-white font-semibold mb-3">WATCHLIST INSIGHTS:</h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm font-semibold text-purple-300 mb-1">CONCENTRATION RISK:</div>
                <div className="text-sm text-gray-300">
                  • 67% tech stocks - heavy sector exposure
                  <br />
                  • Correlation between picks: 0.78 (high)
                  <br />
                  • If tech drops 5%, your watchlist drops ~6.2%
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-blue-300 mb-1">BEHAVIOR PATTERNS:</div>
                <div className="text-sm text-gray-300">
                  • NVDA and AMD move together 85% of the time
                  <br />
                  • TSLA is contrarian vs the rest
                  <br />
                  • BTC becoming more correlated with tech recently
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-green-300 mb-1">SUGGESTED DIVERSIFICATION:</div>
                <div className="text-sm text-gray-300">
                  • Add non-tech: XLE (energy)? GLD (gold)?
                  <br />
                  • Would reduce portfolio volatility by ~15%
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Suggestions */}
      <Card className="p-6 bg-gray-900/50 border-white/10">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          🎯 BASED ON YOUR INTERESTS:
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          You track NVDA closely. Consider these related assets:
        </p>
        <div className="space-y-2">
          {[
            { symbol: 'AVGO', name: 'Broadcom', reason: 'Similar sector, lower correlation' },
            { symbol: 'SMH', name: 'Semiconductor ETF', reason: 'Diversified chip exposure' },
            { symbol: 'MU', name: 'Micron', reason: 'Memory chips, different cycle' },
          ].map((suggestion) => (
            <div
              key={suggestion.symbol}
              className="p-3 rounded-lg bg-gray-900/30 border border-white/5 hover:bg-gray-900/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold mb-1">{suggestion.symbol} - {suggestion.name}</div>
                  <div className="text-xs text-gray-400">{suggestion.reason}</div>
                </div>
                <Button className="border-green-500/30 text-green-400" size="sm" variant="outline">
                  + Add
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </Card>
  );
}
