import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export function WhatIfSimulator() {
  const [scenario, setScenario] = useState('fed-hike');
  
  const scenarios = {
    'fed-hike': { name: '🦅 Fed Raises Rates', impact: -2.5 },
    'recession': { name: '📉 Recession Hits', impact: -8.2 },
    'ai-boom': { name: '🚀 AI Boom Continues', impact: +15.3 },
  };

  return (
    <Card className="p-8 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-white/10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">🎮 WHAT-IF SIMULATOR</h2>
        <p className="text-sm text-gray-400">Test market scenarios</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {Object.entries(scenarios).map(([key, s]) => (
          <Button
            key={key}
            variant={scenario === key ? 'default' : 'outline'}
            onClick={() => setScenario(key)}
            className={scenario === key ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'border-white/10'}
          >
            {s.name}
          </Button>
        ))}
      </div>

      <Card className="p-6 bg-gray-900/50 border-white/10 mb-4">
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-2">Estimated Portfolio Impact</div>
          <div className={`text-5xl font-bold mb-2 ${
            scenarios[scenario as keyof typeof scenarios].impact > 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {scenarios[scenario as keyof typeof scenarios].impact > 0 ? '+' : ''}
            {scenarios[scenario as keyof typeof scenarios].impact}%
          </div>
          <div className="text-xs text-gray-400">On your current positions</div>
        </div>
      </Card>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">S&P 500</span>
          <Badge className="bg-red-500/20 text-red-300">-2.0%</Badge>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Tech Stocks</span>
          <Badge className="bg-red-500/20 text-red-300">-4.5%</Badge>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Bonds</span>
          <Badge className="bg-green-500/20 text-green-300">+1.5%</Badge>
        </div>
      </div>
    </Card>
  );
}
