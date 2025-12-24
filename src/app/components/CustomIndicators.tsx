import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Plus, Code, TrendingUp } from 'lucide-react';

interface Indicator {
  id: string;
  name: string;
  description: string;
  formula: string;
  status: 'active' | 'testing' | 'archived';
}

const userIndicators: Indicator[] = [
  {
    id: '1',
    name: 'My Momentum Score',
    description: 'Combines RSI, Volume, and Price action',
    formula: '(RSI-50) * (Volume/AvgVol) * (Price/MA50)',
    status: 'active',
  },
  {
    id: '2',
    name: 'Fear-Greed Composite',
    description: 'Custom blend of VIX, Put/Call, Breadth',
    formula: '(VIX_inv * 0.4) + (PC_ratio * 0.3) + (Breadth * 0.3)',
    status: 'testing',
  },
];

export function CustomIndicators() {
  const [showBuilder, setShowBuilder] = useState(false);

  return (
    <Card className="p-8 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-white/10">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              🔧 CUSTOM INDICATORS
            </h2>
            <p className="text-sm text-gray-400">Build your own technical indicators and signals</p>
          </div>
          <Button
            onClick={() => setShowBuilder(!showBuilder)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New
          </Button>
        </div>
      </div>

      {showBuilder && (
        <Card className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20 mb-6 animate-in slide-in-from-top">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Code className="w-5 h-5" />
            INDICATOR BUILDER
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Indicator Name</label>
              <input
                type="text"
                placeholder="My Custom Signal"
                className="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-2 text-white"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Description</label>
              <input
                type="text"
                placeholder="What does this indicator measure?"
                className="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-2 text-white"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Formula</label>
              <textarea
                placeholder="e.g., (RSI-50) * (Volume/AvgVol)"
                className="w-full bg-gray-900 border border-white/10 rounded-lg px-4 py-2 text-white h-24"
              />
            </div>

            <Card className="p-4 bg-purple-500/10 border-purple-500/20">
              <h4 className="text-white font-semibold mb-3 text-sm">AVAILABLE VARIABLES:</h4>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <Badge variant="secondary">RSI</Badge>
                <Badge variant="secondary">MACD</Badge>
                <Badge variant="secondary">Volume</Badge>
                <Badge variant="secondary">AvgVol</Badge>
                <Badge variant="secondary">Price</Badge>
                <Badge variant="secondary">MA50</Badge>
                <Badge variant="secondary">MA200</Badge>
                <Badge variant="secondary">VIX</Badge>
                <Badge variant="secondary">Put/Call</Badge>
                <Badge variant="secondary">Breadth</Badge>
                <Badge variant="secondary">+50 more</Badge>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button className="flex-1 bg-green-500/20 border border-green-500/30 text-green-300">
                Test Indicator
              </Button>
              <Button className="flex-1 bg-blue-500/20 border border-blue-500/30 text-blue-300">
                Save & Activate
              </Button>
              <Button
                variant="outline"
                className="border-white/10"
                onClick={() => setShowBuilder(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6 bg-gray-900/50 border-white/10 mb-6">
        <h3 className="text-white font-semibold mb-4">YOUR INDICATORS</h3>
        <div className="space-y-3">
          {userIndicators.map((indicator) => (
            <Card
              key={indicator.id}
              className={`p-5 ${
                indicator.status === 'active'
                  ? 'bg-green-500/10 border-green-500/20'
                  : 'bg-yellow-500/10 border-yellow-500/20'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-white font-semibold">{indicator.name}</h4>
                    <Badge
                      className={
                        indicator.status === 'active'
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-yellow-500/20 text-yellow-300'
                      }
                    >
                      {indicator.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{indicator.description}</p>
                  <Card className="p-3 bg-black/20 border-white/10">
                    <div className="text-xs text-gray-500 mb-1">FORMULA:</div>
                    <code className="text-sm text-blue-300 font-mono">{indicator.formula}</code>
                  </Card>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/10 text-xs"
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/10 text-xs"
                >
                  Backtest
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/10 text-xs"
                >
                  View Chart
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="p-6 bg-blue-500/10 border-blue-500/20">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-6 h-6 text-blue-400 flex-shrink-0" />
            <div>
              <h4 className="text-white font-semibold mb-3">WHAT YOU CAN BUILD:</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2" />
                  <span>Composite momentum indicators</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2" />
                  <span>Custom sentiment scores</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2" />
                  <span>Multi-factor signals</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2" />
                  <span>Personalized alerts</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-purple-500/10 border-purple-500/20">
          <div className="flex items-start gap-3">
            <Code className="w-6 h-6 text-purple-400 flex-shrink-0" />
            <div>
              <h4 className="text-white font-semibold mb-3">ADVANCED FEATURES:</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2" />
                  <span>Backtest against historical data</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2" />
                  <span>Optimize parameters automatically</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2" />
                  <span>Share with community (optional)</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2" />
                  <span>Real-time calculation & alerts</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
        <h4 className="text-white font-semibold mb-4">EXAMPLE TEMPLATES:</h4>
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="outline"
            className="justify-start border-white/10 hover:bg-blue-500/20 text-sm"
          >
            Momentum Composite
          </Button>
          <Button
            variant="outline"
            className="justify-start border-white/10 hover:bg-purple-500/20 text-sm"
          >
            Volatility Adjusted
          </Button>
          <Button
            variant="outline"
            className="justify-start border-white/10 hover:bg-green-500/20 text-sm"
          >
            Mean Reversion
          </Button>
        </div>
      </Card>

      <div className="mt-6 text-center p-4 rounded-lg bg-gray-900/30 border border-white/5">
        <p className="text-xs text-gray-500">
          💡 Unlocked at Level 30 - Build indicators that match YOUR trading style
        </p>
      </div>
    </Card>
  );
}
