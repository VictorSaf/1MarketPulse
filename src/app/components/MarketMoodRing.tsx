import { useMemo } from 'react';

import { Smile, Loader2 } from 'lucide-react';

import { useFearGreed } from '@/hooks';

import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';



interface MoodState {
  emoji: string;
  name: string;
  description: string;
  recommendation: string;
  colorClass: string;
  borderClass: string;
}

/**
 * Maps Fear & Greed Index score to mood states
 * 0-25: Extreme Fear (Anxious)
 * 25-45: Fear (Uncertain)
 * 45-55: Neutral (Calm)
 * 55-75: Greed (Confident)
 * 75-100: Extreme Greed (Euphoric)
 */
function getMoodFromScore(score: number): MoodState {
  if (score <= 25) {
    return {
      emoji: '😰',
      name: 'Anxious',
      description: 'Extreme fear in the market',
      recommendation: 'Consider contrarian buying opportunities',
      colorClass: 'from-red-500/10 to-orange-500/10',
      borderClass: 'border-red-500/20'
    };
  }
  if (score <= 45) {
    return {
      emoji: '🤔',
      name: 'Uncertain',
      description: 'Fear present, markets cautious',
      recommendation: 'Wait for clearer signals',
      colorClass: 'from-yellow-500/10 to-orange-500/10',
      borderClass: 'border-yellow-500/20'
    };
  }
  if (score <= 55) {
    return {
      emoji: '😌',
      name: 'Calm',
      description: 'Market is breathing easily',
      recommendation: 'Good for new positions',
      colorClass: 'from-green-500/10 to-blue-500/10',
      borderClass: 'border-green-500/20'
    };
  }
  if (score <= 75) {
    return {
      emoji: '😊',
      name: 'Confident',
      description: 'Greed building in markets',
      recommendation: 'Consider taking some profits',
      colorClass: 'from-blue-500/10 to-purple-500/10',
      borderClass: 'border-blue-500/20'
    };
  }
  return {
    emoji: '🤩',
    name: 'Euphoric',
    description: 'Extreme greed detected',
    recommendation: 'High risk - secure profits',
    colorClass: 'from-purple-500/10 to-pink-500/10',
    borderClass: 'border-purple-500/20'
  };
}

function getSentimentLabel(score: number): string {
  if (score <= 25) {return 'Extreme Fear';}
  if (score <= 45) {return 'Fear';}
  if (score <= 55) {return 'Neutral';}
  if (score <= 75) {return 'Greed';}
  return 'Extreme Greed';
}

export function MarketMoodRing() {
  const { data, loading, error } = useFearGreed();

  const mood = useMemo(() => {
    const score = data?.score ?? 50;
    return getMoodFromScore(score);
  }, [data?.score]);

  const metrics = useMemo(() => ({
    fearGreed: data?.score ?? 0,
    classification: data?.rating ?? 'Loading...',
    trend: 'Measuring...',  // Would need historical data to calculate
    sentiment: getSentimentLabel(data?.score ?? 50)
  }), [data]);

  return (
    <Card className={`glass-card ${mood.borderClass}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          ) : (
            <span className="text-2xl">{mood.emoji}</span>
          )}
          Market Mood Ring
          {loading && <span className="text-xs text-gray-500 ml-2">Loading...</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`text-center p-6 rounded-lg bg-gradient-to-br ${mood.colorClass} border ${mood.borderClass}`}>
          {loading ? (
            <Loader2 className="w-16 h-16 animate-spin text-gray-400 mx-auto mb-2" />
          ) : (
            <div className="text-6xl mb-2">{mood.emoji}</div>
          )}
          <div className="text-2xl font-bold text-white mb-1">{mood.name}</div>
          <div className="text-sm text-gray-400">{mood.description}</div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
            Unable to fetch market mood data
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-gray-800/50 border border-white/5">
            <div className="text-xs text-gray-400">Fear & Greed</div>
            <div className="text-lg font-bold text-green-400">
              {loading ? '...' : metrics.fearGreed}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-gray-800/50 border border-white/5">
            <div className="text-xs text-gray-400">Classification</div>
            <div className="text-lg font-bold text-white truncate">
              {loading ? '...' : metrics.classification}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-gray-800/50 border border-white/5">
            <div className="text-xs text-gray-400">Trend</div>
            <div className="text-lg font-bold text-blue-400">
              {loading ? '...' : metrics.trend}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-gray-800/50 border border-white/5">
            <div className="text-xs text-gray-400">Sentiment</div>
            <div className="text-lg font-bold text-purple-400">
              {loading ? '...' : metrics.sentiment}
            </div>
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
          <Badge
            className={`${mood.name === 'Calm' ? 'ring-2 ring-green-400' : ''} bg-green-500/10 text-green-400`}
            variant="outline"
          >
            😌 Calm
          </Badge>
          <Badge
            className={`${mood.name === 'Uncertain' ? 'ring-2 ring-yellow-400' : ''} bg-yellow-500/10 text-yellow-400`}
            variant="outline"
          >
            🤔 Uncertain
          </Badge>
          <Badge
            className={`${mood.name === 'Anxious' ? 'ring-2 ring-red-400' : ''} bg-red-500/10 text-red-400`}
            variant="outline"
          >
            😰 Anxious
          </Badge>
          <Badge
            className={`${mood.name === 'Euphoric' || mood.name === 'Confident' ? 'ring-2 ring-purple-400' : ''} bg-purple-500/10 text-purple-400`}
            variant="outline"
          >
            🤩 Euphoric
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
