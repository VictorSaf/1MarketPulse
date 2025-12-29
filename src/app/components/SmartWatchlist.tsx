import { useMemo } from 'react';
import { toast } from 'sonner';

import { Bell, TrendingUp, Activity, Eye, Loader2 } from 'lucide-react';

import { useStockQuote, useCryptoPrice } from '@/hooks';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';


interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  alert?: string;
  status: 'quiet' | 'alert' | 'pattern' | 'momentum';
  correlation?: number;
  loading?: boolean;
  isCrypto?: boolean;
}

export function SmartWatchlist() {
  // Fetch real-time data for watchlist items
  const nvdaQuote = useStockQuote({ symbol: 'NVDA' });
  const aaplQuote = useStockQuote({ symbol: 'AAPL' });
  const msftQuote = useStockQuote({ symbol: 'MSFT' });
  const tslaQuote = useStockQuote({ symbol: 'TSLA' });
  const amdQuote = useStockQuote({ symbol: 'AMD' });
  const btcPrice = useCryptoPrice({ symbol: 'BTC' });

  // Build watchlist with real data
  const watchlist: WatchlistItem[] = useMemo(() => {
    const getStatus = (change: number): WatchlistItem['status'] => {
      if (Math.abs(change) > 3) return 'momentum';
      if (Math.abs(change) > 1.5) return 'alert';
      if (Math.abs(change) > 0.5) return 'pattern';
      return 'quiet';
    };

    return [
      {
        symbol: 'NVDA',
        name: 'NVIDIA',
        price: nvdaQuote.data?.price ?? 0,
        change: nvdaQuote.data?.changePercent ?? 0,
        status: getStatus(nvdaQuote.data?.changePercent ?? 0),
        loading: nvdaQuote.loading,
      },
      {
        symbol: 'AAPL',
        name: 'Apple',
        price: aaplQuote.data?.price ?? 0,
        change: aaplQuote.data?.changePercent ?? 0,
        status: getStatus(aaplQuote.data?.changePercent ?? 0),
        loading: aaplQuote.loading,
      },
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        price: btcPrice.data?.price ?? 0,
        change: btcPrice.data?.changePercent24h ?? 0,
        status: getStatus(btcPrice.data?.changePercent24h ?? 0),
        loading: btcPrice.loading,
        isCrypto: true,
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft',
        price: msftQuote.data?.price ?? 0,
        change: msftQuote.data?.changePercent ?? 0,
        status: getStatus(msftQuote.data?.changePercent ?? 0),
        loading: msftQuote.loading,
      },
      {
        symbol: 'TSLA',
        name: 'Tesla',
        price: tslaQuote.data?.price ?? 0,
        change: tslaQuote.data?.changePercent ?? 0,
        status: getStatus(tslaQuote.data?.changePercent ?? 0),
        loading: tslaQuote.loading,
      },
      {
        symbol: 'AMD',
        name: 'AMD',
        price: amdQuote.data?.price ?? 0,
        change: amdQuote.data?.changePercent ?? 0,
        status: getStatus(amdQuote.data?.changePercent ?? 0),
        loading: amdQuote.loading,
      },
    ];
  }, [nvdaQuote, aaplQuote, btcPrice, msftQuote, tslaQuote, amdQuote]);

  const isLoading = watchlist.some(item => item.loading);
  const alertCount = watchlist.filter(item => item.status === 'alert' || item.status === 'momentum').length;

  const handleComingSoonClick = () => {
    toast.info('Feature coming soon!', {
      description: 'This feature is under development.',
    });
  };

  const formatPrice = (price: number, isCrypto?: boolean) => {
    if (price === 0) return '--';
    if (isCrypto) return `$${price.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    return `$${price.toFixed(2)}`;
  };
  return (
    <Card className="p-8 bg-gradient-to-br from-green-500/10 to-blue-500/10 border-white/10">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              ⭐ SMART WATCHLIST
              {isLoading && <Loader2 className="w-5 h-5 animate-spin text-blue-400" />}
            </h2>
            <p className="text-sm text-gray-400">
              {watchlist.length} items | {alertCount} alerts
            </p>
          </div>
          <Button
            className="bg-green-500/20 border border-green-500/30 text-green-300 opacity-50 cursor-not-allowed"
            disabled
            title="Coming Soon"
            onClick={handleComingSoonClick}
          >
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
                {item.loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                ) : (
                  <>
                    <div className="text-white font-semibold">{formatPrice(item.price, item.isCrypto)}</div>
                    <div className={`text-sm ${item.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
                    </div>
                  </>
                )}
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
                <div className="text-sm font-semibold text-purple-300 mb-1">SECTOR ANALYSIS:</div>
                <div className="text-sm text-gray-300">
                  • Heavy tech concentration (NVDA, AAPL, MSFT, AMD)
                  <br />
                  • Consider diversifying across sectors
                  <br />
                  • BTC adds crypto exposure
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-blue-300 mb-1">TODAY'S MOVERS:</div>
                <div className="text-sm text-gray-300">
                  {watchlist
                    .filter(item => !item.loading && Math.abs(item.change) > 1)
                    .slice(0, 3)
                    .map(item => (
                      <span key={item.symbol}>
                        • {item.symbol}: {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
                        <br />
                      </span>
                    ))}
                  {watchlist.filter(item => !item.loading && Math.abs(item.change) > 1).length === 0 && (
                    <span>• Markets relatively quiet today</span>
                  )}
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-green-300 mb-1">SUGGESTED DIVERSIFICATION:</div>
                <div className="text-sm text-gray-300">
                  • Consider adding: XLE (energy), GLD (gold)
                  <br />
                  • International exposure: EFA, VWO
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
                <Button
                  className="border-green-500/30 text-green-400 opacity-50 cursor-not-allowed"
                  size="sm"
                  variant="outline"
                  disabled
                  title="Coming Soon"
                >
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
