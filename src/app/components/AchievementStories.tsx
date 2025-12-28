import { useState } from 'react';

import { Trophy, Star, Zap, Target, BookOpen, Share2 } from 'lucide-react';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';


interface Achievement {
  id: string;
  title: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  date?: string;
  story: {
    title: string;
    narrative: string;
    meaning: string;
    stats?: string;
  };
  reward: string;
}

const achievements: Achievement[] = [
  {
    id: 'contrarian',
    title: 'CONTRARIAN',
    icon: '🎖️',
    rarity: 'epic',
    unlocked: true,
    date: 'December 15, 2024',
    story: {
      title: 'Swimming against the current',
      narrative:
        'Pe 15 decembrie, 78% din comunitate era bearish pe BTC. Tu ai prezis bullish. Următoarele 3 zile: BTC +12%. Ai avut dreptate când majoritatea greșea. Asta necesită curaj și analiză independentă.',
      meaning:
        'Nu urmezi orbește mulțimea. Gândești independent. Ai potențial de contrarian investor.',
      stats: 'First time going against 70%+ crowd and being right',
    },
    reward: '+100 XP + Unlock "Contrarian Analysis" feature',
  },
  {
    id: 'eagle-eye',
    title: 'EAGLE EYE',
    icon: '🦅',
    rarity: 'rare',
    unlocked: true,
    date: 'December 5, 2024',
    story: {
      title: 'Your first pattern spotted',
      narrative:
        'On your fifth day, you spotted something others missed: a coiled spring forming in NVDA. Your first pattern call. It was right. The spring released. +8% in two days.',
      meaning: 'Pattern recognition is a skill that develops with practice. You have the eye.',
      stats: 'First successful pattern prediction: +$400 paper profit',
    },
    reward: '+50 XP + Badge visible to community',
  },
  {
    id: 'consistent',
    title: 'CONSISTENT',
    icon: '📅',
    rarity: 'common',
    unlocked: true,
    date: 'December 8, 2024',
    story: {
      title: 'The habit forms',
      narrative:
        'You returned every morning. Rain or shine. Day 7. The streak was born. Consistency beats intensity. You understand this now.',
      meaning:
        'Success in markets is not about one big win. It\'s about showing up every day.',
      stats: '7-day streak achieved • Current: 12 days',
    },
    reward: '+25 XP + Streak multiplier unlocked',
  },
  {
    id: 'tribe-member',
    title: 'TRIBE MEMBER',
    icon: '👥',
    rarity: 'rare',
    unlocked: true,
    date: 'December 12, 2024',
    story: {
      title: 'Finding your people',
      narrative:
        'The NVDA Hunters welcomed you. Alone we see patterns. Together we see the matrix. Your tribe rank: Elder (top 10%).',
      meaning: 'Community accelerates learning. You found yours.',
      stats: 'Joined NVDA Hunters • Rank: #12 of 2,847',
    },
    reward: '+75 XP + Tribe perks unlocked',
  },
  {
    id: 'prophet',
    title: 'PROPHET',
    icon: '🔮',
    rarity: 'legendary',
    unlocked: false,
    story: {
      title: 'The impossible call',
      narrative:
        'You predicted a black swan event 24 hours before it happened. Less than 0.1% of traders achieve this.',
      meaning:
        'True market mastery. Your analysis went beyond data - you understood psychology.',
      stats: 'Legendary achievement - only 47 holders',
    },
    reward: '+500 XP + Legendary badge + Hall of Fame entry',
  },
];

