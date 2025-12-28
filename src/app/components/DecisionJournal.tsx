import { useState } from 'react';

import { TrendingUp, TrendingDown, Brain, Target, Zap } from 'lucide-react';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';


interface Decision {
  id: string;
  date: string;
  asset: string;
  prediction: 'up' | 'down' | 'neutral';
  confidence: 'low' | 'medium' | 'high';
  reasons: string[];
  outcome?: 'correct' | 'incorrect';
  actualMove?: string;
  notes?: string;
}

const recentDecisions: Decision[] = [
  {
    id: '1',
    date: 'Dec 19, 10:30',
    asset: 'NVDA',
    prediction: 'up',
    confidence: 'high',
    reasons: ['Pattern bullish', 'Volume 2.8x avg', 'AI suggested'],
    outcome: 'correct',
    actualMove: '+2.3%',
  },
  {
    id: '2',
    date: 'Dec 18, 14:00',
    asset: 'BTC',
    prediction: 'up',
    confidence: 'medium',
    reasons: ['Trend strong', 'News positive'],
    outcome: 'correct',
    actualMove: '+3.2%',
  },
  {
    id: '3',
    date: 'Dec 17, 09:15',
    asset: 'SPY',
    prediction: 'down',
    confidence: 'low',
    reasons: ['Gut feeling', 'VIX spike'],
    outcome: 'incorrect',
    actualMove: '+0.8%',
  },
];

interface Analytics {
  winRate: number;
  bestReason: string;
  worstReason: string;
  bestTime: string;
  worstTime: string;
  bestAsset: string;
  worstAsset: string;
}

const analytics: Analytics = {
  winRate: 68,
  bestReason: 'Pattern detected (78% win rate)',
  worstReason: 'Gut feeling (45% win rate)',
  bestTime: 'Morning 6-10 AM (71% win rate)',
  worstTime: 'Afternoon 14-16 (58% win rate)',
  bestAsset: 'Tech stocks (82% win rate)',
  worstAsset: 'Crypto (45% win rate)',
};

