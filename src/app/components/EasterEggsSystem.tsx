import { useState } from 'react';

import { Gift, Trophy, Sparkles, Moon, Zap, Star } from 'lucide-react';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';


interface EasterEgg {
  id: string;
  name: string;
  icon: string;
  trigger: string;
  reward: string;
  rarity: 'common' | 'rare' | 'legendary';
  discovered: boolean;
}

const easterEggs: EasterEgg[] = [
  {
    id: '1',
    name: 'Hidden Symbol',
    icon: '💎',
    trigger: 'Random symbol appears somewhere on screen',
    reward: '+25 XP + Secret insight',
    rarity: 'common',
    discovered: false,
  },
  {
    id: '2',
    name: 'Konami Code',
    icon: '🎮',
    trigger: '↑↑↓↓←→←→ on mobile',
    reward: 'Fun mode for 5 minutes',
    rarity: 'rare',
    discovered: false,
  },
  {
    id: '3',
    name: 'Night Owl',
    icon: '🦉',
    trigger: 'Open app at 3 AM',
    reward: '"Night Owl" achievement',
    rarity: 'rare',
    discovered: false,
  },
  {
    id: '4',
    name: 'Speed Demon',
    icon: '⚡',
    trigger: '10 correct predictions in a row',
    reward: '"Speed Demon" badge',
    rarity: 'rare',
    discovered: false,
  },
  {
    id: '5',
    name: 'Contrarian',
    icon: '🦊',
    trigger: 'Predict against crowd and win',
    reward: '"Contrarian" achievement',
    rarity: 'rare',
    discovered: true,
  },
  {
    id: '6',
    name: 'Prophet',
    icon: '🔮',
    trigger: 'Predict a black swan event',
    reward: '"Prophet" legendary badge',
    rarity: 'legendary',
    discovered: false,
  },
];

export function EasterEggsSystem() {
  const [activeEgg, setActiveEgg] = useState<string | null>(null);
  const discovered = easterEggs.filter((e) => e.discovered).length;

  return (
    <Card className="p-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-white/10">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              🥚 EASTER EGGS SYSTEM
            </h2>
            <p className="text-sm text-gray-400">Hidden surprises throughout the platform</p>
          </div>
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30">
            {discovered}/{easterEggs.length} Discovered
          </Badge>
        </div>
      </div>

      <Card className="p-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Gift className="w-8 h-8 text-yellow-400" />
          <div>
            <h3 className="text-white font-semibold">SECRET ACHIEVEMENTS</h3>
            <p className="text-sm text-gray-400">Revealed only when you discover them</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 text-center bg-black/20 border-white/10">
            <Sparkles className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white mb-1">{discovered}</div>
            <div className="text-xs text-gray-400">Found</div>
          </Card>
          <Card className="p-3 text-center bg-black/20 border-white/10">
            <Star className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white mb-1">{easterEggs.length - discovered}</div>
            <div className="text-xs text-gray-400">Hidden</div>
          </Card>
          <Card className="p-3 text-center bg-black/20 border-white/10">
            <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white mb-1">
              {Math.round((discovered / easterEggs.length) * 100)}%
            </div>
            <div className="text-xs text-gray-400">Complete</div>
          </Card>
        </div>
      </Card>

      <div className="space-y-3 mb-6">
        {easterEggs.map((egg) => (
          <Card
            key={egg.id}
            className={`p-5 transition-all cursor-pointer ${
              egg.discovered
                ? 'bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20'
                : 'bg-gray-900/30 border-white/10 hover:bg-gray-900/50'
            }`}
            onClick={() => setActiveEgg(activeEgg === egg.id ? null : egg.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div
                  className={`text-3xl ${egg.discovered ? '' : 'blur-sm'}`}
                >
                  {egg.discovered ? egg.icon : '❓'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-semibold">
                      {egg.discovered ? egg.name : '??? Secret Achievement'}
                    </span>
                    <Badge
                      className={
                        egg.rarity === 'legendary'
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0'
                          : egg.rarity === 'rare'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-400/30'
                          : 'bg-gray-500/20 text-gray-300 border-gray-400/30'
                      }
                    >
                      {egg.rarity.toUpperCase()}
                    </Badge>
                  </div>
                  {egg.discovered ? (
                    <p className="text-sm text-gray-400">{egg.trigger}</p>
                  ) : (
                    <p className="text-sm text-gray-500 italic">Keep exploring to discover...</p>
                  )}
                </div>
              </div>

              {egg.discovered && (
                <Badge className="bg-green-500/20 text-green-300 border-green-400/30">
                  UNLOCKED
                </Badge>
              )}
            </div>

            {activeEgg === egg.id && egg.discovered && (
              <Card className="mt-4 p-4 bg-black/20 border-white/10 animate-in slide-in-from-top">
                <div className="text-sm">
                  <div className="text-gray-400 mb-2">REWARD:</div>
                  <div className="text-white font-semibold">{egg.reward}</div>
                </div>
              </Card>
            )}
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-blue-500/10 border-blue-500/20 mb-4">
        <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          SPECIAL EVENTS
        </h4>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <Moon className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <div className="text-white font-semibold mb-1">Your Birthday</div>
              <p className="text-gray-400">Special message + XP bonus + surprise gift</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Trophy className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div>
              <div className="text-white font-semibold mb-1">Platform Anniversary</div>
              <p className="text-gray-400">Video retrospective + exclusive badge</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Gift className="w-5 h-5 text-purple-400 mt-0.5" />
            <div>
              <div className="text-white font-semibold mb-1">Milestone Days</div>
              <p className="text-gray-400">7/30/100 days: Confetti + special rewards</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-purple-500/10 border-purple-500/20">
        <h4 className="text-white font-semibold mb-4">HOW EASTER EGGS WORK:</h4>
        <div className="space-y-2 text-sm text-gray-300">
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2" />
            <span>
              <strong className="text-purple-300">Hidden Symbols:</strong> Random icons appear
              briefly (10 min window), tap to collect
            </span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2" />
            <span>
              <strong className="text-purple-300">Behavior-based:</strong> Unlock by achieving
              specific milestones
            </span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2" />
            <span>
              <strong className="text-purple-300">Time-based:</strong> Special events on specific
              dates
            </span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2" />
            <span>
              <strong className="text-purple-300">Secrets:</strong> Some are completely hidden until
              discovered
            </span>
          </div>
        </div>
      </Card>

      <div className="mt-6 text-center">
        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <Sparkles className="w-4 h-4 mr-2" />
          Start Easter Egg Hunt
        </Button>
      </div>
    </Card>
  );
}
