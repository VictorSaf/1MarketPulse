import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ChevronRight, Eye, TrendingUp } from 'lucide-react';

interface CuriosityGap {
  id: string;
  type: 'incomplete' | 'contrast' | 'personal' | 'social' | 'prediction';
  teaser: string;
  reveal: string;
  icon: string;
}

const gaps: CuriosityGap[] = [
  {
    id: '1',
    type: 'incomplete',
    icon: '🔍',
    teaser: 'A rare pattern formed on a stock in your watchlist...',
    reveal:
      'NVDA just completed a "Coiled Spring" pattern (only 23 times in history). Last 5 times it happened, average move was +15% in 2 weeks. 80% success rate.',
  },
  {
    id: '2',
    type: 'contrast',
    icon: '⚡',
    teaser: '82% of traders got it wrong today. See what they missed.',
    reveal:
      'While everyone was bearish on tech, smart money was accumulating. Dark pool activity showed $2.3B net buying. The crowd missed this completely.',
  },
  {
    id: '3',
    type: 'personal',
    icon: '💡',
    teaser: "I found something interesting in your predictions...",
    reveal:
      'Your morning predictions are 78% accurate, but afternoon ones drop to 58%. Time of day matters for you - stick to morning analysis!',
  },
  {
    id: '4',
    type: 'social',
    icon: '👥',
    teaser: 'Top traders do something you don\'t. What is it?',
    reveal:
      'They check correlation matrices before making predictions. 85% of top performers analyze how assets move together. You can unlock this feature at Level 10.',
  },
];

export function CuriosityGaps() {
  const [revealedGaps, setRevealedGaps] = useState<Set<string>>(new Set());

  const revealGap = (id: string) => {
    setRevealedGaps(new Set([...revealedGaps, id]));
  };

  return (
    <Card className="p-8 bg-gradient-to-br from-orange-500/10 to-purple-500/10 border-white/10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          🔮 CURIOSITY TRIGGERS
        </h2>
        <p className="text-sm text-gray-400">Discover hidden insights that matter to you</p>
      </div>

      <div className="space-y-4">
        {gaps.map((gap) => (
          <Card
            key={gap.id}
            className={`p-5 transition-all ${
              revealedGaps.has(gap.id)
                ? 'bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20'
                : 'bg-gradient-to-r from-orange-500/10 to-purple-500/10 border-orange-500/20 hover:scale-[1.02]'
            }`}
          >
            {!revealedGaps.has(gap.id) ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 rounded-full bg-orange-500/20 border border-orange-400/30 flex items-center justify-center text-2xl">
                    {gap.icon}
                  </div>
                  <div className="flex-1">
                    <Badge
                      variant="secondary"
                      className="mb-2 text-xs bg-orange-500/20 text-orange-300"
                    >
                      {gap.type.toUpperCase()}
                    </Badge>
                    <p className="text-white font-semibold">{gap.teaser}</p>
                  </div>
                </div>
                <Button
                  onClick={() => revealGap(gap.id)}
                  className="bg-orange-500/20 border border-orange-500/30 text-orange-300 hover:bg-orange-500/30"
                >
                  Reveal
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="w-5 h-5 text-green-400" />
                  <Badge className="bg-green-500/20 text-green-300 border-green-400/30">
                    REVEALED
                  </Badge>
                </div>
                <div className="p-4 rounded-lg bg-black/20 border border-white/10">
                  <p className="text-white">{gap.reveal}</p>
                </div>
                {gap.type === 'personal' && (
                  <Card className="p-3 bg-blue-500/10 border-blue-500/20">
                    <div className="flex items-center gap-2 text-sm text-blue-300">
                      <TrendingUp className="w-4 h-4" />
                      <span>
                        <strong>Action:</strong> Set reminder to make predictions before noon
                      </span>
                    </div>
                  </Card>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>

      <Card className="mt-6 p-6 bg-gray-900/50 border-white/10">
        <h4 className="text-white font-semibold mb-4">HOW CURIOSITY GAPS WORK:</h4>
        <div className="space-y-2 text-sm text-gray-300">
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
            <span>
              <strong className="text-purple-300">Incomplete info:</strong> Creates tension that
              drives exploration
            </span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
            <span>
              <strong className="text-purple-300">Contrast:</strong> "Most got it wrong" triggers
              curiosity
            </span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
            <span>
              <strong className="text-purple-300">Personal:</strong> Relevant to YOUR behavior
            </span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
            <span>
              <strong className="text-purple-300">Always delivers:</strong> No clickbait, real value
            </span>
          </div>
        </div>
      </Card>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">Max 3-4 curiosity gaps per day • Always relevant</p>
      </div>
    </Card>
  );
}
