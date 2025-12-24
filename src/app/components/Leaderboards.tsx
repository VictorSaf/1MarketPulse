import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Trophy, TrendingUp } from 'lucide-react';

export function Leaderboards() {
  const leaders = [
    { rank: 1, name: 'TechTrader', score: 2890, accuracy: 89, streak: 12, badge: '🥇' },
    { rank: 2, name: 'PatternPro', score: 2750, accuracy: 85, streak: 8, badge: '🥈' },
    { rank: 3, name: 'MarketMaster', score: 2640, accuracy: 82, streak: 6, badge: '🥉' },
    { rank: 4, name: 'CryptoKing', score: 2530, accuracy: 80, streak: 5, badge: '' },
    { rank: 5, name: 'ChartWizard', score: 2420, accuracy: 78, streak: 4, badge: '' },
  ];

  return (
    <Card className="p-8 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-white/10">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              LEADERBOARDS
            </h2>
            <p className="text-sm text-gray-400">Top traders this month</p>
          </div>
          <Badge className="bg-yellow-500/20 text-yellow-300">
            Season 12
          </Badge>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {leaders.map((leader, i) => (
          <Card
            key={i}
            className={`p-4 ${
              i < 3
                ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20'
                : 'bg-gray-900/50 border-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-white w-8 text-center">
                  {leader.badge || leader.rank}
                </div>
                <div>
                  <div className="text-white font-semibold flex items-center gap-2">
                    {leader.name}
                    {leader.streak >= 5 && (
                      <span className="text-orange-400">🔥</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">
                    {leader.accuracy}% accuracy • {leader.streak} day streak
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-white">{leader.score}</div>
                <div className="text-xs text-gray-400">points</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-blue-500/10 border-blue-500/20">
        <div className="flex items-center gap-4">
          <TrendingUp className="w-8 h-8 text-blue-400" />
          <div>
            <div className="text-white font-semibold mb-1">Your Ranking</div>
            <div className="text-gray-400 text-sm">
              You're <strong className="text-white">#23</strong> with <strong className="text-white">2,340 points</strong>
              {' '}- Keep going to break top 20!
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <Card className="p-3 bg-purple-500/10 border-purple-500/20 text-center">
          <div className="text-xs text-gray-400 mb-1">Your Best</div>
          <div className="text-lg font-bold text-purple-400">#18</div>
        </Card>
        <Card className="p-3 bg-green-500/10 border-green-500/20 text-center">
          <div className="text-xs text-gray-400 mb-1">This Week</div>
          <div className="text-lg font-bold text-green-400">+5</div>
        </Card>
        <Card className="p-3 bg-orange-500/10 border-orange-500/20 text-center">
          <div className="text-xs text-gray-400 mb-1">To Top 10</div>
          <div className="text-lg font-bold text-orange-400">550pts</div>
        </Card>
      </div>
    </Card>
  );
}
