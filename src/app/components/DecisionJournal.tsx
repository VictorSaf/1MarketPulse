import { useState, useEffect, useCallback } from 'react';

import { TrendingUp, TrendingDown, Zap, Check } from 'lucide-react';

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

interface Analytics {
  winRate: number;
  totalDecisions: number;
  streak: number;
}

// Local storage key for persisting decisions
const STORAGE_KEY = 'decision-journal';

// Load decisions from localStorage
const loadDecisions = (): Decision[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save decisions to localStorage
const saveDecisions = (decisions: Decision[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(decisions));
  } catch (e) {
    console.error('Failed to save decisions:', e);
  }
};

// Analytics will be calculated from user's actual decisions
const getAnalytics = (decisions: Decision[]): Analytics => {
  const completed = decisions.filter(d => d.outcome);
  const correct = completed.filter(d => d.outcome === 'correct');

  // Calculate current streak
  let streak = 0;
  for (let i = completed.length - 1; i >= 0; i--) {
    if (completed[i].outcome === 'correct') {
      streak++;
    } else {
      break;
    }
  }

  return {
    winRate: completed.length > 0 ? Math.round((correct.length / completed.length) * 100) : 0,
    totalDecisions: decisions.length,
    streak,
  };
};

// Available reasons for decisions
const REASON_OPTIONS = ['Pattern', 'Trend', 'News', 'Volume', 'Intuition', 'AI'] as const;

export function DecisionJournal() {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [, setSelectedDecision] = useState<Decision | null>(null);
  const [decisions, setDecisions] = useState<Decision[]>([]);

  // Form state
  const [asset, setAsset] = useState('');
  const [prediction, setPrediction] = useState<'up' | 'down' | null>(null);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [confidence, setConfidence] = useState<'low' | 'medium' | 'high'>('medium');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load decisions on mount
  useEffect(() => {
    setDecisions(loadDecisions());
  }, []);

  // Toggle reason selection
  const toggleReason = (reason: string) => {
    setSelectedReasons(prev =>
      prev.includes(reason)
        ? prev.filter(r => r !== reason)
        : [...prev, reason]
    );
  };

  // Reset form
  const resetForm = useCallback(() => {
    setAsset('');
    setPrediction(null);
    setSelectedReasons([]);
    setConfidence('medium');
  }, []);

  // Save entry handler
  const handleSaveEntry = useCallback(() => {
    if (!asset.trim() || !prediction) {
      return; // Validation: require asset and prediction
    }

    const newDecision: Decision = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      asset: asset.trim().toUpperCase(),
      prediction,
      confidence,
      reasons: selectedReasons.length > 0 ? selectedReasons : ['Intuition'],
    };

    const updatedDecisions = [newDecision, ...decisions];
    setDecisions(updatedDecisions);
    saveDecisions(updatedDecisions);
    resetForm();

    // Show success feedback
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  }, [asset, prediction, confidence, selectedReasons, decisions, resetForm]);

  const analytics = getAnalytics(decisions);

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
                  <label className="text-xs text-gray-400 mb-2 block" htmlFor="asset-input">Asset</label>
                  <input
                    className="w-full px-3 py-2 rounded-lg bg-gray-900/50 border border-white/10 text-white text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                    id="asset-input"
                    placeholder="e.g., NVDA"
                    type="text"
                    value={asset}
                    onChange={(e) => setAsset(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Prediction</label>
                  <div className="flex gap-2">
                    <Button
                      className={`flex-1 ${
                        prediction === 'up'
                          ? 'bg-green-500/40 border-green-400 text-green-200'
                          : 'bg-green-500/20 border-green-400/30 text-green-300'
                      }`}
                      size="sm"
                      onClick={() => setPrediction('up')}
                    >
                      ↑ Up
                    </Button>
                    <Button
                      className={`flex-1 ${
                        prediction === 'down'
                          ? 'bg-red-500/40 border-red-400 text-red-200'
                          : 'bg-red-500/20 border-red-400/30 text-red-300'
                      }`}
                      size="sm"
                      onClick={() => setPrediction('down')}
                    >
                      ↓ Down
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-2 block">Why? (select all that apply)</label>
                <div className="grid grid-cols-3 gap-2">
                  {REASON_OPTIONS.map((reason) => (
                    <Button
                      key={reason}
                      className={`${
                        selectedReasons.includes(reason)
                          ? 'bg-purple-500/40 border-purple-400 text-purple-200'
                          : 'border-white/10 text-gray-300 hover:bg-purple-500/20'
                      }`}
                      size="sm"
                      variant="outline"
                      onClick={() => toggleReason(reason)}
                    >
                      {selectedReasons.includes(reason) && <Check className="w-3 h-3 mr-1" />}
                      {reason}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  className={`flex-1 ${
                    saveSuccess
                      ? 'bg-green-500 border-green-400 text-white'
                      : 'bg-green-500/20 border border-green-500/30 text-green-300 hover:bg-green-500/30'
                  } transition-colors`}
                  disabled={!asset.trim() || !prediction}
                  onClick={handleSaveEntry}
                >
                  {saveSuccess ? <><Check className="w-4 h-4 mr-2" /> Saved!</> : '✓ Save Entry'}
                </Button>
                <Button
                  className="border-white/10 text-gray-400"
                  variant="outline"
                  onClick={resetForm}
                >
                  Clear
                </Button>
              </div>
            </div>
          </Card>

          {/* Recent Decisions */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">RECENT DECISIONS</h3>
            {decisions.length === 0 ? (
              <Card className="p-8 bg-gray-900/30 border-white/5 text-center">
                <p className="text-gray-400 mb-2">No decisions recorded yet</p>
                <p className="text-sm text-gray-500">Use the Quick Entry form above to start tracking your trading decisions</p>
              </Card>
            ) : (
            <div className="space-y-3">
              {decisions.map((decision) => (
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
            )}
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
              <div className="text-3xl font-bold text-blue-400">{analytics.totalDecisions}</div>
            </Card>
            <Card className="p-4 bg-purple-500/10 border-purple-500/20 text-center">
              <div className="text-sm text-gray-400 mb-2">Streak</div>
              <div className="text-3xl font-bold text-purple-400">{analytics.streak}</div>
            </Card>
          </div>

          {analytics.totalDecisions === 0 ? (
            <Card className="p-8 bg-gray-900/30 border-white/5 text-center">
              <p className="text-gray-400 mb-2">No analytics available yet</p>
              <p className="text-sm text-gray-500">Start recording decisions to see your trading patterns and insights</p>
            </Card>
          ) : (
            <>
              {/* Insights will be generated from actual data */}
              <Card className="p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <h4 className="text-white font-semibold mb-3">YOUR INSIGHTS:</h4>
                    <div className="space-y-2 text-sm text-gray-300">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                        <span>Record more decisions to unlock personalized insights</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                        <span>Track at least 10 decisions to see patterns</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </>
          )}

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
