import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Navigation, TrendingUp, TrendingDown, Clock, Zap } from 'lucide-react';

interface CompassInput {
  label: string;
  value: number;
  direction: 'north' | 'south' | 'east' | 'west';
  description: string;
}

const compassInputs: CompassInput[] = [
  {
    label: 'VIX low, sentiment bullish',
    value: 2.3,
    direction: 'north',
    description: 'Market conditions favor risk-taking',
  },
  {
    label: 'Bonds warning, overbought',
    value: 0.8,
    direction: 'south',
    description: 'Some caution signals present',
  },
  {
    label: 'FOMC pending, wait might be wise',
    value: 1.5,
    direction: 'east',
    description: 'Event risk suggests patience',
  },
  {
    label: 'Pattern breakout imminent, act before',
    value: 2.1,
    direction: 'west',
    description: 'Opportunity window closing soon',
  },
];

export function RiskCompass() {
  const [showDetails, setShowDetails] = useState(false);

  // Calculate net vector (simplified for demo)
  const northPull = compassInputs.find((i) => i.direction === 'north')?.value || 0;
  const southPull = compassInputs.find((i) => i.direction === 'south')?.value || 0;
  const eastPull = compassInputs.find((i) => i.direction === 'east')?.value || 0;
  const westPull = compassInputs.find((i) => i.direction === 'west')?.value || 0;

  // Calculate angle (simplified)
  const verticalNet = northPull - southPull;
  const horizontalNet = westPull - eastPull;
  const angle = Math.atan2(horizontalNet, verticalNet) * (180 / Math.PI);
  const magnitude = Math.sqrt(verticalNet ** 2 + horizontalNet ** 2);

  // Determine position description
  const getPositionDescription = () => {
    if (angle >= -22.5 && angle < 22.5) return 'N (Aggressive)';
    if (angle >= 22.5 && angle < 67.5) return 'NW (Aggressive, Act Soon)';
    if (angle >= 67.5 && angle < 112.5) return 'W (Act Now)';
    if (angle >= 112.5 && angle < 157.5) return 'SW (Act with Caution)';
    if (angle >= 157.5 || angle < -157.5) return 'S (Defensive)';
    if (angle >= -157.5 && angle < -112.5) return 'SE (Wait Defensively)';
    if (angle >= -112.5 && angle < -67.5) return 'E (Wait)';
    if (angle >= -67.5 && angle < -22.5) return 'NE (Wait, Then Aggressive)';
    return 'Center';
  };

  const position = getPositionDescription();
  const needleRotation = angle;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-white/10 backdrop-blur-sm">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            🧭 YOUR RISK COMPASS
          </h2>
          <p className="text-sm text-gray-400">Navigate your capital with confidence</p>
        </div>

        {/* Compass */}
        <div className="flex justify-center mb-8">
          <div className="relative w-80 h-80">
            {/* Compass Circle */}
            <div className="absolute inset-0 rounded-full bg-gray-900/50 border-2 border-white/20 backdrop-blur-sm">
              {/* Cardinal Directions */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center">
                <div className="text-lg font-bold text-red-400">🔺</div>
                <div className="text-xs text-red-400 font-semibold">N</div>
                <div className="text-xs text-gray-400 mt-1">Aggressive</div>
                <div className="text-xs text-gray-500">RISK MORE</div>
              </div>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
                <div className="text-xs text-gray-500 mb-1">REDUCE RISK</div>
                <div className="text-xs text-gray-400 mb-1">Defensive</div>
                <div className="text-xs text-green-400 font-semibold">S</div>
                <div className="text-lg font-bold text-green-400">🔺</div>
              </div>

              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-center">
                <div className="text-lg font-bold text-yellow-400">🔺</div>
                <div className="text-xs text-yellow-400 font-semibold">W</div>
                <div className="text-xs text-gray-400 mt-1">Act Now</div>
              </div>

              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-center">
                <div className="text-xs text-gray-400 mb-1">Wait</div>
                <div className="text-xs text-blue-400 font-semibold">E</div>
                <div className="text-lg font-bold text-blue-400">🔺</div>
              </div>

              {/* Center Circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-2 border-purple-400/30 flex items-center justify-center">
                <Navigation className="w-12 h-12 text-purple-400" />
              </div>

              {/* Compass Needle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-32 origin-center transition-transform duration-500"
                   style={{ transform: `translate(-50%, -50%) rotate(${needleRotation}deg)` }}>
                <div className="relative w-full h-full">
                  <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-red-500 to-red-400 rounded-t-full" />
                  <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-500 to-blue-400 rounded-b-full" />
                </div>
              </div>

              {/* Quadrant Lines */}
              <div className="absolute inset-0">
                <div className="absolute top-0 left-1/2 w-px h-full bg-white/10" />
                <div className="absolute top-1/2 left-0 w-full h-px bg-white/10" />
              </div>
            </div>
          </div>
        </div>

        {/* Current Position */}
        <div className="text-center mb-6">
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30 text-lg px-4 py-2">
            📍 YOUR POSITION: {position}
          </Badge>
          <div className="mt-4 text-sm text-gray-300">
            Strength: <span className="text-purple-400 font-bold">{magnitude.toFixed(1)}/5</span>
          </div>
        </div>

        {/* Translation */}
        <div className="p-6 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 mb-6">
          <h3 className="text-sm font-semibold text-purple-300 mb-2">TRANSLATION:</h3>
          <p className="text-sm text-gray-300">
            "Lean aggressive but act soon. Conditions favor risk-taking, but the window may
            close. If you're going to add positions, do it in the next few hours, not days."
          </p>
        </div>

        {/* Compass Inputs */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-4">COMPASS INPUTS:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {compassInputs.map((input, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-gray-900/50 border border-white/5"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {input.direction === 'north' && <TrendingUp className="w-4 h-4 text-red-400" />}
                    {input.direction === 'south' && <TrendingDown className="w-4 h-4 text-green-400" />}
                    {input.direction === 'east' && <Clock className="w-4 h-4 text-blue-400" />}
                    {input.direction === 'west' && <Zap className="w-4 h-4 text-yellow-400" />}
                    <span className="text-xs text-gray-400 uppercase font-semibold">
                      {input.direction} pull
                    </span>
                  </div>
                  <span className="text-sm font-bold text-purple-400">+{input.value}</span>
                </div>
                <div className="text-sm text-gray-300 mb-1">{input.label}</div>
                <div className="text-xs text-gray-500">{input.description}</div>
              </div>
            ))}
          </div>

          {/* Net Vector */}
          <div className="p-6 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-2">NET VECTOR</div>
              <div className="text-2xl font-bold text-white mb-2">
                {position} at {Math.abs(angle).toFixed(0)}°
              </div>
              <div className="text-sm text-gray-300">
                {magnitude > 2
                  ? 'Moderately aggressive, act soon'
                  : magnitude > 1
                  ? 'Balanced approach'
                  : 'Cautious stance recommended'}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <Button
            className="flex-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30"
            onClick={() => setShowDetails(!showDetails)}
          >
            <Navigation className="w-4 h-4 mr-2" />
            {showDetails ? 'Hide Details' : 'View Detailed Analysis'}
          </Button>
          <Button className="flex-1 bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30">
            📊 Historical Compass Accuracy
          </Button>
        </div>

        {/* Detailed Analysis */}
        {showDetails && (
          <div className="mt-6 p-6 rounded-lg bg-gray-900/50 border border-white/10 space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Detailed Analysis</h3>
            
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="text-sm font-semibold text-red-300 mb-2">Why Aggressive (N)?</div>
                <p className="text-xs text-gray-300">
                  VIX at multi-month lows and sentiment extremely bullish create ideal
                  conditions for taking larger positions. Historical data shows 76% success
                  rate in similar setups.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div className="text-sm font-semibold text-yellow-300 mb-2">
                  Why Act Now (W)?
                </div>
                <p className="text-xs text-gray-300">
                  Pattern breakout forming on NVDA with volume confirmation. Last 5 times
                  this setup appeared, waiting cost an average of 3.2% in missed gains.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="text-sm font-semibold text-blue-300 mb-2">
                  Why Some Wait (E)?
                </div>
                <p className="text-xs text-gray-300">
                  FOMC minutes at 14:00 could create 1-2% swing. If you can't handle
                  volatility, waiting until after event is prudent.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="text-sm font-semibold text-green-300 mb-2">
                  Caution Factors (S)?
                </div>
                <p className="text-xs text-gray-300">
                  Market has been up 8 consecutive days (slightly extended). Bond yields
                  showing divergence. Not major concerns, but worth monitoring.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <div className="text-sm font-semibold text-purple-300 mb-2">
                💡 Recommended Action
              </div>
              <p className="text-xs text-gray-300 mb-3">
                Based on all inputs, the compass suggests:
              </p>
              <ul className="space-y-1 text-xs text-gray-300">
                <li>• Enter positions in the next 2-4 hours</li>
                <li>• Size appropriately (70-80% of normal)</li>
                <li>• Set stops 2-3% below entry</li>
                <li>• Be prepared to reduce if FOMC surprise</li>
                <li>• Review position after 14:00 event</li>
              </ul>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
