import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { Clock, CheckCircle, XCircle } from 'lucide-react';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';


interface Simulation {
  id: string;
  name: string;
  category: 'panic' | 'fomo' | 'ambiguous' | 'technical';
  scenario: string;
  situation: {
    time: string;
    position: string;
    event: string;
    data: { label: string; value: string }[];
  };
  options: { id: string; label: string; action: string }[];
  correctAnswer: string;
  outcome: {
    what: string;
    why: string;
    lesson: string;
  };
}

const simulations: Simulation[] = [
  {
    id: 'flash-crash',
    name: 'The Flash Crash',
    category: 'panic',
    scenario: 'Sudden market drop',
    situation: {
      time: '14:32',
      position: 'Long SPY',
      event: 'SPY drops 2% in 3 minutes',
      data: [
        { label: 'SPY', value: '$478 → $468 (-2.1%)' },
        { label: 'VIX', value: '14 → 22 (+57%)' },
        { label: 'News', value: 'Breaking: Fed official comment' },
      ],
    },
    options: [
      { id: 'sell', label: 'SELL', action: 'Cut loss immediately' },
      { id: 'wait', label: 'WAIT', action: 'See more data' },
      { id: 'buy', label: 'BUY', action: 'Buy the dip' },
    ],
    correctAnswer: 'wait',
    outcome: {
      what: 'Drop continued to -3% then recovered fully by close',
      why: 'Flash crashes are often temporary. Panic selling locks in losses.',
      lesson: 'Patience pays. Wait for confirmation before acting on emotion.',
    },
  },
];

export function MicroSimulations() {
  const [started, setStarted] = useState(false);
  const [timeLeft] = useState(10);
  const [answered, setAnswered] = useState(false);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const currentSim = simulations[0];

  const handleAnswer = (answerId: string) => {
    setUserAnswer(answerId);
    setAnswered(true);
  };

  const handleComingSoonClick = (feature: string) => {
    toast.info(`${feature} coming soon!`, {
      description: 'This educational feature is under development.',
    });
  };

  if (isLoading) {
    return (
      <div className="animate-pulse bg-gray-800/50 rounded-xl h-96" />
    );
  }

  return (
    <Card className="p-8 bg-gradient-to-br from-red-500/10 to-orange-500/10 border-white/10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            🎮 MICRO-SIMULATIONS
          </h2>
          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30">
            EDUCATIONAL DEMO
          </Badge>
        </div>
        <p className="text-sm text-gray-400">60-second decision scenarios - educational examples based on historical events</p>
      </div>

      {!started ? (
        <div className="text-center space-y-6">
          <div className="p-8 rounded-lg bg-gray-900/50 border border-white/10">
            <div className="text-6xl mb-4">{currentSim.scenario === 'Sudden market drop' ? '📉' : '📈'}</div>
            <h3 className="text-2xl font-bold text-white mb-3">{currentSim.name}</h3>
            <p className="text-gray-300 mb-4">{currentSim.scenario}</p>
            <Badge className="bg-red-500/20 text-red-300 border-red-400/30">
              {currentSim.category.toUpperCase()} SCENARIO
            </Badge>
          </div>
          <Button
            className="w-full bg-orange-500/20 border border-orange-400/30 text-orange-300 hover:bg-orange-500/30"
            onClick={() => setStarted(true)}
          >
            Start Simulation →
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {!answered && (
            <div className="flex items-center justify-center gap-2 text-yellow-400 font-semibold">
              <Clock className="w-5 h-5" />
              <span className="text-2xl">{timeLeft} seconds</span>
            </div>
          )}

          <Card className="p-6 bg-gray-900/50 border-white/10">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {currentSim.situation.data.map((item, index) => (
                  <div key={index} className="p-3 rounded-lg bg-gray-900/50">
                    <div className="text-xs text-gray-400 mb-1">{item.label}</div>
                    <div className="text-sm font-semibold text-white">{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="text-sm text-white mb-2">
                  <span className="font-semibold">Position:</span> {currentSim.situation.position}
                </div>
                <div className="text-sm text-red-300">
                  <span className="font-semibold">Event:</span> {currentSim.situation.event}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gray-900/50 border-white/10">
            <h4 className="text-white font-semibold mb-4">
              WHAT DO YOU DO? (You have {timeLeft} seconds)
            </h4>
            <div className="grid grid-cols-3 gap-4">
              {currentSim.options.map((option) => (
                <Button
                  key={option.id}
                  className={`h-auto py-6 flex flex-col items-center gap-2 ${
                    option.id === 'sell'
                      ? 'bg-red-500/20 border-red-400/30 text-red-300 hover:bg-red-500/30'
                      : option.id === 'wait'
                      ? 'bg-yellow-500/20 border-yellow-400/30 text-yellow-300 hover:bg-yellow-500/30'
                      : 'bg-green-500/20 border-green-400/30 text-green-300 hover:bg-green-500/30'
                  }`}
                  disabled={answered}
                  onClick={() => handleAnswer(option.id)}
                >
                  <span className="text-3xl">
                    {option.id === 'sell' ? '🔴' : option.id === 'wait' ? '🟡' : '🟢'}
                  </span>
                  <span className="text-lg font-bold">{option.label}</span>
                  <span className="text-xs opacity-70">{option.action}</span>
                </Button>
              ))}
            </div>
          </Card>

          {answered && (
            <Card className={`p-6 ${
              userAnswer === currentSim.correctAnswer
                ? 'bg-green-500/10 border-green-500/20'
                : 'bg-red-500/10 border-red-500/20'
            }`}>
              <div className="flex items-start gap-3">
                {userAnswer === currentSim.correctAnswer ? (
                  <CheckCircle className="w-8 h-8 text-green-400 flex-shrink-0" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-400 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <h4 className={`font-bold mb-3 ${
                    userAnswer === currentSim.correctAnswer ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {userAnswer === currentSim.correctAnswer ? 'CORRECT! ✓' : 'NOT OPTIMAL ✗'}
                  </h4>

                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-gray-400 mb-1">What happened in reality:</div>
                      <div className="text-white">{currentSim.outcome.what}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 mb-1">Why this matters:</div>
                      <div className="text-white">{currentSim.outcome.why}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <div className="text-blue-300 font-semibold mb-1">💡 LESSON:</div>
                      <div className="text-white">{currentSim.outcome.lesson}</div>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-4 bg-purple-500/20 border border-purple-500/30 text-purple-300 opacity-50 cursor-not-allowed"
                    disabled
                    title="Coming Soon"
                    onClick={() => handleComingSoonClick('Educational content')}
                  >
                    📚 Learn more about flash crashes
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </Card>
  );
}
