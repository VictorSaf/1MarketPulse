import { useState } from 'react';

import { Gift, Sparkles, TrendingUp, Award, Zap } from 'lucide-react';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';


type SurpriseType = 'mystery' | 'challenge' | 'unlock' | 'delight';

interface Surprise {
  id: string;
  type: SurpriseType;
  icon: string;
  title: string;
  description: string;
  reward: string;
  revealed: boolean;
}

const todaysSurprise: Surprise = {
  id: '1',
  type: 'mystery',
  icon: '🔮',
  title: 'MYSTERY INSIGHT',
  description: "I've found something interesting in today's data...",
  reward: '+50 XP + Special insight',
  revealed: false,
};

export function SurpriseSystem() {
  const [surprise, setSurprise] = useState(todaysSurprise);

  const revealSurprise = () => {
    setSurprise({ ...surprise, revealed: true });
  };

  return (
    <Card className="p-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-white/10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          🎁 DAILY SURPRISE
        </h2>
        <p className="text-sm text-gray-400">Something special waiting for you today</p>
      </div>

      {!surprise.revealed ? (
        <Card className="p-8 text-center bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30">
          <div className="text-6xl mb-4 animate-bounce">{surprise.icon}</div>
          <h3 className="text-2xl font-bold text-white mb-3">{surprise.title}</h3>
          <p className="text-gray-300 mb-6 max-w-md mx-auto">{surprise.description}</p>
          <Button
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg px-8 py-6"
            onClick={revealSurprise}
          >
            <Gift className="w-5 h-5 mr-2" />
            Reveal Surprise
          </Button>
        </Card>
      ) : (
        <Card className="p-6 bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-500/20">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl">
              {surprise.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">{surprise.title}</h3>
              <Badge className="bg-green-500/20 text-green-300 border-green-400/30">
                <Sparkles className="w-3 h-3 mr-1" />
                Unlocked!
              </Badge>
            </div>
          </div>

          <Card className="p-4 bg-black/20 border-white/10 mb-4">
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              HIDDEN PATTERN DISCOVERED
            </h4>
            <div className="space-y-2 text-sm text-gray-300">
              <p>
                In the last 30 days, when VIX was below 15 (like today) AND NVDA had 8+ green days
                in a row (like now):
              </p>
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded">
                <div className="text-blue-300 font-semibold mb-2">
                  Pattern outcome (5 historical matches):
                </div>
                <div className="space-y-1 text-xs">
                  <div>• 4 out of 5 times: Continued rally (+3-7% in next 5 days)</div>
                  <div>• 1 out of 5 times: Pullback (-2% then recovery)</div>
                  <div>• Average move: +4.2% in next week</div>
                </div>
              </div>
              <p className="text-blue-400 font-semibold">
                💡 Insight: History suggests momentum continues, but watch for profit-taking after
                day 10.
              </p>
            </div>
          </Card>

          <Card className="p-4 bg-yellow-500/10 border-yellow-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-semibold text-yellow-300">REWARD UNLOCKED:</span>
            </div>
            <p className="text-sm text-white">{surprise.reward}</p>
          </Card>
        </Card>
      )}

      <div className="mt-8 grid grid-cols-4 gap-3">
        <Card className="p-4 text-center bg-purple-500/10 border-purple-500/20">
          <div className="text-2xl mb-2">🔮</div>
          <div className="text-xs text-gray-400">Mystery</div>
          <div className="text-xs text-purple-300">2x/week</div>
        </Card>
        <Card className="p-4 text-center bg-orange-500/10 border-orange-500/20">
          <div className="text-2xl mb-2">🎯</div>
          <div className="text-xs text-gray-400">Challenge</div>
          <div className="text-xs text-orange-300">3x/week</div>
        </Card>
        <Card className="p-4 text-center bg-blue-500/10 border-blue-500/20">
          <div className="text-2xl mb-2">📦</div>
          <div className="text-xs text-gray-400">Unlock</div>
          <div className="text-xs text-blue-300">Milestones</div>
        </Card>
        <Card className="p-4 text-center bg-green-500/10 border-green-500/20">
          <div className="text-2xl mb-2">🎲</div>
          <div className="text-xs text-gray-400">Random</div>
          <div className="text-xs text-green-300">Anytime</div>
        </Card>
      </div>

      <div className="mt-6 p-4 rounded-lg bg-gray-900/30 border border-white/5 text-center">
        <div className="text-xs text-gray-500">
          💡 Check back daily for new surprises. Each one is unique and never repeats!
        </div>
      </div>
    </Card>
  );
}
