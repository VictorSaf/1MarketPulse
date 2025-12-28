import { useState } from 'react';

import { Music, Volume2, VolumeX } from 'lucide-react';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';


interface Instrument {
  name: string;
  icon: string;
  asset: string;
  performance: number;
  volume: 'Forte' | 'Mezzo' | 'Piano' | 'Fortissimo' | 'Rest';
  status: 'in-tune' | 'off-beat' | 'solo' | 'resting';
}

const instruments: Instrument[] = [
  {
    name: 'Violins',
    icon: '🎻',
    asset: 'EQUITIES',
    performance: 1.2,
    volume: 'Forte',
    status: 'in-tune',
  },
  {
    name: 'Trumpets',
    icon: '🎺',
    asset: 'BONDS',
    performance: -0.1,
    volume: 'Piano',
    status: 'off-beat',
  },
  {
    name: 'Drums',
    icon: '🥁',
    asset: 'COMMODITIES',
    performance: 0.5,
    volume: 'Mezzo',
    status: 'in-tune',
  },
  {
    name: 'Guitar',
    icon: '🎸',
    asset: 'CRYPTO',
    performance: 3.2,
    volume: 'Fortissimo',
    status: 'solo',
  },
  {
    name: 'Piano',
    icon: '🎹',
    asset: 'FOREX',
    performance: 0.0,
    volume: 'Piano',
    status: 'resting',
  },
];

export function MarketOrchestra() {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const harmony = 78; // Percentage of instruments in sync

  return (
    <Card className="p-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-white/10">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                🎼 MARKET ORCHESTRA
              </h2>
              <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30 text-xs">
                SIMULATED DATA
              </Badge>
            </div>
            <p className="text-sm text-gray-400">Each asset class is an instrument in the symphony</p>
          </div>
          <Button
            className="border-white/10"
            size="sm"
            variant="outline"
            onClick={() => setAudioEnabled(!audioEnabled)}
          >
            {audioEnabled ? (
              <Volume2 className="w-4 h-4 mr-2" />
            ) : (
              <VolumeX className="w-4 h-4 mr-2" />
            )}
            {audioEnabled ? 'Audio ON' : 'Audio OFF'}
          </Button>
        </div>
      </div>

      <Card className="p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20 mb-6">
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">🎭</div>
          <div className="text-white font-semibold">CONDUCTOR: The Fed</div>
          <div className="text-sm text-gray-400 mt-2">Now playing: Allegro (Risk-On)</div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-4">
          <Music className="w-5 h-5 text-purple-400" />
          <div className="text-white font-semibold">HARMONY: {harmony}%</div>
        </div>

        <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
            style={{ width: `${harmony}%` }}
          />
        </div>
        <div className="text-xs text-gray-400 text-center mt-2">
          {harmony > 70 ? 'Instruments in sync ✓' : 'Discord detected ⚠️'}
        </div>
      </Card>

      <div className="grid grid-cols-5 gap-3 mb-6">
        {instruments.map((instrument) => (
          <Card
            key={instrument.name}
            className={`p-4 text-center ${
              instrument.status === 'solo'
                ? 'bg-gradient-to-b from-yellow-500/20 to-orange-500/20 border-yellow-500/30'
                : instrument.status === 'in-tune'
                ? 'bg-green-500/10 border-green-500/20'
                : instrument.status === 'off-beat'
                ? 'bg-red-500/10 border-red-500/20'
                : 'bg-gray-900/30 border-white/10'
            }`}
          >
            <div className="text-3xl mb-2">{instrument.icon}</div>
            <div className="text-xs text-gray-400 mb-1">{instrument.name}</div>
            <div className="text-sm font-bold text-white mb-1">{instrument.asset}</div>
            <Badge
              className={`text-xs ${
                instrument.performance > 0
                  ? 'bg-green-500/20 text-green-300'
                  : instrument.performance < 0
                  ? 'bg-red-500/20 text-red-300'
                  : 'bg-gray-500/20 text-gray-300'
              }`}
              variant="secondary"
            >
              {instrument.performance > 0 ? '+' : ''}
              {instrument.performance}%
            </Badge>
            <div className="text-xs text-gray-400 mt-2">
              {instrument.volume === 'Fortissimo' && '♪♪♪♪♪♪'}
              {instrument.volume === 'Forte' && '♪♪♪♪♪'}
              {instrument.volume === 'Mezzo' && '♪♪♪'}
              {instrument.volume === 'Piano' && '♪♪'}
              {instrument.volume === 'Rest' && '♪'}
            </div>
            <div className="text-xs mt-1">
              {instrument.status === 'solo' && '🎵 SOLO!'}
              {instrument.status === 'in-tune' && '✓ In tune'}
              {instrument.status === 'off-beat' && '⚠️ Off-beat'}
              {instrument.status === 'resting' && '💤 Resting'}
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-blue-500/10 border-blue-500/20 mb-4">
        <h4 className="text-white font-semibold mb-3">🎵 CURRENT MOVEMENT:</h4>
        <p className="text-gray-300 text-sm mb-3">
          <strong className="text-blue-300">"Risk-On Rhapsody"</strong>
        </p>
        <p className="text-sm text-gray-400">
          The orchestra is playing a bullish piece. Equities carry the melody, crypto is doing an
          impressive solo, while bonds rest quietly. The only discord: bonds aren't joining the
          celebration.
        </p>
      </Card>

      <Card className="p-6 bg-yellow-500/10 border-yellow-500/20 mb-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">⚠️</div>
          <div>
            <h4 className="text-white font-semibold mb-2">DISSONANCE ALERT:</h4>
            <p className="text-sm text-gray-300">
              Bonds and equities usually move opposite. Both are flat-ish. This silence often
              precedes a dramatic movement.
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-purple-500/10 border-purple-500/20">
        <h4 className="text-white font-semibold mb-4">AUDIO MODE (Optional):</h4>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
          <div>
            <div className="text-purple-300 font-semibold mb-2">Rising Markets:</div>
            <div className="space-y-1 text-xs">
              <div>• Violins in crescendo</div>
              <div>• Major key ambient</div>
              <div>• Uplifting tempo</div>
            </div>
          </div>
          <div>
            <div className="text-red-300 font-semibold mb-2">Falling Markets:</div>
            <div className="space-y-1 text-xs">
              <div>• Violins in descrescendo</div>
              <div>• Minor key ambient</div>
              <div>• Slower tempo</div>
            </div>
          </div>
        </div>
      </Card>

      {audioEnabled && (
        <div className="mt-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
          <Music className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <p className="text-sm text-green-300">Audio mode enabled - Listen to the market symphony</p>
        </div>
      )}
    </Card>
  );
}
