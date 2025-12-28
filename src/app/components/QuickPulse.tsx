import { memo, useMemo, useState } from 'react';

import { TrendingUp, TrendingDown, Activity, AlertCircle, AlertTriangle, RefreshCw } from 'lucide-react';

import { useFearGreed } from '@/hooks/useFearGreed';
import { useStockQuote } from '@/hooks/useStockQuote';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from './ui/dialog';



export const QuickPulse = memo(function QuickPulse() {
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);

  // Fetch real market data
  const { data: spyData, loading: spyLoading, error: spyError, refetch: refetchSpy } = useStockQuote({
    symbol: 'SPY', // S&P 500 ETF for market trend
    pollingInterval: 15000 // Update every 15 seconds
  });

  const { data: vixData, loading: vixLoading, error: vixError, refetch: refetchVix } = useStockQuote({
    symbol: '^VIX', // VIX volatility index
    pollingInterval: 30000 // Update every 30 seconds
  });

  const { data: fearGreedData, loading: fearGreedLoading, error: fearGreedError, refetch: refetchFearGreed } = useFearGreed({
    pollingInterval: 3600000 // Update every hour
  });

  const metrics = useMemo(() => {
    // Market Trend from SPY
    const trendValue = spyData?.changePercent ?? 0;
    const isBullish = trendValue > 0;

    // Volatility from VIX
    const vixValue = vixData?.price ?? 15;
    const volatilityLevel = vixValue < 15 ? 'Low' : vixValue < 20 ? 'Medium' : vixValue < 30 ? 'High' : 'Extreme';

    // Sentiment from Fear & Greed Index
    const sentimentScore = fearGreedData?.score ?? 50;
    const sentimentLabel = sentimentScore < 25 ? 'Extreme Fear' :
                           sentimentScore < 45 ? 'Fear' :
                           sentimentScore < 55 ? 'Neutral' :
                           sentimentScore < 75 ? 'Greed' : 'Extreme Greed';

    // Volume from SPY (Note: Finnhub free tier doesn't include volume)
    const volume = spyData?.volume ?? 0;
    const avgVolume = 70000000; // Approximate average SPY volume
    const volumeAvailable = volume > 0;
    const volumeRatio = volumeAvailable ? ((volume / avgVolume - 1) * 100) : 0;
    const volumeLabel = !volumeAvailable ? 'N/A' :
                        volumeRatio > 10 ? 'Above Avg' :
                        volumeRatio < -10 ? 'Below Avg' : 'Average';

    return [
      {
        name: 'Market Trend',
        value: isBullish ? 'Bullish' : 'Bearish',
        change: `${trendValue >= 0 ? '+' : ''}${trendValue.toFixed(2)}%`,
        positive: isBullish,
        icon: isBullish ? TrendingUp : TrendingDown,
        color: isBullish ? 'text-green-500' : 'text-red-500'
      },
      {
        name: 'Volatility',
        value: volatilityLevel,
        change: `VIX: ${vixValue.toFixed(1)}`,
        positive: vixValue < 20,
        icon: Activity,
        color: 'text-blue-500'
      },
      {
        name: 'Sentiment',
        value: sentimentLabel,
        change: `${sentimentScore}/100`,
        positive: sentimentScore >= 45 && sentimentScore <= 55, // Neutral is good
        icon: AlertCircle,
        color: sentimentScore < 45 ? 'text-red-500' : sentimentScore > 55 ? 'text-yellow-500' : 'text-green-500'
      },
      {
        name: 'Volume',
        value: volumeLabel,
        change: volumeAvailable ? `${volumeRatio >= 0 ? '+' : ''}${volumeRatio.toFixed(0)}%` : 'Unavailable',
        positive: volumeAvailable && volumeRatio > 0,
        icon: volumeAvailable ? (volumeRatio > 0 ? TrendingUp : TrendingDown) : Activity,
        color: volumeAvailable ? 'text-purple-500' : 'text-gray-500'
      }
    ];
  }, [spyData, vixData, fearGreedData]);

  const isLoading = spyLoading || vixLoading || fearGreedLoading;

  // Collect all errors
  const errors = useMemo(() => {
    const errorList = [];
    if (spyError) {errorList.push({ source: 'SPY Market Data', error: spyError, retry: refetchSpy });}
    if (vixError) {errorList.push({ source: 'VIX Volatility Data', error: vixError, retry: refetchVix });}
    if (fearGreedError) {errorList.push({ source: 'Fear & Greed Index', error: fearGreedError, retry: refetchFearGreed });}
    return errorList;
  }, [spyError, vixError, fearGreedError, refetchSpy, refetchVix, refetchFearGreed]);

  const hasErrors = errors.length > 0;

  // Retry all failed requests
  const retryAll = async () => {
    for (const { retry } of errors) {
      await retry();
    }
  };

  return (
    <Card className="glass-card border-purple-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-400" />
          Quick Pulse
          <div className="ml-auto flex items-center gap-2">
            {hasErrors && (
              <Dialog open={isErrorDialogOpen} onOpenChange={setIsErrorDialogOpen}>
                <DialogTrigger asChild>
                  <Badge
                    className="bg-red-500/20 text-red-400 border-red-500/30 cursor-pointer hover:bg-red-500/30 transition-colors"
                    variant="destructive"
                  >
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Erori ({errors.length})
                  </Badge>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                      Date Loading Errors
                    </DialogTitle>
                    <DialogDescription>
                      The following data sources encountered errors. You can retry loading them individually or all at once.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    {errors.map(({ source, error, retry }, index) => (
                      <div key={index} className="p-4 rounded-lg bg-gray-900/50 border border-red-500/20">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-white mb-1">{source}</h4>
                            <p className="text-xs text-red-400">{error.message}</p>
                          </div>
                          <Button
                            className="ml-2 border-purple-500/30 hover:bg-purple-500/10"
                            size="sm"
                            variant="outline"
                            onClick={retry}
                          >
                            <RefreshCw className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <DialogFooter>
                    <Button
                      className="border-gray-500/30"
                      variant="outline"
                      onClick={() => setIsErrorDialogOpen(false)}
                    >
                      Close
                    </Button>
                    <Button
                      className="bg-purple-500 hover:bg-purple-600 text-white"
                      onClick={async () => {
                        await retryAll();
                        setIsErrorDialogOpen(false);
                      }}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Retry All
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            {!isLoading && !hasErrors && (
              <Badge className="text-xs" variant="outline">
                Live
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <div
              key={metric.name}
              className="p-4 rounded-lg bg-gray-800/50 border border-white/5 hover:border-purple-500/30 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
                <Badge
                  className={metric.positive ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}
                  variant={metric.positive ? 'default' : 'secondary'}
                >
                  {metric.change}
                </Badge>
              </div>
              <div className="text-sm text-gray-400">{metric.name}</div>
              <div className="text-lg font-bold text-white">{metric.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});
