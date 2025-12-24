import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import {
  Search,
  Star,
  TrendingUp,
  Calendar,
  Target,
  Zap,
  Award,
  BookOpen,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';

interface Pattern {
  id: string;
  name: string;
  asset: string;
  age: string;
  rarity: number; // 1-5 stars
  condition: number; // percentage
  type: 'breakout' | 'reversal' | 'squeeze' | 'divergence';
  confidence: number;
  historicalWinRate: number;
  description: string;
  discovered: string;
  status: 'excavating' | 'complete' | 'verified';
  imagePattern?: string;
}

interface PatternDetail {
  pattern: Pattern;
  historicalExamples: Array<{
    date: string;
    asset: string;
    outcome: string;
    move: string;
  }>;
  carbonDating: {
    upsideProbability: number;
    downsideProbability: number;
    expectedMove: string;
    timeToResolution: string;
  };
}

const patterns: Pattern[] = [
  {
    id: '1',
    name: 'The Coiled Spring',
    asset: 'NVDA',
    age: '5 trading days',
    rarity: 3,
    condition: 82,
    type: 'squeeze',
    confidence: 82,
    historicalWinRate: 68,
    description:
      '5 days of range compression + breakout on volume. Classic accumulation pattern.',
    discovered: 'Today at 09:30',
    status: 'complete',
  },
  {
    id: '2',
    name: 'The Phoenix',
    asset: 'BTC',
    age: '12 trading days',
    rarity: 5,
    condition: 95,
    type: 'reversal',
    confidence: 91,
    historicalWinRate: 89,
    description: 'V-shaped recovery from support with volume confirmation. Rare pattern.',
    discovered: '2 days ago',
    status: 'verified',
  },
  {
    id: '3',
    name: 'The Bull Flag',
    asset: 'TSLA',
    age: '3 trading days',
    rarity: 2,
    condition: 76,
    type: 'breakout',
    confidence: 74,
    historicalWinRate: 63,
    description: 'Consolidation after strong move. Continuation pattern forming.',
    discovered: 'Today at 11:15',
    status: 'excavating',
  },
  {
    id: '4',
    name: 'Hidden Divergence',
    asset: 'AAPL',
    age: '8 trading days',
    rarity: 4,
    condition: 88,
    type: 'divergence',
    confidence: 85,
    historicalWinRate: 72,
    description: 'RSI making higher lows while price makes lower lows. Bullish reversal signal.',
    discovered: 'Yesterday',
    status: 'complete',
  },
];

const patternDetails: Record<string, PatternDetail> = {
  '1': {
    pattern: patterns[0],
    historicalExamples: [
      { date: '2024 Oct', asset: 'NVDA', outcome: 'Bullish breakout', move: '+18% in 2 weeks' },
      { date: '2024 Jun', asset: 'AAPL', outcome: 'Bullish breakout', move: '+12% in 10 days' },
      { date: '2024 Mar', asset: 'TSLA', outcome: 'False breakout', move: '-8% reversal' },
      { date: '2023 Nov', asset: 'MSFT', outcome: 'Strong breakout', move: '+22% in 3 weeks' },
    ],
    carbonDating: {
      upsideProbability: 74,
      downsideProbability: 26,
      expectedMove: '±15%',
      timeToResolution: '3-7 trading days',
    },
  },
  '2': {
    pattern: patterns[1],
    historicalExamples: [
      { date: '2024 Sep', asset: 'BTC', outcome: 'Major reversal', move: '+45% in 6 weeks' },
      { date: '2024 Mar', asset: 'ETH', outcome: 'Strong recovery', move: '+38% in 4 weeks' },
      { date: '2023 Dec', asset: 'BTC', outcome: 'Sustained rally', move: '+52% in 2 months' },
    ],
    carbonDating: {
      upsideProbability: 89,
      downsideProbability: 11,
      expectedMove: '±25%',
      timeToResolution: '2-4 weeks',
    },
  },
};

export function PatternArchaeology() {
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [filter, setFilter] = useState<'all' | Pattern['type']>('all');

  const filteredPatterns =
    filter === 'all' ? patterns : patterns.filter((p) => p.type === filter);

  const handlePatternClick = (patternId: string) => {
    setSelectedPattern(patternId);
    setShowDetail(true);
  };

  const currentDetail = selectedPattern ? patternDetails[selectedPattern] : null;

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-orange-500/20 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🏺</div>
              <div>
                <h2 className="text-2xl font-bold text-white">PATTERN ARCHAEOLOGY LAB</h2>
                <p className="text-sm text-gray-400">
                  Discover and analyze market patterns like an archaeologist
                </p>
              </div>
            </div>
            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30">
              4 Active Excavations
            </Badge>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search patterns by name or asset..."
                className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'breakout', 'reversal', 'squeeze', 'divergence'] as const).map(
                (type) => (
                  <Button
                    key={type}
                    variant={filter === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter(type)}
                    className={
                      filter === type
                        ? 'bg-orange-500/20 border-orange-400/30 text-orange-300'
                        : 'border-white/10 text-gray-400'
                    }
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                )
              )}
            </div>
          </div>
        </Card>

        {/* Patterns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPatterns.map((pattern) => (
            <Card
              key={pattern.id}
              className={`p-6 border cursor-pointer transition-all hover:scale-105 ${
                pattern.status === 'excavating'
                  ? 'bg-gray-900/50 border-yellow-500/30'
                  : pattern.status === 'verified'
                  ? 'bg-green-500/5 border-green-500/30'
                  : 'bg-gray-900/50 border-white/10'
              }`}
              onClick={() => handlePatternClick(pattern.id)}
            >
              {/* Excavation Progress */}
              {pattern.status === 'excavating' && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center animate-pulse">
                        <Search className="w-6 h-6 text-yellow-400" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-yellow-400 font-semibold mb-1">
                        EXCAVATION IN PROGRESS
                      </div>
                      <Progress value={pattern.condition} className="h-2" />
                    </div>
                  </div>
                </div>
              )}

              {/* Pattern Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-white">{pattern.name}</h3>
                    {pattern.status === 'verified' && (
                      <Award className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="text-blue-400 font-semibold">{pattern.asset}</span>
                    <span>•</span>
                    <span>{pattern.age}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < pattern.rarity
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Pattern Type */}
              <Badge
                className={`mb-3 ${
                  pattern.type === 'breakout'
                    ? 'bg-green-500/20 text-green-300 border-green-400/30'
                    : pattern.type === 'reversal'
                    ? 'bg-blue-500/20 text-blue-300 border-blue-400/30'
                    : pattern.type === 'squeeze'
                    ? 'bg-purple-500/20 text-purple-300 border-purple-400/30'
                    : 'bg-orange-500/20 text-orange-300 border-orange-400/30'
                }`}
              >
                {pattern.type.charAt(0).toUpperCase() + pattern.type.slice(1)} Pattern
              </Badge>

              {/* Description */}
              <p className="text-sm text-gray-300 mb-4">{pattern.description}</p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-2 rounded-lg bg-gray-900/50">
                  <div className="text-lg font-bold text-orange-400">
                    {pattern.confidence}%
                  </div>
                  <div className="text-xs text-gray-400">Confidence</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-gray-900/50">
                  <div className="text-lg font-bold text-green-400">
                    {pattern.historicalWinRate}%
                  </div>
                  <div className="text-xs text-gray-400">Win Rate</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-gray-900/50">
                  <div className="text-lg font-bold text-blue-400">
                    {pattern.condition}%
                  </div>
                  <div className="text-xs text-gray-400">Condition</div>
                </div>
              </div>

              {/* Discovery Info */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>Discovered: {pattern.discovered}</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2 text-orange-400 hover:text-orange-300"
                >
                  View Details →
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Your Pattern Museum */}
        <Card className="p-6 bg-gradient-to-r from-purple-500/5 to-orange-500/5 border-purple-500/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🏛️</div>
              <div>
                <h3 className="text-xl font-bold text-white">YOUR PATTERN MUSEUM</h3>
                <p className="text-sm text-gray-400">Collection: 47 pieces</p>
              </div>
            </div>
          </div>

          {/* Wings */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {[
              { name: 'Breakouts', count: 12, icon: <TrendingUp className="w-5 h-5" /> },
              { name: 'Reversals', count: 8, icon: <Zap className="w-5 h-5" /> },
              { name: 'Squeezes', count: 15, icon: <Target className="w-5 h-5" /> },
              { name: 'Divergences', count: 7, icon: <Search className="w-5 h-5" /> },
              { name: 'Rare', count: 5, icon: <Star className="w-5 h-5" /> },
            ].map((wing, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-gray-900/50 border border-white/5 hover:bg-gray-900/70 transition-colors cursor-pointer text-center"
              >
                <div className="flex justify-center mb-2 text-orange-400">{wing.icon}</div>
                <div className="text-2xl font-bold text-white mb-1">{wing.count}</div>
                <div className="text-xs text-gray-400">{wing.name}</div>
              </div>
            ))}
          </div>

          {/* Rarest Find */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
            <div className="flex items-start gap-4">
              <div className="text-3xl">🏆</div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-yellow-300 mb-2">
                  RAREST FIND: "The Perfect Storm"
                </h4>
                <div className="flex gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-300 mb-2">
                  Found: March 2024 in BTC. 5 confluence factors aligned. Only 3 ever
                  recorded.
                </p>
                <p className="text-sm text-green-400 font-semibold">
                  Your trade: +34% profit
                </p>
              </div>
            </div>
          </div>

          {/* Collection Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">47</div>
              <div className="text-xs text-gray-400">Patterns found</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">31</div>
              <div className="text-xs text-gray-400">Successfully traded (66%)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">$4,230</div>
              <div className="text-xs text-gray-400">Total profit (paper)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">The Phoenix</div>
              <div className="text-xs text-gray-400">Rarest owned (only 12 exist)</div>
            </div>
          </div>

          {/* Curator Badges */}
          <div className="flex gap-2 mt-6">
            {[
              { icon: '🔍', name: 'Eagle Eye' },
              { icon: '🏺', name: 'Artifact Hunter' },
              { icon: '📚', name: 'Pattern Scholar' },
            ].map((badge, index) => (
              <Badge
                key={index}
                className="bg-purple-500/20 text-purple-300 border-purple-400/30"
              >
                {badge.icon} {badge.name}
              </Badge>
            ))}
          </div>
        </Card>
      </div>

      {/* Pattern Detail Modal */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-4xl bg-gray-900 border-white/10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              🏺 ARTIFACT ANALYSIS REPORT
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Detailed analysis of discovered trading pattern with historical data
            </DialogDescription>
          </DialogHeader>

          {currentDetail && (
            <div className="space-y-6">
              {/* Pattern Info */}
              <div className="p-6 rounded-lg bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/20">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {currentDetail.pattern.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                      <span className="text-blue-400 font-semibold">
                        Asset: {currentDetail.pattern.asset}
                      </span>
                      <span>•</span>
                      <span>Age: {currentDetail.pattern.age}</span>
                      <span>•</span>
                      <span>
                        Rarity:{' '}
                        <span className="text-yellow-400">
                          {'⭐'.repeat(currentDetail.pattern.rarity)}
                        </span>
                      </span>
                    </div>
                    <p className="text-gray-300">{currentDetail.pattern.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 rounded-lg bg-gray-900/50">
                    <div className="text-2xl font-bold text-orange-400">
                      {currentDetail.pattern.confidence}%
                    </div>
                    <div className="text-xs text-gray-400">Confidence</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-gray-900/50">
                    <div className="text-2xl font-bold text-green-400">
                      {currentDetail.pattern.historicalWinRate}%
                    </div>
                    <div className="text-xs text-gray-400">Historical Win Rate</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-gray-900/50">
                    <div className="text-2xl font-bold text-blue-400">
                      {currentDetail.pattern.condition}%
                    </div>
                    <div className="text-xs text-gray-400">Condition (intact)</div>
                  </div>
                </div>
              </div>

              {/* Historical Parallels */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  📜 HISTORICAL PARALLELS
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                    Similar artifacts
                  </Badge>
                </h4>
                <div className="space-y-3">
                  {currentDetail.historicalExamples.map((example, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg bg-gray-900/50 border border-white/5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="text-center">
                            <div className="text-sm font-semibold text-white">
                              {example.date}
                            </div>
                            <div className="text-xs text-gray-400">{example.asset}</div>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-blue-400 font-semibold mb-1">
                              {example.outcome}
                            </div>
                            <div className="text-sm text-green-400">{example.move}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Carbon Dating */}
              <div className="p-6 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
                <h4 className="text-lg font-semibold text-white mb-4">
                  🔬 CARBON DATING (Probability Analysis)
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400 mb-1">
                      {currentDetail.carbonDating.upsideProbability}%
                    </div>
                    <div className="text-xs text-gray-400">Upside breakout</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400 mb-1">
                      {currentDetail.carbonDating.downsideProbability}%
                    </div>
                    <div className="text-xs text-gray-400">Downside breakdown</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-400 mb-1">
                      {currentDetail.carbonDating.expectedMove}
                    </div>
                    <div className="text-xs text-gray-400">Expected move</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-yellow-400 mb-1">
                      {currentDetail.carbonDating.timeToResolution}
                    </div>
                    <div className="text-xs text-gray-400">Time to resolution</div>
                  </div>
                </div>

                <Progress
                  value={currentDetail.carbonDating.upsideProbability}
                  className="h-3 mb-2"
                />
                <p className="text-sm text-gray-400 text-center">
                  Probability favors upside movement
                </p>
              </div>

              {/* Museum Actions */}
              <div className="flex gap-3">
                <Button className="flex-1 bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Study This Type
                </Button>
                <Button className="flex-1 bg-green-500/20 border border-green-500/30 text-green-300 hover:bg-green-500/30">
                  <Target className="w-4 h-4 mr-2" />
                  Paper Trade
                </Button>
                <Button className="flex-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30">
                  🏛️ Add to Collection
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
