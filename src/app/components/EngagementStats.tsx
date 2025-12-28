import { useState, useEffect } from 'react';

import { Flame, Trophy, Target, Zap, Info } from 'lucide-react';

import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Progress } from './ui/progress';

interface EngagementStatsProps {
  streak?: number;
  level?: number;
  xp?: number;
  xpToNextLevel?: number;
  achievements?: number;
}

// Session-based engagement tracking (resets on page refresh)
// TODO: Connect to backend API for persistent user progress
export function EngagementStats({
  streak: initialStreak = 0,
  level: initialLevel = 1,
  xp: initialXp = 0,
  xpToNextLevel = 1000,
  achievements: initialAchievements = 0
}: EngagementStatsProps) {
  // Use session-based state that could be updated by other components
  const [stats, setStats] = useState({
    streak: initialStreak,
    level: initialLevel,
    xp: initialXp,
    achievements: initialAchievements,
    dailyCompleted: 0,
    dailyTotal: 3
  });

  // Listen for XP updates from challenges or other components
  useEffect(() => {
    const handleXpUpdate = (event: CustomEvent<{ xp: number; type: string }>) => {
      setStats(prev => {
        const newXp = prev.xp + event.detail.xp;
        const newLevel = Math.floor(newXp / xpToNextLevel) + 1;
        return {
          ...prev,
          xp: newXp % xpToNextLevel,
          level: newLevel,
          achievements: event.detail.type === 'achievement' ? prev.achievements + 1 : prev.achievements
        };
      });
    };

    window.addEventListener('xp-earned' as any, handleXpUpdate);
    return () => window.removeEventListener('xp-earned' as any, handleXpUpdate);
  }, [xpToNextLevel]);

  const xpProgress = (stats.xp / xpToNextLevel) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-end gap-2 mb-1">
        <Badge className="bg-gray-700/50 text-gray-400 border-gray-600/30 text-xs flex items-center gap-1">
          <Info className="w-3 h-3" />
          Session Data
        </Badge>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-orange-500/20 to-red-500/10 border-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-orange-500/20">
              <Flame className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Streak</p>
              <p className="text-2xl font-bold text-white">{stats.streak}</p>
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
              <p className="text-2xl font-bold text-white">{stats.level}</p>
            </div>
          </div>
          <div className="space-y-1">
            <Progress className="h-1.5 bg-white/10" value={xpProgress} />
            <p className="text-xs text-gray-400">{stats.xp}/{xpToNextLevel} XP</p>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Trophy className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Achievements</p>
              <p className="text-2xl font-bold text-white">{stats.achievements}</p>
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
              <p className="text-lg font-semibold text-white">{stats.dailyCompleted}/{stats.dailyTotal}</p>
            </div>
          </div>
          <Progress className="h-1.5 bg-white/10" value={(stats.dailyCompleted / stats.dailyTotal) * 100} />
        </Card>
      </div>
    </div>
  );
}
