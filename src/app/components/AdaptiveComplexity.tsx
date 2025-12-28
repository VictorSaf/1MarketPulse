import { Gauge } from 'lucide-react';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';


export function AdaptiveComplexity() {
  const currentLevel = 3;

  return (
    <Card className="p-8 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-white/10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          📊 ADAPTIVE COMPLEXITY
        </h2>
        <p className="text-sm text-gray-400">Content difficulty adjusts to your level automatically</p>
      </div>

      <Card className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Gauge className="w-6 h-6 text-blue-400" />
            <div>
              <div className="text-white font-semibold">Current Level: 3/5</div>
              <div className="text-xs text-gray-400">Balanced complexity</div>
            </div>
          </div>
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30">
            AUTO-ADJUSTED
          </Badge>
        </div>

        <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden mb-2">
          <div className="absolute top-0 left-0 h-full w-[60%] bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-full" />
        </div>

        <div className="flex justify-between text-xs text-gray-500">
          <span>Pure basics</span>
          <span className="text-blue-400 font-semibold">You are here</span>
          <span>Pro mode</span>
        </div>
      </Card>

      <Card className="p-6 bg-gray-900/50 border-white/10 mb-6">
        <h4 className="text-white font-semibold mb-4">SYSTEM IS TRACKING:</h4>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Time on complex content</span>
            <Badge variant="secondary">High ✓</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Basic explanations skipped</span>
            <Badge variant="secondary">78%</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Quiz accuracy</span>
            <Badge className="bg-green-500/20 text-green-300">82%</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Advanced features used</span>
            <Badge variant="secondary">5/12</Badge>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-5 gap-2 mb-6">
        {[1, 2, 3, 4, 5].map((level) => (
          <Card
            key={level}
            className={`p-4 text-center ${
              level === currentLevel
                ? 'bg-blue-500/20 border-blue-400/30'
                : level < currentLevel
                ? 'bg-green-500/10 border-green-400/20'
                : 'bg-gray-900/30 border-white/5 opacity-50'
            }`}
          >
            <div className="text-2xl font-bold text-white mb-1">{level}</div>
            <div className="text-xs text-gray-400">
              {level === 1
                ? 'Basics'
                : level === 2
                ? 'Terms'
                : level === 3
                ? 'Mixed'
                : level === 4
                ? 'Data'
                : 'Pro'}
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-purple-500/10 border-purple-500/20 mb-4">
        <h4 className="text-white font-semibold mb-3">WHAT THIS MEANS FOR YOU:</h4>
        <div className="space-y-2 text-sm text-gray-300">
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2" />
            <span>Technical terms used freely with tooltips on-demand</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2" />
            <span>Mix of simple explanations and deeper analysis</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2" />
            <span>Gradually introducing advanced features</span>
          </div>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button
          className="flex-1 border-white/10 text-gray-400 hover:bg-gray-900/50"
          variant="outline"
        >
          🎚️ Manual Override
        </Button>
        <Button className="flex-1 bg-blue-500/20 border border-blue-500/30 text-blue-300">
          🤖 Let AI Decide
        </Button>
      </div>
    </Card>
  );
}
