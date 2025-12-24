import { memo, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, Activity, AlertCircle } from 'lucide-react';
import { useStockQuote } from '@/hooks/useStockQuote';
import { useFearGreed } from '@/hooks/useFearGreed';

export const QuickPulse = memo(function QuickPulse() {
  // Fetch real market data
  const { data: spyData, loading: spyLoading } = useStockQuote({
    symbol: 'SPY', // S&P 500 ETF for market trend
    pollingInterval: 15000 // Update every 15 seconds
  });

  const { data: vixData, loading: vixLoading } = useStockQuote({
    symbol: '^VIX', // VIX volatility index
    pollingInterval: 30000 // Update every 30 seconds
  });

  const { data: fearGreedData, loading: fearGreedLoading } = useFearGreed({
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

    // Volume from SPY
    const volume = spyData?.volume ?? 0;
    const avgVolume = 70000000; // Approximate average SPY volume
    const volumeRatio = volume > 0 ? ((volume / avgVolume - 1) * 100) : 0;
    const volumeLabel = volumeRatio > 10 ? 'Above Avg' : volumeRatio < -10 ? 'Below Avg' : 'Average';

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
        change: `${volumeRatio >= 0 ? '+' : ''}${volumeRatio.toFixed(0)}%`,
        positive: volumeRatio > 0,
        icon: volumeRatio > 0 ? TrendingUp : TrendingDown,
        color: 'text-purple-500'
      }
    ];
  }, [spyData, vixData, fearGreedData]);

  const isLoading = spyLoading || vixLoading || fearGreedLoading;

  return (
    <Card className="glass-card border-purple-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-400" />
          Quick Pulse
          {!isLoading && (
            <Badge variant="outline" className="ml-auto text-xs">
              Live
            </Badge>
          )}
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
                  variant={metric.positive ? 'default' : 'secondary'}
                  className={metric.positive ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}
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
