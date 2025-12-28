import { Sparkles, Cloud, Zap, Sun, CloudRain } from 'lucide-react';

import { Badge } from './ui/badge';
import { Card } from './ui/card';

type Theme = 'serenity' | 'storm' | 'tension' | 'momentum' | 'waiting';

interface DailyTheme {
  name: string;
  icon: JSX.Element;
  gradient: string;
  border: string;
  description: string;
  greeting: string;
}

const themes: Record<Theme, DailyTheme> = {
  serenity: {
    name: 'Serenity',
    icon: <Sun className="w-6 h-6 text-green-400" />,
    gradient: 'from-green-500/10 to-blue-500/10',
    border: 'border-green-500/20',
    description: 'VIX low + Trending up = Calm market',
    greeting: 'Market is calm and confident today. Good day for positioning.',
  },
  storm: {
    name: 'Storm',
    icon: <CloudRain className="w-6 h-6 text-red-400" />,
    gradient: 'from-red-500/10 to-orange-500/10',
    border: 'border-red-500/20',
    description: 'VIX spike + Drop = Stormy conditions',
    greeting: 'Volatility is high. Stay cautious and manage risk.',
  },
  tension: {
    name: 'Tension',
    icon: <Zap className="w-6 h-6 text-yellow-400" />,
    gradient: 'from-yellow-500/10 to-orange-500/10',
    border: 'border-yellow-500/20',
    description: 'FOMC day = Market on edge',
    greeting: 'Big event today. The market is waiting for news.',
  },
  momentum: {
    name: 'Momentum',
    icon: <Sparkles className="w-6 h-6 text-purple-400" />,
    gradient: 'from-purple-500/10 to-blue-500/10',
    border: 'border-purple-500/20',
    description: 'Breakout + Volume = Energy',
    greeting: 'Strong momentum detected. Opportunities everywhere.',
  },
  waiting: {
    name: 'Waiting',
    icon: <Cloud className="w-6 h-6 text-gray-400" />,
    gradient: 'from-gray-500/10 to-gray-600/10',
    border: 'border-gray-500/20',
    description: 'Range-bound + Low volume = Quiet',
    greeting: 'Market is range-bound. Patience required.',
  },
};

export function DailyMorphing({ theme = 'serenity' }: { theme?: Theme }) {
  const currentTheme = themes[theme];

  return (
    <Card className="p-8 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-white/10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">🎨 Daily Morphing System</h2>
        <p className="text-sm text-gray-400">
          UI adapts to market conditions - different look every day
        </p>
      </div>

      <Card
        className={`p-6 bg-gradient-to-br ${currentTheme.gradient} border-2 ${currentTheme.border} mb-6`}
      >
        <div className="flex items-center gap-3 mb-4">
          {currentTheme.icon}
          <div>
            <h3 className="text-xl font-bold text-white">{currentTheme.name} Theme</h3>
            <p className="text-sm text-gray-400">{currentTheme.description}</p>
          </div>
        </div>

        <p className="text-lg text-white mb-4">{currentTheme.greeting}</p>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
            <div className="text-xs text-gray-400 mb-1">Primary Color</div>
            <div
              className={`w-full h-8 rounded ${
                theme === 'serenity'
                  ? 'bg-green-500'
                  : theme === 'storm'
                  ? 'bg-red-500'
                  : theme === 'tension'
                  ? 'bg-yellow-500'
                  : theme === 'momentum'
                  ? 'bg-purple-500'
                  : 'bg-gray-500'
              }`}
            />
          </div>
          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
            <div className="text-xs text-gray-400 mb-1">Accent</div>
            <div
              className={`w-full h-8 rounded ${
                theme === 'serenity'
                  ? 'bg-blue-500'
                  : theme === 'storm'
                  ? 'bg-orange-500'
                  : theme === 'tension'
                  ? 'bg-orange-500'
                  : theme === 'momentum'
                  ? 'bg-blue-500'
                  : 'bg-gray-600'
              }`}
            />
          </div>
          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
            <div className="text-xs text-gray-400 mb-1">Mood</div>
            <div className="text-2xl">
              {theme === 'serenity'
                ? '😌'
                : theme === 'storm'
                ? '😱'
                : theme === 'tension'
                ? '😬'
                : theme === 'momentum'
                ? '🚀'
                : '😴'}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-5 gap-2 mb-6">
        {(Object.keys(themes) as Theme[]).map((t) => (
          <Card
            key={t}
            className={`p-3 text-center cursor-pointer transition-all ${
              t === theme
                ? `bg-gradient-to-br ${themes[t].gradient} border-2 ${themes[t].border}`
                : 'bg-gray-900/30 border border-white/5 hover:bg-gray-900/50'
            }`}
          >
            {themes[t].icon}
            <div className="text-xs text-white mt-2">{themes[t].name}</div>
          </Card>
        ))}
      </div>

      <Card className="p-4 bg-blue-500/10 border-blue-500/20">
        <div className="text-sm text-gray-300">
          <strong className="text-blue-300">How it works:</strong> Every morning, system analyzes
          market conditions (VIX, trend, volume, events) and selects appropriate theme. Colors,
          gradients, and even greetings change automatically.
        </div>
      </Card>
    </Card>
  );
}
