import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Smile, Meh, Frown, AlertCircle } from 'lucide-react';

export function MarketMoodRing() {
  const mood = {
    emoji: '😌',
    name: 'Calm',
    description: 'Market is breathing easily',
    metrics: {
      vix: 14.2,
      volume: 'Normal',
      trend: 'Slight uptrend',
      sentiment: 'Neutral-Bullish'
    },
    recommendation: 'Good for new positions'
  };

  return (
    <Card className="glass-card border-green-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">{mood.emoji}</span>
          Market Mood Ring
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-6 rounded-lg bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/20">
          <div className="text-6xl mb-2">{mood.emoji}</div>
          <div className="text-2xl font-bold text-white mb-1">{mood.name}</div>
          <div className="text-sm text-gray-400">{mood.description}</div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-gray-800/50 border border-white/5">
            <div className="text-xs text-gray-400">VIX</div>
            <div className="text-lg font-bold text-green-400">{mood.metrics.vix}</div>
          </div>
          <div className="p-3 rounded-lg bg-gray-800/50 border border-white/5">
            <div className="text-xs text-gray-400">Volume</div>
            <div className="text-lg font-bold text-white">{mood.metrics.volume}</div>
          </div>
          <div className="p-3 rounded-lg bg-gray-800/50 border border-white/5">
            <div className="text-xs text-gray-400">Trend</div>
            <div className="text-lg font-bold text-blue-400">{mood.metrics.trend}</div>
          </div>
          <div className="p-3 rounded-lg bg-gray-800/50 border border-white/5">
            <div className="text-xs text-gray-400">Sentiment</div>
            <div className="text-lg font-bold text-purple-400">{mood.metrics.sentiment}</div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Smile className="w-5 h-5 text-blue-400" />
            <span className="font-semibold text-white">Recommendation</span>
          </div>
          <p className="text-sm text-gray-300">{mood.recommendation}</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline" className="bg-green-500/10 text-green-400">😌 Calm</Badge>
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400">🤔 Uncertain</Badge>
          <Badge variant="outline" className="bg-red-500/10 text-red-400">😰 Anxious</Badge>
          <Badge variant="outline" className="bg-purple-500/10 text-purple-400">🤩 Euphoric</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
