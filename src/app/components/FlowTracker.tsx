import { useMemo } from 'react';

import { TrendingUp, TrendingDown } from 'lucide-react';

import { Badge } from './ui/badge';
import { Card } from './ui/card';

export function FlowTracker() {
  // Memoize flows data to prevent recalculation
  const flows = useMemo(() => [
    { from: 'Bonds', to: 'Tech', amount: '$2.1B', direction: 'in', change: '+15%' },
    { from: 'Cash', to: 'Crypto', amount: '$1.8B', direction: 'in', change: '+22%' },
    { from: 'Defense', to: 'Financials', amount: '$0.8B', direction: 'in', change: '+8%' },
  ], []);

  return (
    <Card className="p-8 bg-gradient-to-br from-green-500/10 to-cyan-500/10 border-white/10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">💰 FLOW TRACKER</h2>
        <p className="text-sm text-gray-400">Where money is moving today</p>
      </div>

      <div className="mb-6">
        <Card className="p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-400 mb-2">+8</div>
            <div className="text-sm text-gray-300">Risk-On Rotation Score</div>
            <div className="text-xs text-gray-400 mt-1">Strong bullish flow</div>
          </div>
        </Card>
      </div>

      <div className="space-y-3">
        {flows.map((flow, i) => (
          <Card key={i} className="p-4 bg-gray-900/50 border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <div>
                  <div className="text-white font-semibold">
                    {flow.from} → {flow.to}
                  </div>
                  <div className="text-xs text-gray-400">{flow.amount} flowing</div>
                </div>
              </div>
              <Badge className="bg-green-500/20 text-green-300">
                {flow.change}
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <Card className="p-4 bg-green-500/10 border-green-500/20">
          <div className="text-xs text-gray-400 mb-1">Inflows</div>
          <div className="text-xl font-bold text-green-400">$4.7B</div>
        </Card>
        <Card className="p-4 bg-red-500/10 border-red-500/20">
          <div className="text-xs text-gray-400 mb-1">Outflows</div>
          <div className="text-xl font-bold text-red-400">$3.2B</div>
        </Card>
      </div>
    </Card>
  );
}