export function AchievementStories() {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const progressPercentage = Math.round((unlockedCount / totalCount) * 100);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
      case 'rare':
        return 'bg-blue-500/20 text-blue-300 border-blue-400/30';
      case 'epic':
        return 'bg-purple-500/20 text-purple-300 border-purple-400/30';
      case 'legendary':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'rare':
        return 'shadow-[0_0_20px_rgba(59,130,246,0.3)]';
      case 'epic':
        return 'shadow-[0_0_20px_rgba(168,85,247,0.3)]';
      case 'legendary':
        return 'shadow-[0_0_30px_rgba(234,179,8,0.5)]';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-8 bg-gradient-to-br from-yellow-500/10 to-purple-500/10 border-white/10 backdrop-blur-sm">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            🏆 YOUR TRADING STORY
          </h2>
          <p className="text-sm text-gray-400">Pattern Apprentice, Level 12</p>
        </div>

        {/* Progress */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400">Achievement Progress</span>
            <span className="text-sm text-yellow-400 font-semibold">
              {unlockedCount} / {totalCount}
            </span>
          </div>
          <Progress className="h-3 mb-2" value={progressPercentage} />
          <div className="text-center text-xs text-gray-500">
            {progressPercentage}% Complete
          </div>
        </div>

        {/* Achievement Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {achievements.map((achievement) => (
            <button
              key={achievement.id}
              className={`p-6 rounded-xl border-2 transition-all hover:scale-105 ${
                achievement.unlocked
                  ? `${getRarityColor(achievement.rarity)} ${getRarityGlow(
                      achievement.rarity
                    )}`
                  : 'bg-gray-900/30 border-gray-700/30 opacity-50'
              }`}
              disabled={!achievement.unlocked}
              onClick={() => setSelectedAchievement(achievement)}
            >
              <div className="text-center">
                <div className="text-4xl mb-2 filter grayscale-0">
                  {achievement.unlocked ? achievement.icon : '🔒'}
                </div>
                <div className="text-xs font-bold text-white mb-2">
                  {achievement.title}
                </div>
                <Badge className={`${getRarityColor(achievement.rarity)} text-xs`}>
                  {achievement.rarity}
                </Badge>
              </div>
            </button>
          ))}
        </div>

        {/* Rarity Legend */}
        <div className="flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gray-500" />
            <span className="text-gray-400">Common</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-500" />
            <span className="text-gray-400">Rare</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-purple-500" />
            <span className="text-gray-400">Epic</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-yellow-500" />
            <span className="text-gray-400">Legendary</span>
          </div>
        </div>
      </Card>

      {/* Selected Achievement Story */}
      {selectedAchievement && (
        <Card
          className={`p-8 ${getRarityGlow(
            selectedAchievement.rarity
          )} bg-gradient-to-br from-gray-800/90 to-gray-900/90 border-2 ${
            selectedAchievement.rarity === 'legendary'
              ? 'border-yellow-400/50'
              : selectedAchievement.rarity === 'epic'
              ? 'border-purple-400/50'
              : selectedAchievement.rarity === 'rare'
              ? 'border-blue-400/50'
              : 'border-gray-400/30'
          }`}
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="text-6xl">{selectedAchievement.icon}</div>
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">
                  {selectedAchievement.title}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge className={getRarityColor(selectedAchievement.rarity)}>
                    {selectedAchievement.rarity.toUpperCase()}
                  </Badge>
                  {selectedAchievement.unlocked && selectedAchievement.date && (
                    <span className="text-sm text-gray-400">
                      Unlocked: {selectedAchievement.date}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Button
              className="text-gray-400 hover:text-white"
              size="sm"
              variant="ghost"
              onClick={() => setSelectedAchievement(null)}
            >
              ✕
            </Button>
          </div>

          {selectedAchievement.unlocked ? (
            <div className="space-y-6">
              {/* Story Title */}
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-4">
                  "{selectedAchievement.story.title}"
                </div>
                <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>

              {/* Narrative */}
              <div className="p-6 rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20">
                <div className="flex items-start gap-3 mb-4">
                  <BookOpen className="w-5 h-5 text-purple-400 mt-1" />
                  <h4 className="text-lg font-semibold text-purple-300">THE STORY</h4>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  {selectedAchievement.story.narrative}
                </p>
              </div>

              {/* Meaning */}
              <div className="p-6 rounded-lg bg-gradient-to-br from-blue-500/10 to-green-500/10 border border-blue-500/20">
                <div className="flex items-start gap-3 mb-4">
                  <Star className="w-5 h-5 text-blue-400 mt-1" />
                  <h4 className="text-lg font-semibold text-blue-300">WHAT THIS MEANS</h4>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  {selectedAchievement.story.meaning}
                </p>
              </div>

              {/* Stats */}
              {selectedAchievement.story.stats && (
                <div className="p-6 rounded-lg bg-gradient-to-br from-green-500/10 to-yellow-500/10 border border-green-500/20">
                  <div className="flex items-start gap-3 mb-4">
                    <Target className="w-5 h-5 text-green-400 mt-1" />
                    <h4 className="text-lg font-semibold text-green-300">STATS</h4>
                  </div>
                  <p className="text-gray-300">{selectedAchievement.story.stats}</p>
                </div>
              )}

              {/* Reward */}
              <div className="p-6 rounded-lg bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
                <div className="flex items-start gap-3 mb-4">
                  <Trophy className="w-5 h-5 text-yellow-400 mt-1" />
                  <h4 className="text-lg font-semibold text-yellow-300">REWARD</h4>
                </div>
                <p className="text-gray-300">{selectedAchievement.reward}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button className="flex-1 bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Achievement
                </Button>
                <Button className="flex-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30">
                  <BookOpen className="w-4 h-4 mr-2" />
                  View All Stories
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-white mb-2">Achievement Locked</h3>
              <p className="text-gray-400 mb-4">{selectedAchievement.story.narrative}</p>
              <div className="p-4 rounded-lg bg-gray-900/50 border border-white/10 inline-block">
                <p className="text-sm text-gray-500">
                  Complete the requirements to unlock this story
                </p>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Chronicles */}
      <Card className="p-6 bg-gradient-to-r from-purple-500/5 to-blue-500/5 border-purple-500/20">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-purple-400" />
          <h3 className="text-lg font-bold text-white">📚 THE 2024 CHRONICLES</h3>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-gray-900/50 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <h4 className="font-semibold text-white">CURRENT ARC</h4>
            </div>
            <div className="text-sm text-purple-400 mb-1">
              "The Pattern Hunter" (Chapters 12-present)
            </div>
            <p className="text-sm text-gray-400">
              Your journey from novice to pattern recognition specialist
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-semibold text-gray-400">PREVIOUS CHAPTERS:</div>
            <div className="pl-4 border-l-2 border-purple-500/30 space-y-3">
              <div>
                <div className="text-sm text-white mb-1">Chapter 1-4: "The Awakening"</div>
                <p className="text-xs text-gray-500">
                  December 1-5 • First steps into market analysis
                </p>
              </div>
              <div>
                <div className="text-sm text-white mb-1">
                  Chapter 5-8: "The First Pattern"
                </div>
                <p className="text-xs text-gray-500">
                  December 5-8 • Eagle Eye achievement unlocked
                </p>
              </div>
              <div>
                <div className="text-sm text-white mb-1">Chapter 9-12: "The Tribe"</div>
                <p className="text-xs text-gray-500">
                  December 9-12 • Found the NVDA Hunters community
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="text-sm font-semibold text-blue-300 mb-2">
              NEXT CHAPTER PREVIEW:
            </div>
            <p className="text-sm text-gray-300">
              "The Paper Trading Championship approaches. Will you rise to the challenge? The
              monthly leaderboard awaits..."
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 rounded-lg bg-gray-900/50">
              <div className="text-xs text-gray-400 mb-1">Chapters Read</div>
              <div className="text-lg font-bold text-white">12 / 365</div>
            </div>
            <div className="p-3 rounded-lg bg-gray-900/50">
              <div className="text-xs text-gray-400 mb-1">Predictions Made</div>
              <div className="text-lg font-bold text-purple-400">34</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
