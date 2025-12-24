import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp } from 'lucide-react';

interface Trait {
  name: string;
  min: string;
  max: string;
  value: number;
  description: string;
}

const traits: Trait[] = [
  {
    name: 'Analytical',
    min: 'Analytical',
    max: 'Intuitive',
    value: 75,
    description: "You're here - data-driven approach",
  },
  {
    name: 'Patient',
    min: 'Patient',
    max: 'Impulsive',
    value: 65,
    description: 'You wait for setups',
  },
  {
    name: 'Risk Level',
    min: 'Risk-averse',
    max: 'Risk-seeking',
    value: 55,
    description: 'Moderate risk appetite',
  },
  {
    name: 'Learning Style',
    min: 'Learner',
    max: 'Doer',
    value: 70,
    description: 'You learn before acting',
  },
];

export function TraderPersonality() {
  return (
    <Card className="p-8 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-white/10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          🎭 YOUR TRADER PERSONALITY
        </h2>
        <p className="text-sm text-gray-400">Evolving daily based on your behavior</p>
      </div>

      <Card className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-4xl">
            🦊
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">THE FOX</h3>
            <p className="text-gray-400">Curious, methodical, patient</p>
            <Badge className="mt-2 bg-purple-500/20 text-purple-300 border-purple-400/30">
              Your Current Archetype
            </Badge>
          </div>
        </div>

        <div className="space-y-4">
          {traits.map((trait) => (
            <div key={trait.name}>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-400">{trait.min}</span>
                <span className="text-purple-300 font-semibold">{trait.description}</span>
                <span className="text-gray-400">{trait.max}</span>
              </div>
              <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  style={{ width: `${trait.value}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-purple-500"
                  style={{ left: `calc(${trait.value}% - 8px)` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-gray-900/50 border-white/10 mb-6">
        <h4 className="text-white font-semibold mb-4">BASED ON:</h4>
        <div className="grid grid-cols-3 gap-4 text-sm text-gray-300">
          <div>
            <div className="text-2xl font-bold text-blue-400 mb-1">34</div>
            <div className="text-xs text-gray-400">Days active</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400 mb-1">156</div>
            <div className="text-xs text-gray-400">Interactions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400 mb-1">89</div>
            <div className="text-xs text-gray-400">Predictions</div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-green-500/10 border-green-500/20">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-6 h-6 text-green-400 flex-shrink-0" />
          <div>
            <h4 className="text-white font-semibold mb-2">EVOLUTION:</h4>
            <p className="text-sm text-gray-300">
              Last month you were <strong className="text-blue-300">"The Student" 📚</strong>. You
              evolved to <strong className="text-purple-300">"The Fox" 🦊</strong> as you started
              making more strategic predictions.
            </p>
          </div>
        </div>
      </Card>

      <div className="mt-6 grid grid-cols-6 gap-2">
        {['🦁', '🦊', '🦉', '🐆', '🐢', '🐺'].map((animal, i) => (
          <Card
            key={i}
            className={`p-3 text-center ${
              i === 1
                ? 'bg-purple-500/20 border-purple-400/30'
                : 'bg-gray-900/30 border-white/5 opacity-50'
            }`}
          >
            <div className="text-2xl">{animal}</div>
          </Card>
        ))}
      </div>
    </Card>
  );
}
