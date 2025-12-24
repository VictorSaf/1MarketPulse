import { Flame, Trophy, Target, Zap } from 'lucide-react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';

interface EngagementStatsProps {
  streak: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  achievements: number;
}

export function EngagementStats({ streak, level, xp, xpToNextLevel, achievements }: EngagementStatsProps) {
  const xpProgress = (xp / xpToNextLevel) * 100;
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4 bg-gradient-to-br from-orange-500/20 to-red-500/10 border-white/10 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-orange-500/20">
            <Flame className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Streak</p>
            <p className="text-2xl font-bold text-white">{streak}</p>
          </div>
        </div>
        <p className="text-xs text-gray-400">days in a row</p>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/10 border-white/10 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-purple-500/20">
            <Zap className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Level</p>
            <p className="text-2xl font-bold text-white">{level}</p>
          </div>
        </div>
        <div className="space-y-1">
          <Progress value={xpProgress} className="h-1.5 bg-white/10" />
          <p className="text-xs text-gray-400">{xp}/{xpToNextLevel} XP</p>
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border-white/10 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-blue-500/20">
            <Trophy className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Achievements</p>
            <p className="text-2xl font-bold text-white">{achievements}</p>
          </div>
        </div>
        <p className="text-xs text-gray-400">unlocked</p>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/10 border-white/10 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-green-500/20">
            <Target className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Daily Challenge</p>
            <p className="text-lg font-semibold text-white">2/3</p>
          </div>
        </div>
        <Progress value={66.7} className="h-1.5 bg-white/10" />
      </Card>
    </div>
  );
}
