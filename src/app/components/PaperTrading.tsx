import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function PaperTrading() {
  const positions = [
    { symbol: 'NVDA', qty: 10, entry: 450.00, current: 481.50, pnl: +315.00, pnlPct: +7.0 },
    { symbol: 'BTC', qty: 0.5, entry: 42000, current: 44123, pnl: +1061.50, pnlPct: +5.1 },
  ];

  const totalPnL = positions.reduce((sum, p) => sum + p.pnl, 0);

  return (
    <Card className="p-8 bg-gradient-to-br from-green-500/10 to-blue-500/10 border-white/10">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">📈 PAPER TRADING</h2>
            <p className="text-sm text-gray-400">Practice trading without risk</p>
          </div>
          <Button className="bg-gradient-to-r from-green-500 to-blue-500">
            New Trade
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="p-4 bg-gray-900/50 border-white/10">
          <div className="text-xs text-gray-400 mb-1">Portfolio Value</div>
          <div className="text-2xl font-bold text-white">$52,450</div>
        </Card>
        <Card className="p-4 bg-green-500/10 border-green-500/20">
          <div className="text-xs text-gray-400 mb-1">Total P&L</div>
          <div className="text-2xl font-bold text-green-400">+${totalPnL.toFixed(2)}</div>
        </Card>
        <Card className="p-4 bg-blue-500/10 border-blue-500/20">
          <div className="text-xs text-gray-400 mb-1">Win Rate</div>
          <div className="text-2xl font-bold text-blue-400">67%</div>
        </Card>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Open Positions</h3>
        <div className="space-y-3">
          {positions.map((pos, i) => (
            <Card key={i} className="p-4 bg-gray-900/50 border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {pos.pnl > 0 ? (
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-400" />
                  )}
                  <div>
                    <div className="text-white font-semibold">{pos.symbol}</div>
                    <div className="text-xs text-gray-400">{pos.qty} @ ${pos.entry.toFixed(2)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${pos.pnl > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${pos.pnl.toFixed(2)}
                  </div>
                  <Badge className={pos.pnl > 0 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}>
                    {pos.pnl > 0 ? '+' : ''}{pos.pnlPct.toFixed(1)}%
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Card className="mt-6 p-4 bg-purple-500/10 border-purple-500/20">
        <div className="text-sm text-gray-300 text-center">
          💡 Paper trading helps you practice strategies risk-free. All gains/losses are simulated.
        </div>
      </Card>
    </Card>
  );
}
