import { useState, useEffect } from 'react';

import { Sparkles } from 'lucide-react';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';


interface TarotCard {
  id: string;
  position: 'past' | 'present' | 'future';
  name: string;
  icon: string;
  meaning: string;
  description: string;
  revealed: boolean;
}

const dailyCards: TarotCard[] = [
  {
    id: '1',
    position: 'past',
    name: 'THE BALANCE',
    icon: '⚖️',
    meaning: 'Equilibrium',
    description: 'Markets found support level yesterday. Set the stage for today.',
    revealed: true,
  },
  {
    id: '2',
    position: 'present',
    name: 'THE ROCKET',
    icon: '🚀',
    meaning: 'Momentum',
    description: 'Strong upward energy today. The market springs forward with conviction.',
    revealed: true,
  },
  {
    id: '3',
    position: 'future',
    name: 'THE UNKNOWN',
    icon: '❓',
    meaning: 'Uncertainty',
    description: 'FOMC outcome unclear. Tomorrow remains hidden.',
    revealed: false,
  },
];

const bonusCard = {
  name: 'THE FOX',
  icon: '🦊',
  meaning: 'Cunning',
  description:
    "Be clever today. Look for opportunities others miss. Your NVDA pattern knowledge gives you an edge. Use it wisely.",
};

export function TradingTarot() {
  const [cards, setCards] = useState(dailyCards);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const revealCard = (id: string) => {
    setCards(cards.map((c) => (c.id === id ? { ...c, revealed: true } : c)));
  };

  const todayDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (isLoading) {
    return (
      <div className="animate-pulse bg-gray-800/50 rounded-xl h-96" />
    );
  }

  return (
    <Card className="p-8 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border-white/10">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            🃏 YOUR DAILY CARDS
          </h2>
          <Badge className="bg-pink-500/20 text-pink-300 border-pink-400/30 text-xs">
            FOR FUN ONLY
          </Badge>
        </div>
        <p className="text-sm text-gray-400">Guidance for today's market journey</p>
        <Badge className="mt-2 bg-purple-500/20 text-purple-300 border-purple-400/30">
          {todayDate}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {cards.map((card) => (
          <div key={card.id} className="text-center">
            <div className="text-sm text-gray-400 mb-3 uppercase tracking-wider">
              {card.position}
            </div>

            {card.revealed ? (
              <Card className="p-6 bg-gradient-to-b from-purple-500/20 to-blue-500/20 border-purple-500/30 min-h-[280px] flex flex-col">
                <div className="text-6xl mb-4">{card.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{card.name}</h3>
                <Badge className="mb-3 bg-purple-500/20 text-purple-300" variant="secondary">
                  {card.meaning}
                </Badge>
                <p className="text-sm text-gray-300 flex-1">{card.description}</p>
              </Card>
            ) : (
              <Card
                className="p-6 bg-gradient-to-b from-gray-800 to-gray-900 border-white/10 min-h-[280px] flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                onClick={() => revealCard(card.id)}
              >
                <div className="text-6xl mb-4 blur-sm">❓</div>
                <div className="text-white font-semibold mb-3">???</div>
                <Badge className="mb-4 bg-gray-700/50" variant="secondary">
                  {card.meaning}
                </Badge>
                <Button
                  className="bg-purple-500/20 border border-purple-500/30 text-purple-300"
                  size="sm"
                >
                  Reveal
                </Button>
              </Card>
            )}
          </div>
        ))}
      </div>

      <Card className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20 mb-6">
        <div className="flex items-start gap-3 mb-4">
          <Sparkles className="w-6 h-6 text-blue-400 flex-shrink-0" />
          <div>
            <h3 className="text-white font-semibold mb-2">📖 THE READING:</h3>
            <p className="text-sm text-gray-300">
              "Yesterday's Balance set the stage for today's Rocket. The market found its footing
              and now springs upward with conviction. But tomorrow's card remains hidden - the Fed
              meeting creates a veil of uncertainty. Enjoy today's momentum, but don't overextend.
              The Unknown card suggests reducing exposure before the close."
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-r from-orange-500/10 to-pink-500/10 border-orange-500/20 mb-6">
        <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
          🎴 BONUS CARD (Your personal draw):
        </h4>
        <div className="flex items-start gap-4">
          <div className="text-5xl">{bonusCard.icon}</div>
          <div className="flex-1">
            <h4 className="text-lg font-bold text-white mb-2">{bonusCard.name}</h4>
            <Badge className="mb-3 bg-orange-500/20 text-orange-300 border-orange-400/30">
              {bonusCard.meaning}
            </Badge>
            <p className="text-sm text-gray-300">{bonusCard.description}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gray-900/50 border-white/10">
        <h4 className="text-white font-semibold mb-4">TAROT DECK (Sample Cards):</h4>
        <div className="grid grid-cols-6 gap-3">
          {[
            { icon: '🚀', name: 'Rocket' },
            { icon: '⚖️', name: 'Balance' },
            { icon: '🌊', name: 'Wave' },
            { icon: '🦁', name: 'Lion' },
            { icon: '🐻', name: 'Bear' },
            { icon: '🌅', name: 'Dawn' },
            { icon: '🌑', name: 'Eclipse' },
            { icon: '⚡', name: 'Lightning' },
            { icon: '🏔️', name: 'Mountain' },
            { icon: '🌈', name: 'Rainbow' },
            { icon: '🦊', name: 'Fox' },
            { icon: '🦉', name: 'Owl' },
          ].map((card, i) => (
            <Card
              key={i}
              className="p-3 text-center bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20 transition-colors"
            >
              <div className="text-2xl mb-1">{card.icon}</div>
              <div className="text-xs text-gray-400">{card.name}</div>
            </Card>
          ))}
        </div>
      </Card>

      <div className="mt-6 p-4 rounded-lg bg-pink-500/10 border border-pink-500/20 text-center">
        <p className="text-sm text-pink-300 font-medium mb-1">
          🎭 For Entertainment & Visualization Only
        </p>
        <p className="text-xs text-gray-400">
          This is a creative way to visualize market narratives. Not financial advice.
          Cards use simulated scenarios for demonstration purposes.
        </p>
      </div>
    </Card>
  );
}
