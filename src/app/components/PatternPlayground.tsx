import { useState } from 'react';

import { Play, RotateCcw } from 'lucide-react';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';


export function PatternPlayground() {
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  return (
    <Card className="p-8 bg-gradient-to-br from-green-500/10 to-blue-500/10 border-white/10">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">🎮 PATTERN PLAYGROUND</h2>
            <p className="text-sm text-gray-400">Interactive pattern recognition training</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{score}</div>
              <div className="text-xs text-gray-400">Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">🔥 {streak}</div>
              <div className="text-xs text-gray-400">Streak</div>
            </div>
          </div>
        </div>
      </div>

      <Card className="p-8 bg-gray-900/50 border-white/10 mb-6">
        <div className="text-center">
          <div className="text-lg text-gray-400 mb-6">Pattern Recognition Challenge</div>
          
          <div className="w-full h-48 bg-gray-800/50 rounded-lg border border-white/10 mb-6 flex items-center justify-center">
            <div className="text-gray-500">Chart Pattern Visualization</div>
          </div>

          <div className="text-white font-semibold mb-4">What pattern is this?</div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button className="border-white/10" variant="outline">
              Head & Shoulders
            </Button>
            <Button className="border-white/10" variant="outline">
              Double Top
            </Button>
            <Button className="border-white/10" variant="outline">
              Ascending Triangle
            </Button>
            <Button className="border-white/10" variant="outline">
              Bull Flag
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Button className="bg-gradient-to-r from-blue-500 to-purple-500">
          <Play className="w-4 h-4 mr-2" />
          Start Challenge
        </Button>
        <Button className="border-white/10" variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      <Card className="mt-6 p-4 bg-blue-500/10 border-blue-500/20">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Your Best:</span>
          <Badge className="bg-blue-500/20 text-blue-300">12 Correct Streak</Badge>
        </div>
      </Card>
    </Card>
  );
}
