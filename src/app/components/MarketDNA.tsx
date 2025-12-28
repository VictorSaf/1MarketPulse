import { useState, useMemo, useCallback } from 'react';

import { ArrowRight, Clock, TrendingUp, Calendar } from 'lucide-react';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Progress } from './ui/progress';

interface DNAComponent {
  code: 'A' | 'T' | 'G' | 'C';
  name: string;
  value: number;
  description: string;
  color: string;
}

interface GeneticMatch {
  date: string;
  similarity: number;
  outcome: string;
  details: string;
}

const dnaComponents: DNAComponent[] = [
  {
    code: 'A',
    name: 'Appetite',
    value: 78,
    description: 'Risk appetite level',
    color: 'text-green-400',
  },
  {
    code: 'T',
    name: 'Trend',
    value: 68,
    description: 'Bullish momentum',
    color: 'text-blue-400',
  },
  {
    code: 'G',
    name: 'Gravity',
    value: 42,
    description: 'Pullback risk',
    color: 'text-yellow-400',
  },
  {
    code: 'C',
    name: 'Catalyst',
    value: 89,
    description: 'Event sensitivity',
    color: 'text-purple-400',
  },
];

const geneticMatches: GeneticMatch[] = [
  {
    date: 'Nov 14, 2024',
    similarity: 94,
    outcome: 'SPX +1.8% by close',
    details: 'NVDA +4.2%, Tech led rally',
  },
  {
    date: 'Oct 3, 2024',
    similarity: 91,
    outcome: 'Rally continued 3 days',
    details: 'Momentum sustained through week',
  },
  {
    date: 'Sep 18, 2024',
    similarity: 89,
    outcome: 'Pullback at 2pm',
    details: 'Recovered by close, +0.3%',
  },
  {
    date: 'Aug 22, 2024',
    similarity: 87,
    outcome: 'Breakout failed',
    details: 'Reversed -0.8% day',
  },
];

const historicalStats = {
  totalMatches: 47,
  greenDays: 72,
  averageMove: 0.9,
  bestSector: 'Tech',
  bestSectorWinRate: 83,
  worstTime: '14:00-15:00',
  worstTimeReason: 'FOMC effect',
};

