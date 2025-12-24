import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Calculator, TrendingUp, Shield, AlertTriangle } from 'lucide-react';
import { Badge } from './ui/badge';

export function PositionBuilder() {
  const [symbol, setSymbol] = useState('NVDA');
  const [price, setPrice] = useState(481.50);
  const [confidence, setConfidence] = useState([70]);
  const [risk, setRisk] = useState(2);
  const [portfolio, setPortfolio] = useState(12456);

  const calculatePosition = () => {
    const riskAmount = (portfolio * risk) / 100;
    const stopLoss = price * 0.95; // 5% stop
    const shares = Math.floor(riskAmount / (price - stopLoss));
    const positionSize = shares * price;
    const takeProfit = price * 1.10; // 10% target
    const potentialProfit = shares * (takeProfit - price);
    const riskReward = potentialProfit / riskAmount;

    return {
      shares,
      positionSize,
      stopLoss,
      takeProfit,
      riskAmount,
      potentialProfit,
      riskReward
    };
  };

  const position = calculatePosition();

  return (
    <Card className="glass-card border-blue-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-400" />
          Position Builder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Inputs */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Symbol</Label>
            <Input
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="bg-gray-800/50 border-white/10"
            />
          </div>
          <div className="space-y-2">
            <Label>Current Price</Label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              className="bg-gray-800/50 border-white/10"
            />
          </div>
        </div>

        {/* Confidence */}
        <div className="space-y-2">
          <Label className="flex items-center justify-between">
            <span>Confidence Level</span>
            <Badge variant="secondary">{confidence[0]}%</Badge>
          </Label>
          <Slider
            value={confidence}
            onValueChange={setConfidence}
            max={100}
            step={5}
            className="w-full"
          />
        </div>

        {/* Risk */}
        <div className="space-y-2">
          <Label>Max Risk per Trade</Label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={risk === 1 ? 'default' : 'outline'}
              onClick={() => setRisk(1)}
              className="w-full"
            >
              1% (Safe)
            </Button>
            <Button
              variant={risk === 2 ? 'default' : 'outline'}
              onClick={() => setRisk(2)}
              className="w-full"
            >
              2% (Normal)
            </Button>
            <Button
              variant={risk === 5 ? 'default' : 'outline'}
              onClick={() => setRisk(5)}
              className="w-full"
            >
              5% (Aggressive)
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 space-y-3">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Calculated Position
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Position Size:</span>
                <span className="font-bold text-white">{position.shares} shares</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Cost:</span>
                <span className="font-bold text-white">${position.positionSize.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Stop Loss:</span>
                <span className="font-bold text-red-400">${position.stopLoss.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Take Profit:</span>
                <span className="font-bold text-green-400">${position.takeProfit.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Risk:</span>
                <span className="font-bold text-yellow-400">${position.riskAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Reward:</span>
                <span className="font-bold text-green-400">${position.potentialProfit.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <span className="text-sm text-gray-400 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Risk/Reward Ratio:
            </span>
            <Badge
              className={
                position.riskReward >= 2
                  ? 'bg-green-500/20 text-green-400'
                  : position.riskReward >= 1
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-red-500/20 text-red-400'
              }
            >
              1:{position.riskReward.toFixed(2)}
            </Badge>
          </div>

          {position.riskReward < 2 && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
              <p className="text-sm text-yellow-400">
                Risk/reward below 2:1. Consider adjusting your targets.
              </p>
            </div>
          )}
        </div>

        <Button className="w-full" size="lg">
          Add to Paper Portfolio
        </Button>
      </CardContent>
    </Card>
  );
}
