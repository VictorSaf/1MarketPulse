import { useState } from 'react';

import { Clock, Play, Pause, RotateCcw, FastForward } from 'lucide-react';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';


interface HistoricalEvent {
  time: string;
  event: string;
  impact: string;
  price: number;
}

const timeline: HistoricalEvent[] = [
  { time: '09:30', event: 'Market Open', impact: 'Initial buying pressure', price: 474.2 },
  { time: '10:30', event: 'CPI Data Release', impact: 'Better than expected → Rally', price: 476.8 },
  { time: '11:45', event: 'Volume Spike Detected', impact: 'Institutional buying', price: 478.5 },
  { time: '14:00', event: 'Profit Taking', impact: 'Brief pullback', price: 477.1 },
  { time: '15:00', event: 'Second Wave', impact: 'Buying into close', price: 481.5 },
  { time: '16:00', event: 'Market Close', impact: 'Strong finish +1.5%', price: 481.5 },
];

export function TimeMachine() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsPlaying(false);
  };

  const handleSpeedChange = () => {
    const speeds = [1, 2, 4, 8];
    const currentSpeedIndex = speeds.indexOf(speed);
    setSpeed(speeds[(currentSpeedIndex + 1) % speeds.length]);
  };

  return (
    <Card className="p-8 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-white/10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          ⏰ TIME MACHINE
        </h2>
        <p className="text-sm text-gray-400">Replay historical market days to learn from the past</p>
      </div>

      <Card className="p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-6 h-6 text-purple-400" />
          <div>
            <h3 className="text-white font-semibold">Currently Viewing</h3>
            <p className="text-sm text-gray-400">November 15, 2024 - NVDA Pattern Day</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs text-gray-400 mb-1">Open</div>
            <div className="text-lg font-bold text-white">$474.20</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">High</div>
            <div className="text-lg font-bold text-green-400">$481.80</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Close</div>
            <div className="text-lg font-bold text-green-400">$481.50</div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gray-900/50 border-white/10 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Timeline Playback</h3>
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">
            {isPlaying ? 'PLAYING' : 'PAUSED'}
          </Badge>
        </div>

        <div className="mb-6">
          <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / timeline.length) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>09:30</span>
            <span className="text-blue-400">{timeline[currentIndex]?.time}</span>
            <span>16:00</span>
          </div>
        </div>

        <div className="space-y-3 max-h-[300px] overflow-y-auto mb-6">
          {timeline.map((event, index) => (
            <Card
              key={index}
              className={`p-4 transition-all ${
                index === currentIndex
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30'
                  : index < currentIndex
                  ? 'bg-gray-900/30 border-white/10 opacity-50'
                  : 'bg-gray-900/30 border-white/10 opacity-30'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="text-center">
                  <div className="text-xs text-gray-400 mb-1">TIME</div>
                  <Badge className="text-xs" variant="secondary">
                    {event.time}
                  </Badge>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-semibold">{event.event}</h4>
                    <div className="text-lg font-bold text-white">${event.price}</div>
                  </div>
                  <p className="text-sm text-gray-400">{event.impact}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button
            className="border-white/10"
            disabled={currentIndex === 0 && !isPlaying}
            variant="outline"
            onClick={handleReset}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>

          <Button
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8"
            onClick={handlePlayPause}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Play
              </>
            )}
          </Button>

          <Button className="border-white/10" variant="outline" onClick={handleSpeedChange}>
            <FastForward className="w-4 h-4 mr-2" />
            {speed}x
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="p-6 bg-blue-500/10 border-blue-500/20">
          <h4 className="text-white font-semibold mb-4">WHY USE TIME MACHINE:</h4>
          <div className="space-y-2 text-sm text-gray-300">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2" />
              <span>Study how patterns played out in real-time</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2" />
              <span>Learn from historical market reactions</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2" />
              <span>Test your decision-making without risk</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2" />
              <span>Understand cause & effect relationships</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-purple-500/10 border-purple-500/20">
          <h4 className="text-white font-semibold mb-4">FEATURED DAYS:</h4>
          <div className="space-y-2">
            <Button
              className="w-full justify-start border-white/10 text-sm hover:bg-blue-500/20"
              variant="outline"
            >
              📈 Nov 15, 2024 - NVDA Breakout
            </Button>
            <Button
              className="w-full justify-start border-white/10 text-sm hover:bg-red-500/20"
              variant="outline"
            >
              📉 Oct 28, 2024 - Flash Crash
            </Button>
            <Button
              className="w-full justify-start border-white/10 text-sm hover:bg-green-500/20"
              variant="outline"
            >
              🏛️ Sep 18, 2024 - Fed Pivot Day
            </Button>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
        <h4 className="text-white font-semibold mb-3">💡 LEARNING MODE:</h4>
        <p className="text-sm text-gray-300 mb-4">
          Pause at key moments and ask yourself: "What would I do here?" Compare your decisions with
          what actually happened. This is how you develop market intuition.
        </p>
        <div className="flex gap-3">
          <Button
            className="bg-blue-500/20 border border-blue-500/30 text-blue-300"
            size="sm"
          >
            Quiz Me on This Day
          </Button>
          <Button
            className="bg-purple-500/20 border border-purple-500/30 text-purple-300"
            size="sm"
          >
            Add to My Learning
          </Button>
        </div>
      </Card>

      <div className="mt-6 text-center p-4 rounded-lg bg-gray-900/30 border border-white/5">
        <p className="text-xs text-gray-500">
          🎓 Access 100+ historical market days - learn from success and failure
        </p>
      </div>
    </Card>
  );
}
