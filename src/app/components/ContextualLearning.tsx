import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { BookOpen, X } from 'lucide-react';

interface Term {
  word: string;
  simple: string;
  detail: string;
  example: string;
}

const terms: Record<string, Term> = {
  VIX: {
    word: 'VIX',
    simple: 'Fear Index - measures how scared the market is',
    detail:
      'The VIX (Volatility Index) measures expected volatility over the next 30 days, derived from S&P 500 options prices.',
    example: 'VIX below 15 = calm. VIX above 30 = fear.',
  },
  hawkish: {
    word: 'Hawkish',
    simple: 'Fed wants to raise interest rates',
    detail:
      'A hawkish stance means the Federal Reserve favors higher interest rates to combat inflation, which can slow economic growth.',
    example: '"Hawkish Fed" = rates going up = generally bad for stocks',
  },
};

export function ContextualLearning() {
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);

  return (
    <Card className="p-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-white/10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          📚 CONTEXTUAL LEARNING
        </h2>
        <p className="text-sm text-gray-400">Learn terms naturally as you encounter them</p>
      </div>

      <Card className="p-6 bg-gray-900/50 border-white/10 mb-6">
        <h4 className="text-white font-semibold mb-4">EXAMPLE: Reading Market News</h4>
        <div className="space-y-4">
          <p className="text-gray-300">
            "The Fed's{' '}
            <button
              onClick={() => setSelectedTerm('hawkish')}
              className="text-blue-400 underline decoration-dotted hover:text-blue-300 transition-colors"
            >
              hawkish
            </button>{' '}
            stance pushed yields higher, while the{' '}
            <button
              onClick={() => setSelectedTerm('VIX')}
              className="text-blue-400 underline decoration-dotted hover:text-blue-300 transition-colors"
            >
              VIX
            </button>{' '}
            remained subdued."
          </p>

          {selectedTerm && (
            <Card className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20 animate-in slide-in-from-top">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">
                    LEARNING MOMENT
                  </Badge>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedTerm(null)}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-400 mb-1">SIMPLE:</div>
                  <div className="text-white text-sm">{terms[selectedTerm].simple}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-400 mb-1">DETAILED:</div>
                  <div className="text-gray-300 text-sm">{terms[selectedTerm].detail}</div>
                </div>

                <div className="p-3 rounded-lg bg-black/20 border border-white/10">
                  <div className="text-xs text-gray-400 mb-1">💡 REMEMBER:</div>
                  <div className="text-white text-sm">{terms[selectedTerm].example}</div>
                </div>

                <Button
                  size="sm"
                  className="w-full bg-green-500/20 border border-green-500/30 text-green-300"
                >
                  ✓ Got it +5 XP
                </Button>
              </div>
            </Card>
          )}
        </div>
      </Card>

      <Card className="p-6 bg-gray-900/50 border-white/10 mb-6">
        <h4 className="text-white font-semibold mb-4">YOUR VOCABULARY PROGRESS:</h4>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">47</div>
            <div className="text-xs text-gray-400">Known Terms</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">12</div>
            <div className="text-xs text-gray-400">Learning</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">89</div>
            <div className="text-xs text-gray-400">To Discover</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">VIX</span>
            <Badge className="bg-green-500/20 text-green-300 text-xs">Mastered</Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Hawkish/Dovish</span>
            <Badge className="bg-yellow-500/20 text-yellow-300 text-xs">Learning</Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Put/Call Ratio</span>
            <Badge className="bg-yellow-500/20 text-yellow-300 text-xs">Learning</Badge>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-purple-500/10 border-purple-500/20">
        <h4 className="text-white font-semibold mb-3">HOW IT WORKS:</h4>
        <div className="space-y-2 text-sm text-gray-300">
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2" />
            <span>
              <strong className="text-purple-300">First time:</strong> Term is underlined, tap for
              full explanation
            </span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2" />
            <span>
              <strong className="text-purple-300">Second time:</strong> Hover shows brief reminder
            </span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2" />
            <span>
              <strong className="text-purple-300">After 5+ times:</strong> No highlight, you know
              it!
            </span>
          </div>
        </div>
      </Card>
    </Card>
  );
}
