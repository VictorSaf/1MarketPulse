import { Lock, Unlock, CheckCircle } from 'lucide-react';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';


interface Layer {
  level: number;
  name: string;
  unlocked: boolean;
  requirement: string;
  content: string;
}

const layers: Layer[] = [
  {
    level: 0,
    name: 'Surface',
    unlocked: true,
    requirement: 'Everyone sees this',
    content: 'NVDA: $481.50 (+2.3%) 🟢 Bullish',
  },
  {
    level: 1,
    name: 'Context',
    unlocked: true,
    requirement: 'Read 3 articles',
    content: 'Volume: 2.8x average | 8 days green | 0.5% from ATH',
  },
  {
    level: 2,
    name: 'Pattern',
    unlocked: false,
    requirement: 'Complete pattern lesson',
    content: 'Coiled Spring pattern detected (82% confidence)',
  },
  {
    level: 3,
    name: 'Flow',
    unlocked: false,
    requirement: 'Learn money flow',
    content: 'Block trades: $45M net buying | Dark pool: 42%',
  },
];

export function ProgressiveRevelation() {
  return (
    <Card className="p-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-white/10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">🔓 Progressive Revelation</h2>
        <p className="text-sm text-gray-400">
          Information unlocks as you learn - no overwhelming data dumps
        </p>
      </div>

      <div className="space-y-4">
        {layers.map((layer) => (
          <Card
            key={layer.level}
            className={`p-4 ${
              layer.unlocked
                ? 'bg-green-500/10 border-green-500/20'
                : 'bg-gray-900/30 border-gray-700/30'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {layer.unlocked ? (
                  <Unlock className="w-5 h-5 text-green-400" />
                ) : (
                  <Lock className="w-5 h-5 text-gray-500" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">Layer {layer.level}</span>
                    <Badge className="text-xs" variant="secondary">
                      {layer.name}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-400">{layer.requirement}</div>
                </div>
              </div>
              {layer.unlocked && <CheckCircle className="w-5 h-5 text-green-400" />}
            </div>

            {layer.unlocked ? (
              <div className="text-sm text-white bg-black/20 p-3 rounded">{layer.content}</div>
            ) : (
              <div className="text-sm text-gray-500 italic">🔒 Locked - {layer.requirement}</div>
            )}
          </Card>
        ))}
      </div>

      <Button className="w-full mt-6 bg-purple-500/20 border border-purple-500/30 text-purple-300">
        Complete lessons to unlock more layers
      </Button>
    </Card>
  );
}
