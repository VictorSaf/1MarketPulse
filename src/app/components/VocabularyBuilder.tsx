import { useState } from 'react';

import { BookOpen, Check, X, Brain, Sparkles } from 'lucide-react';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';

interface Term {
  term: string;
  definition: string;
  example: string;
  status: 'new' | 'learning' | 'known';
}

export function VocabularyBuilder() {
  const [terms] = useState<Term[]>([
    {
      term: 'VIX',
      definition: 'The Volatility Index - measures expected market volatility over the next 30 days',
      example: 'VIX at 14.2 means low expected volatility (calm market)',
      status: 'known'
    },
    {
      term: 'Support',
      definition: 'A price level where buying pressure is strong enough to prevent further decline',
      example: 'NVDA found support at $480 - buyers stepped in at this level',
      status: 'known'
    },
    {
      term: 'Resistance',
      definition: 'A price level where selling pressure is strong enough to prevent further rise',
      example: 'NVDA faces resistance at $500 - sellers active at this level',
      status: 'learning'
    },
    {
      term: 'Breakout',
      definition: 'When price moves above resistance or below support with increased volume',
      example: 'NVDA broke out above $485 on 2x volume - bullish signal',
      status: 'learning'
    },
    {
      term: 'Dark Pool',
      definition: 'Private exchanges where large institutional orders are executed away from public markets',
      example: 'Dark pool activity at 42% suggests institutional positioning',
      status: 'new'
    },
    {
      term: 'Gamma',
      definition: 'The rate of change in an option\'s delta relative to price movement',
      example: 'Positive gamma exposure means dealers will buy dips',
      status: 'new'
    }
  ]);

  const knownCount = terms.filter(t => t.status === 'known').length;
  const learningCount = terms.filter(t => t.status === 'learning').length;
  const newCount = terms.filter(t => t.status === 'new').length;

  return (
    <Card className="glass-card border-purple-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-400" />
          Vocabulary Builder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Your Progress</span>
            <span className="font-bold text-white">{knownCount}/{terms.length} Terms Mastered</span>
          </div>
          <Progress className="h-2" value={(knownCount / terms.length) * 100} />

          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="text-2xl font-bold text-green-400">{knownCount}</div>
              <div className="text-xs text-gray-400">Known</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <div className="text-2xl font-bold text-yellow-400">{learningCount}</div>
              <div className="text-xs text-gray-400">Learning</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="text-2xl font-bold text-blue-400">{newCount}</div>
              <div className="text-xs text-gray-400">New</div>
            </div>
          </div>
        </div>

        {/* Terms List */}
        <div className="space-y-3">
          {terms.map((term, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-gray-800/50 border border-white/5 hover:border-purple-500/30 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-white">{term.term}</span>
                    <Badge
                      className={
                        term.status === 'known'
                          ? 'bg-green-500/20 text-green-400'
                          : term.status === 'learning'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }
                      variant={
                        term.status === 'known'
                          ? 'default'
                          : term.status === 'learning'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {term.status === 'known' ? (
                        <Check className="w-3 h-3 mr-1" />
                      ) : term.status === 'learning' ? (
                        <Brain className="w-3 h-3 mr-1" />
                      ) : (
                        <Sparkles className="w-3 h-3 mr-1" />
                      )}
                      {term.status}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-300">{term.definition}</p>

                  <div className="p-2 rounded bg-blue-500/10 border-l-2 border-blue-500">
                    <p className="text-xs text-gray-400">
                      <span className="font-semibold text-blue-400">Example:</span> {term.example}
                    </p>
                  </div>
                </div>

                {term.status !== 'known' && (
                  <div className="flex gap-2">
                    <Button className="h-8 w-8 p-0" size="sm" variant="outline">
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button className="h-8 w-8 p-0" size="sm" variant="outline">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Review Button */}
        <Button className="w-full" size="lg">
          <Brain className="w-4 h-4 mr-2" />
          Review Flashcards (5 min)
        </Button>
      </CardContent>
    </Card>
  );
}
