import { CheckCircle, Clock, SkipForward } from 'lucide-react';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';


interface RitualStep {
  number: number;
  title: string;
  description: string;
  duration: string;
  completed?: boolean;
}

const todaysRitual: RitualStep[] = [
  {
    number: 1,
    title: 'PULSE CHECK',
    description: 'Market summary tailored to your watchlist',
    duration: '~2 min',
    completed: false,
  },
  {
    number: 2,
    title: "TODAY'S LESSON",
    description: '"Why volume matters in breakouts" (continues from yesterday)',
    duration: '~3 min',
    completed: false,
  },
  {
    number: 3,
    title: 'QUICK CHALLENGE',
    description: 'Pattern recognition: 5 charts, 30 seconds each',
    duration: '~2 min',
    completed: false,
  },
  {
    number: 4,
    title: 'ONE ACTION',
    description: 'NVDA breakout setup - set alert or make prediction?',
    duration: '~1 min',
    completed: false,
  },
];

export function DailyRitualBuilder() {
  return (
    <Card className="p-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-white/10">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              ⏰ YOUR DAILY RITUAL
            </h2>
            <p className="text-sm text-gray-400 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Estimated: 8 minutes
            </p>
          </div>
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">Personalized</Badge>
        </div>
      </div>

      <Card className="p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20 mb-6">
        <p className="text-sm text-gray-300 text-center">
          ☀️ <strong className="text-white">Good morning!</strong> Here's what I prepared for you
          today.
        </p>
      </Card>

      <div className="space-y-3 mb-6">
        {todaysRitual.map((step) => (
          <Card
            key={step.number}
            className={`p-5 border ${
              step.completed
                ? 'bg-green-500/10 border-green-500/20'
                : 'bg-gray-900/30 border-white/10'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step.completed
                    ? 'bg-green-500/20 border-2 border-green-400/30 text-green-400'
                    : 'bg-blue-500/20 border-2 border-blue-400/30 text-blue-400'
                }`}
              >
                {step.completed ? <CheckCircle className="w-6 h-6" /> : step.number}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-white font-semibold">{step.title}</h3>
                  <Badge className="text-xs" variant="secondary">
                    {step.duration}
                  </Badge>
                </div>
                <p className="text-sm text-gray-400 mb-3">{step.description}</p>

                {!step.completed && (
                  <div className="flex gap-2">
                    <Button
                      className="bg-blue-500/20 border border-blue-500/30 text-blue-300"
                      size="sm"
                    >
                      ▶️ Start
                    </Button>
                    <Button
                      className="border-white/10 text-gray-400"
                      size="sm"
                      variant="outline"
                    >
                      <SkipForward className="w-4 h-4 mr-1" />
                      Skip
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <Button
          className="border-white/10 text-gray-400 hover:bg-gray-900/50"
          variant="outline"
        >
          ⏱️ 3-min version
        </Button>
        <Button
          className="border-white/10 text-gray-400 hover:bg-gray-900/50"
          variant="outline"
        >
          📊 Just Pulse
        </Button>
        <Button
          className="border-white/10 text-gray-400 hover:bg-gray-900/50"
          variant="outline"
        >
          ⏰ 15-min deep
        </Button>
      </div>

      <Card className="p-6 bg-purple-500/10 border-purple-500/20">
        <h4 className="text-white font-semibold mb-4">HOW YOUR RITUAL ADAPTS:</h4>
        <div className="space-y-3 text-sm text-gray-300">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-purple-300 font-semibold mb-1">Based on Time:</div>
              <div className="text-xs space-y-1">
                <div>• 6-8 AM: Full ritual</div>
                <div>• 12-2 PM: Quick check</div>
                <div>• Evening: Recap + learning</div>
              </div>
            </div>
            <div>
              <div className="text-blue-300 font-semibold mb-1">Based on Behavior:</div>
              <div className="text-xs space-y-1">
                <div>• Skip lessons? Shorter ones</div>
                <div>• Love charts? More visuals</div>
                <div>• Ignore challenges? Optional</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          Your ritual evolves as we learn what works best for you
        </p>
      </div>
    </Card>
  );
}
