import { memo } from 'react';

import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

import { Card } from './ui/card';
import { Progress } from './ui/progress';

interface DailyScoreCardProps {
  score: number;
  change: number;
  mood: 'bullish' | 'neutral' | 'bearish';
  summary: string;
}

export const DailyScoreCard = memo(function DailyScoreCard({ score, change, mood, summary }: DailyScoreCardProps) {
  const getMoodColor = () => {
    if (mood === 'bullish') {return 'text-green-400';}
    if (mood === 'bearish') {return 'text-red-400';}
    return 'text-yellow-400';
  };

  const getMoodIcon = () => {
    if (mood === 'bullish') {return <TrendingUp className="w-8 h-8 text-green-400" />;}
    if (mood === 'bearish') {return <TrendingDown className="w-8 h-8 text-red-400" />;}
    return <Activity className="w-8 h-8 text-yellow-400" />;
  };

  const getMoodBg = () => {
    if (mood === 'bullish') {return 'from-green-500/20 to-green-600/5';}
    if (mood === 'bearish') {return 'from-red-500/20 to-red-600/5';}
    return 'from-yellow-500/20 to-yellow-600/5';
  };

  const changeDirection = change >= 0 ? 'up' : 'down';

  return (
    <section
      aria-label={`Daily Market Pulse score: ${Math.round(score)} out of 100, market mood is ${mood}`}
      className={`p-6 rounded-lg bg-gradient-to-br ${getMoodBg()} border border-white/10 backdrop-blur-sm`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-sm text-gray-400 mb-1">Daily Market Pulse</h2>
          <div className="flex items-baseline gap-2" role="status" aria-live="polite">
            <span className="text-5xl font-bold text-white" aria-label={`Score: ${Math.round(score)}`}>
              {Math.round(score)}
            </span>
            <span className="text-xl text-gray-400" aria-hidden="true">/100</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span
              aria-label={`Change ${changeDirection} ${Math.abs(change).toFixed(1)} percent compared to yesterday`}
              className={`text-sm font-medium ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}
            >
              {change >= 0 ? '+' : ''}{change.toFixed(1)}%
            </span>
            <span className="text-xs text-gray-500" aria-hidden="true">vs yesterday</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2" aria-hidden="true">
          {getMoodIcon()}
          <span className={`text-xs font-medium uppercase tracking-wider ${getMoodColor()}`}>
            {mood}
          </span>
        </div>
      </div>

      <Progress
        aria-label={`Market pulse progress: ${Math.round(score)} percent`}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={Math.round(score)}
        className="h-2 mb-4 bg-white/10"
        value={Math.round(score)}
      />

      <p className="text-sm text-gray-300 leading-relaxed">
        {summary}
      </p>
    </section>
  );
});
