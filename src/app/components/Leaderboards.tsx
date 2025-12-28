import { Trophy, TrendingUp, Info } from 'lucide-react';

import { Badge } from './ui/badge';
import { Card } from './ui/card';

// Leaderboard component - requires backend integration for persistent user data
// TODO: Connect to backend API for real leaderboard data
export function Leaderboards() {
  return (
    <Card className="p-8 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-white/10">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              LEADERBOARDS
            </h2>
            <p className="text-sm text-gray-400">Compete with other traders</p>
          </div>
          <Badge className="bg-gray-500/20 text-gray-300 border-gray-400/30 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Coming Soon
          </Badge>
        </div>
      </div>

      {/* Placeholder content */}
      <div className="text-center py-12">
        <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-600" />
        <h3 className="text-xl font-bold text-white mb-2">Leaderboard Coming Soon</h3>
        <p className="text-gray-400 mb-4 max-w-md mx-auto">
          Compete with other traders and climb the ranks. Leaderboard features require backend integration to persist user scores and rankings.
        </p>
        <div className="flex justify-center gap-4">
          <Card className="p-4 bg-gray-900/50 border-white/10 text-center">
            <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
            <div className="text-xs text-gray-400">Weekly</div>
            <div className="text-sm text-white">Rankings</div>
          </Card>
          <Card className="p-4 bg-gray-900/50 border-white/10 text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-400" />
            <div className="text-xs text-gray-400">Monthly</div>
            <div className="text-sm text-white">Competitions</div>
          </Card>
        </div>
      </div>

      <Card className="p-4 bg-blue-500/10 border-blue-500/20 mt-6">
        <div className="flex items-center gap-3">
          <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />
          <p className="text-sm text-gray-400">
            Complete challenges and track your progress. Rankings will be available once backend integration is complete.
          </p>
        </div>
      </Card>
    </Card>
  );
}