export function DecisionJournal() {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);

  return (
    <Card className="p-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-white/10">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              📓 DECISION JOURNAL
            </h2>
            <p className="text-sm text-gray-400">Track and learn from your trading decisions</p>
          </div>
          <Button
            className="bg-purple-500/20 border border-purple-400/30 text-purple-300 hover:bg-purple-500/30"
            onClick={() => setShowAnalytics(!showAnalytics)}
          >
            {showAnalytics ? '📝 Journal' : '📊 Analytics'}
          </Button>
        </div>
      </div>

      {!showAnalytics ? (
        <div className="space-y-6">
          {/* Quick Entry Form */}
          <Card className="p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-400" />
              QUICK ENTRY (30 seconds)
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Asset</label>
                  <input
                    className="w-full px-3 py-2 rounded-lg bg-gray-900/50 border border-white/10 text-white text-sm"
                    placeholder="e.g., NVDA"
                    type="text"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Prediction</label>
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-green-500/20 border-green-400/30 text-green-300" size="sm">
                      ↑ Up
                    </Button>
                    <Button className="flex-1 bg-red-500/20 border-red-400/30 text-red-300" size="sm">
                      ↓ Down
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-2 block">Why? (select all that apply)</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Pattern', 'Trend', 'News', 'Volume', 'Intuition', 'AI'].map((reason) => (
                    <Button
                      key={reason}
                      className="border-white/10 text-gray-300 hover:bg-purple-500/20"
                      size="sm"
                      variant="outline"
                    >
                      {reason}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 bg-green-500/20 border border-green-500/30 text-green-300">
                  ✓ Save Entry
                </Button>
                <Button className="border-white/10 text-gray-400" variant="outline">
                  Skip
                </Button>
              </div>
            </div>
          </Card>

          {/* Recent Decisions */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">RECENT DECISIONS</h3>
            <div className="space-y-3">
              {recentDecisions.map((decision) => (
                <Card
                  key={decision.id}
                  className={`p-4 border transition-all cursor-pointer hover:scale-[1.02] ${
                    decision.outcome === 'correct'
                      ? 'bg-green-500/5 border-green-500/20'
                      : decision.outcome === 'incorrect'
                      ? 'bg-red-500/5 border-red-500/20'
                      : 'bg-gray-900/30 border-white/5'
                  }`}
                  onClick={() => setSelectedDecision(decision)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        decision.outcome === 'correct'
                          ? 'bg-green-500/20 border border-green-400/30'
                          : decision.outcome === 'incorrect'
                          ? 'bg-red-500/20 border border-red-400/30'
                          : 'bg-gray-500/20 border border-gray-400/30'
                      }`}>
                        {decision.prediction === 'up' ? (
                          <TrendingUp className="w-5 h-5 text-green-400" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <div>
                        <div className="text-white font-semibold">{decision.asset}</div>
                        <div className="text-xs text-gray-400">{decision.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      {decision.outcome && (
                        <>
                          <Badge className={
                            decision.outcome === 'correct'
                              ? 'bg-green-500/20 text-green-300 border-green-400/30'
                              : 'bg-red-500/20 text-red-300 border-red-400/30'
                          }>
                            {decision.outcome === 'correct' ? '✓ Correct' : '✗ Wrong'}
                          </Badge>
                          <div className={`text-xs mt-1 ${
                            decision.actualMove?.startsWith('+') ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {decision.actualMove}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {decision.reasons.map((reason, idx) => (
                      <Badge key={idx} className="text-xs" variant="secondary">
                        {reason}
                      </Badge>
                    ))}
                    <Badge className={`text-xs ${
                      decision.confidence === 'high'
                        ? 'bg-green-500/20 text-green-300'
                        : decision.confidence === 'medium'
                        ? 'bg-yellow-500/20 text-yellow-300'
                        : 'bg-gray-500/20 text-gray-300'
                    }`}>
                      {decision.confidence} confidence
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Analytics View */
        <div className="space-y-6">
          {/* Overall Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 bg-green-500/10 border-green-500/20 text-center">
              <div className="text-sm text-gray-400 mb-2">Win Rate</div>
              <div className="text-3xl font-bold text-green-400">{analytics.winRate}%</div>
            </Card>
            <Card className="p-4 bg-blue-500/10 border-blue-500/20 text-center">
              <div className="text-sm text-gray-400 mb-2">Total Decisions</div>
              <div className="text-3xl font-bold text-blue-400">47</div>
            </Card>
            <Card className="p-4 bg-purple-500/10 border-purple-500/20 text-center">
              <div className="text-sm text-gray-400 mb-2">Streak</div>
              <div className="text-3xl font-bold text-purple-400">5 🔥</div>
            </Card>
          </div>

          {/* When You Win */}
          <Card className="p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-green-400" />
              <h3 className="text-white font-semibold">WHEN YOU WIN</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Most successful reason:</span>
                <span className="text-green-400 font-semibold">{analytics.bestReason}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Best time of day:</span>
                <span className="text-green-400 font-semibold">{analytics.bestTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Best performing asset:</span>
                <span className="text-green-400 font-semibold">{analytics.bestAsset}</span>
              </div>
            </div>
          </Card>

          {/* When You Lose */}
          <Card className="p-6 bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/20">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-red-400" />
              <h3 className="text-white font-semibold">WHEN YOU LOSE</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Weakest reason:</span>
                <span className="text-red-400 font-semibold">{analytics.worstReason}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Worst time of day:</span>
                <span className="text-red-400 font-semibold">{analytics.worstTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Challenging asset:</span>
                <span className="text-red-400 font-semibold">{analytics.worstAsset}</span>
              </div>
            </div>
          </Card>

          {/* Insights */}
          <Card className="p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h4 className="text-white font-semibold mb-3">KEY INSIGHTS:</h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                    <span>You're best at pattern-based decisions. Trust your analysis!</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                    <span>Crypto isn't your strong suit yet. More practice needed.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                    <span>Avoid making decisions after 2 PM - your accuracy drops.</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button className="flex-1 bg-blue-500/20 border border-blue-500/30 text-blue-300">
              📈 Full Analytics Report
            </Button>
            <Button className="flex-1 bg-purple-500/20 border border-purple-500/30 text-purple-300">
              📚 Improve Weak Areas
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
