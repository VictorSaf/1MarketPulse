import { ArrowRight } from 'lucide-react';

import { Badge } from './ui/badge';
import { Card } from './ui/card';

export function DominoEffectTracker() {
  const chain = [
    { event: 'BoJ Policy', impact: 'Yen -0.8%', time: '06:30', status: 'completed' },
    { event: 'USD Strength', impact: 'DXY +0.4%', time: '07:15', status: 'completed' },
    { event: 'Gold Drop', impact: 'Gold -0.3%', time: '08:00', status: 'completed' },
    { event: 'US Futures', impact: 'Predicted +0.5%', time: 'Next', status: 'pending' },
  ];

  return (
    <Card className="p-8 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-white/10">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl font-bold text-white">🎯 DOMINO EFFECT TRACKER</h2>
          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30 text-xs">
            SIMULATED
          </Badge>
        </div>
        <p className="text-sm text-gray-400">Cause-effect chain analysis (example scenario)</p>
      </div>

      <div className="space-y-4">
        {chain.map((domino, i) => (
          <div key={i} className="flex items-center gap-4">
            <Card className={`flex-1 p-4 ${
              domino.status === 'completed' 
                ? 'bg-green-500/10 border-green-500/20' 
                : 'bg-gray-900/50 border-white/10'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold">{domino.event}</div>
                  <div className="text-sm text-gray-400">{domino.time}</div>
                </div>
                <div className="text-right">
                  <Badge className={domino.status === 'completed' ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'}>
                    {domino.impact}
                  </Badge>
                </div>
              </div>
            </Card>
            {i < chain.length - 1 && (
              <ArrowRight className="w-6 h-6 text-gray-500" />
            )}
          </div>
        ))}
      </div>

      <Card className="mt-6 p-4 bg-blue-500/10 border-blue-500/20">
        <div className="text-sm text-gray-300">
          💡 <strong>Prediction:</strong> Based on chain, 75% probability US futures open higher
        </div>
      </Card>
    </Card>
  );
}
