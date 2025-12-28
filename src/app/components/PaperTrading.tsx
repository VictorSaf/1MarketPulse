import { useState } from 'react';

import { TrendingUp, TrendingDown, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';


interface Position {
  symbol: string;
  qty: number;
  entry: number;
  current: number;
  pnl: number;
  pnlPct: number;
}

export function PaperTrading() {
  const [showNewTrade, setShowNewTrade] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');
  const [newQty, setNewQty] = useState('');
  const [newEntry, setNewEntry] = useState('');

  const [positions, setPositions] = useState<Position[]>([
    { symbol: 'NVDA', qty: 10, entry: 450.00, current: 481.50, pnl: +315.00, pnlPct: +7.0 },
    { symbol: 'BTC', qty: 0.5, entry: 42000, current: 44123, pnl: +1061.50, pnlPct: +5.1 },
  ]);

  const totalPnL = positions.reduce((sum, p) => sum + p.pnl, 0);

  const handleNewTrade = () => {
    if (!newSymbol || !newQty || !newEntry) {
      toast.error('Please fill all fields');
      return;
    }

    const qty = parseFloat(newQty);
    const entry = parseFloat(newEntry);
    // Simulate a small random price movement
    const current = entry * (1 + (Math.random() * 0.1 - 0.05));
    const pnl = (current - entry) * qty;
    const pnlPct = ((current - entry) / entry) * 100;

    const newPosition: Position = {
      symbol: newSymbol.toUpperCase(),
      qty,
      entry,
      current,
      pnl,
      pnlPct,
    };

    setPositions(prev => [...prev, newPosition]);
    setShowNewTrade(false);
    setNewSymbol('');
    setNewQty('');
    setNewEntry('');

    toast.success(`Opened ${qty} ${newSymbol.toUpperCase()} @ $${entry.toFixed(2)}`, {
      description: 'Paper trade added to portfolio',
    });
  };

  const handleClosePosition = (index: number) => {
    const pos = positions[index];
    setPositions(prev => prev.filter((_, i) => i !== index));
    toast.info(`Closed ${pos.symbol} position`, {
      description: `P&L: ${pos.pnl >= 0 ? '+' : ''}$${pos.pnl.toFixed(2)}`,
    });
  };

  return (
    <Card className="p-8 bg-gradient-to-br from-green-500/10 to-blue-500/10 border-white/10">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">📈 PAPER TRADING</h2>
            <p className="text-sm text-gray-400">Practice trading without risk</p>
          </div>
          <Button
            className="bg-gradient-to-r from-green-500 to-blue-500"
            onClick={() => setShowNewTrade(!showNewTrade)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Trade
          </Button>
        </div>
      </div>

      {/* New Trade Form */}
      {showNewTrade && (
        <Card className="mb-6 p-4 bg-blue-500/10 border-blue-500/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Open New Position</h3>
            <Button
              className="text-gray-400 hover:text-white"
              size="sm"
              variant="ghost"
              onClick={() => setShowNewTrade(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <Label className="text-gray-400">Symbol</Label>
              <Input
                className="bg-gray-900/50 border-white/10"
                placeholder="AAPL"
                value={newSymbol}
                onChange={(e) => setNewSymbol(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-gray-400">Quantity</Label>
              <Input
                className="bg-gray-900/50 border-white/10"
                placeholder="10"
                type="number"
                value={newQty}
                onChange={(e) => setNewQty(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-gray-400">Entry Price</Label>
              <Input
                className="bg-gray-900/50 border-white/10"
                placeholder="150.00"
                type="number"
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
              />
            </div>
          </div>
          <Button
            className="w-full bg-gradient-to-r from-green-500 to-blue-500"
            onClick={handleNewTrade}
          >
            Open Position
          </Button>
        </Card>
      )}

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
            <Card key={i} className="p-4 bg-gray-900/50 border-white/10 hover:border-white/20 transition-all">
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
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className={`text-lg font-bold ${pos.pnl > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ${pos.pnl.toFixed(2)}
                    </div>
                    <Badge className={pos.pnl > 0 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}>
                      {pos.pnl > 0 ? '+' : ''}{pos.pnlPct.toFixed(1)}%
                    </Badge>
                  </div>
                  <Button
                    className="border-red-500/30 text-red-300 hover:bg-red-500/20"
                    size="sm"
                    variant="outline"
                    onClick={() => handleClosePosition(i)}
                  >
                    Close
                  </Button>
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