export function MarketDNA() {
  const [selectedMatch, setSelectedMatch] = useState<GeneticMatch | null>(null);
  const [showTimeMachine, setShowTimeMachine] = useState(false);

  // Memoize DNA sequence generation to prevent recalculation on every render
  const topSequence = useMemo(() => {
    const sequence = [];
    for (let i = 0; i < 20; i++) {
      const codes = ['A', 'T', 'G', 'C'];
      sequence.push(codes[Math.floor(Math.random() * codes.length)]);
    }
    return sequence;
  }, []);

  const bottomSequence = useMemo(() => {
    return topSequence.map((code) => {
      const pairs: Record<string, string> = { A: 'T', T: 'A', G: 'C', C: 'G' };
      return pairs[code] || code;
    });
  }, [topSequence]);

  // Memoize callback handlers
  const handleMatchClick = useCallback((match: GeneticMatch) => {
    setSelectedMatch(match);
    setShowTimeMachine(true);
  }, []);

  const handleCloseTimeMachine = useCallback(() => {
    setShowTimeMachine(false);
  }, []);

  return (
    <>
      <div className="space-y-6">
        {/* Main DNA Card */}
        <Card className="p-8 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-white/10 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              🧬 TODAY'S MARKET DNA
            </h2>
            <p className="text-sm text-gray-400">
              Genetic profile of the trading day
            </p>
          </div>

          {/* DNA Double Helix Visualization */}
          <div className="mb-8">
            <div className="bg-gray-900/50 rounded-lg p-6 border border-white/5">
              <div className="font-mono text-center mb-4">
                <div className="flex justify-center gap-2 mb-2">
                  {topSequence.map((code, i) => {
                    const component = dnaComponents.find((c) => c.code === code);
                    return (
                      <span
                        key={i}
                        className={`text-lg font-bold ${component?.color || 'text-gray-400'}`}
                      >
                        {code}
                      </span>
                    );
                  })}
                </div>
                <div className="flex justify-center gap-2 text-gray-600">
                  {topSequence.map((_, i) => (
                    <span key={i}>│</span>
                  ))}
                </div>
                <div className="flex justify-center gap-2 mt-2">
                  {bottomSequence.map((code, i) => {
                    const component = dnaComponents.find((c) => c.code === code);
                    return (
                      <span
                        key={i}
                        className={`text-lg font-bold ${component?.color || 'text-gray-400'}`}
                      >
                        {code}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* DNA Components */}
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">DNA COMPONENTS</h3>
            {dnaComponents.map((component, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-gray-900/30 border border-white/5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg bg-gray-900 border border-white/10 flex items-center justify-center font-mono font-bold ${component.color}`}
                    >
                      {component.code}
                    </div>
                    <div>
                      <div className="font-semibold text-white">
                        {component.code} ({component.name})
                      </div>
                      <div className="text-xs text-gray-400">
                        {component.description}
                      </div>
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${component.color}`}>
                    {component.value}%
                  </div>
                </div>
                <Progress className="h-2" value={component.value} />
              </div>
            ))}
          </div>

          {/* Genetic Matches */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              🔬 GENETIC MATCHES
              <Badge className="bg-purple-500/20 text-purple-300" variant="secondary">
                Days with similar DNA
              </Badge>
            </h3>

            <div className="space-y-3 mb-6">
              {geneticMatches.map((match, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-gray-900/30 border border-white/5 hover:bg-gray-900/50 transition-colors cursor-pointer"
                  onClick={() => handleMatchClick(match)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">
                          {match.similarity}%
                        </div>
                        <div className="text-xs text-gray-400">Match</div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-semibold text-white">
                            {match.date}
                          </span>
                        </div>
                        <div className="text-sm text-green-400 mb-1">
                          {match.outcome}
                        </div>
                        <div className="text-xs text-gray-400">{match.details}</div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Historical Statistics */}
            <div className="p-6 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
              <div className="text-center mb-4">
                <div className="text-sm text-gray-400 mb-2">
                  📊 Based on {historicalStats.totalMatches} similar DNA patterns
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {historicalStats.greenDays}%
                  </div>
                  <div className="text-xs text-gray-400">Ended green</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    +{historicalStats.averageMove}%
                  </div>
                  <div className="text-xs text-gray-400">Average move</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-purple-400">
                    {historicalStats.bestSector}
                  </div>
                  <div className="text-xs text-gray-400">
                    {historicalStats.bestSectorWinRate}% win rate
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold text-yellow-400">
                    {historicalStats.worstTime}
                  </div>
                  <div className="text-xs text-gray-400">
                    {historicalStats.worstTimeReason}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Insight Card */}
        <Card className="p-6 bg-gradient-to-r from-purple-500/5 to-blue-500/5 border-purple-500/20">
          <div className="flex items-start gap-4">
            <div className="text-4xl">💡</div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">AI Insight</h3>
              <p className="text-gray-300 leading-relaxed">
                Today's DNA shows <span className="text-purple-400 font-semibold">high catalyst sensitivity</span> (89%) combined with{' '}
                <span className="text-green-400 font-semibold">strong risk appetite</span> (78%). 
                Historical patterns suggest this is favorable for{' '}
                <span className="text-blue-400 font-semibold">momentum plays in tech</span>, particularly 
                around major announcements. Watch for opportunities between 10:00-14:00 UTC when similar 
                patterns historically performed best.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Time Machine Modal */}
      <Dialog open={showTimeMachine} onOpenChange={handleCloseTimeMachine}>
        <DialogContent className="max-w-4xl bg-gray-900 border-white/10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <Clock className="w-8 h-8 text-purple-400" />
              DNA Time Machine: {selectedMatch?.date}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Historical market behavior analysis from similar DNA patterns
            </DialogDescription>
          </DialogHeader>

          {selectedMatch && (
            <div className="space-y-6">
              {/* Match Details */}
              <div className="p-6 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-center p-4 rounded-lg bg-gray-900/50">
                    <div className="text-3xl font-bold text-purple-400">
                      {selectedMatch.similarity}%
                    </div>
                    <div className="text-xs text-gray-400">DNA Match</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-400 mb-2">What happened:</div>
                    <div className="text-lg font-semibold text-white mb-1">
                      {selectedMatch.outcome}
                    </div>
                    <div className="text-sm text-gray-300">
                      {selectedMatch.details}
                    </div>
                  </div>
                </div>
              </div>

              {/* Intraday Chart Simulation */}
              <div className="p-6 rounded-lg bg-gray-900/50 border border-white/5">
                <h4 className="text-sm font-semibold text-white mb-4">
                  Intraday Movement
                </h4>
                <div className="h-48 bg-gray-900/30 rounded-lg flex items-end justify-around p-4 gap-1">
                  {Array.from({ length: 12 }, (_, i) => {
                    const height = 30 + Math.random() * 60;
                    const color =
                      i < 4
                        ? 'bg-green-500/50'
                        : i < 8
                        ? 'bg-green-500'
                        : 'bg-green-400';
                    return (
                      <div
                        key={i}
                        className={`flex-1 ${color} rounded-t transition-all`}
                        style={{ height: `${height}%` }}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>9:30</span>
                  <span>11:00</span>
                  <span>12:30</span>
                  <span>14:00</span>
                  <span>15:30</span>
                  <span>16:00</span>
                </div>
              </div>

              {/* Key Moments */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-4">
                  Key Moments That Day
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-900/30">
                    <span className="text-xs text-gray-400 mt-1">10:30</span>
                    <div className="flex-1">
                      <div className="text-sm text-green-400 font-semibold mb-1">
                        CPI data better than expected
                      </div>
                      <div className="text-xs text-gray-400">
                        Immediate rally began, SPX +0.8% in first hour
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-900/30">
                    <span className="text-xs text-gray-400 mt-1">14:00</span>
                    <div className="flex-1">
                      <div className="text-sm text-yellow-400 font-semibold mb-1">
                        Brief pullback (profit taking)
                      </div>
                      <div className="text-xs text-gray-400">
                        Healthy consolidation, dip buyers active
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-900/30">
                    <span className="text-xs text-gray-400 mt-1">15:00</span>
                    <div className="flex-1">
                      <div className="text-sm text-green-400 font-semibold mb-1">
                        Second wave buying into close
                      </div>
                      <div className="text-xs text-gray-400">
                        Momentum accelerated, institutions accumulated
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Learning Insight */}
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <div className="text-sm font-semibold text-blue-300 mb-1">
                      History suggests:
                    </div>
                    <div className="text-sm text-gray-300">
                      "Buy dips after 14:00 today. Similar DNA patterns show afternoon 
                      consolidations often lead to strong closes. Consider adding to 
                      positions on any 2pm weakness."
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
