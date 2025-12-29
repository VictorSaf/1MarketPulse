import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { Award, Share2, BookOpen } from 'lucide-react';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';


interface Achievement {
  id: string;
  icon: string;
  name: string;
  subtitle: string;
  story: {
    what: string;
    when: string;
    impact: string;
    meaning: string;
  };
  reward: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  unlocked: boolean;
  progress?: number;
}

const achievements: Achievement[] = [
  {
    id: '1',
    icon: '🎖️',
    name: 'CONTRARIAN',
    subtitle: 'Swimming against the current',
    story: {
      what: 'On Dec 15, 78% of community was bearish on BTC. You predicted bullish.',
      when: 'Next 3 days: BTC +12%',
      impact: 'You were right when the majority was wrong.',
      meaning: 'You think independently and analyze beyond the crowd.',
    },
    reward: '+100 XP + "Contrarian Analysis" feature unlocked',
    rarity: 'rare',
    unlocked: true,
  },
  {
    id: '2',
    icon: '🔥',
    name: 'HOT STREAK',
    subtitle: '7 days of perfect predictions',
    story: {
      what: 'From Dec 10-16, you made 7 consecutive correct market calls.',
      when: 'Your longest streak ever',
      impact: 'You demonstrated consistent analytical skill.',
      meaning: "You're developing reliable market intuition.",
    },
    reward: '+150 XP + "Hot Streak" badge',
    rarity: 'uncommon',
    unlocked: true,
  },
  {
    id: '3',
    icon: '🦅',
    name: 'EAGLE EYE',
    subtitle: 'Spotted a pattern nobody else saw',
    story: {
      what: 'You identified an accumulation pattern on NVDA 2 days before breakout.',
      when: 'Pattern confirmed with +8% move',
      impact: 'First in community to spot this opportunity.',
      meaning: 'Your pattern recognition skills are exceptional.',
    },
    reward: '+200 XP + "Pattern Master" title',
    rarity: 'rare',
    unlocked: true,
  },
  {
    id: '4',
    icon: '👑',
    name: 'MARKET ORACLE',
    subtitle: 'Predicted a black swan event',
    story: {
      what: 'Coming soon...',
      when: 'Predict a major unexpected market move',
      impact: 'This is the ultimate achievement',
      meaning: 'Reserved for true market prophets',
    },
    reward: '+500 XP + "Oracle" legendary badge',
    rarity: 'legendary',
    unlocked: false,
    progress: 40,
  },
];

export function EnhancedAchievementStories() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleComingSoonClick = (feature: string) => {
    toast.info(`${feature} coming soon!`, {
      description: 'This feature is under development.',
    });
  };

  if (isLoading) {
    return (
      <div className="animate-pulse bg-gray-800/50 rounded-xl h-96" />
    );
  }

  return (
    <Card className="p-8 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-white/10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            🏆 YOUR ACHIEVEMENT STORY
          </h2>
          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30 text-xs">
            DEMO MODE
          </Badge>
        </div>
        <p className="text-sm text-gray-400">Every achievement tells your trading journey (example data)</p>
      </div>

      <div className="space-y-6">
        {achievements.map((achievement) => (
          <Card
            key={achievement.id}
            className={`p-6 border-2 transition-all ${
              achievement.unlocked
                ? achievement.rarity === 'legendary'
                  ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/40'
                  : achievement.rarity === 'rare'
                  ? 'bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30'
                  : 'bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-500/20'
                : 'bg-gray-900/50 border-gray-700/30 opacity-60'
            }`}
          >
            {achievement.unlocked ? (
              <>
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="text-6xl">{achievement.icon}</div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">{achievement.name}</h3>
                      <p className="text-sm text-gray-400 italic">"{achievement.subtitle}"</p>
                      <Badge className={`mt-2 ${
                        achievement.rarity === 'legendary'
                          ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30'
                          : achievement.rarity === 'rare'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-400/30'
                          : 'bg-green-500/20 text-green-300 border-green-400/30'
                      }`}>
                        {achievement.rarity.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button className="border-white/10" size="sm" variant="outline">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Story */}
                <div className="space-y-4 mb-6">
                  <div className="p-4 rounded-lg bg-gray-900/50 border border-white/5">
                    <div className="text-sm font-semibold text-blue-300 mb-2">THE STORY:</div>
                    <div className="space-y-2 text-sm text-gray-300">
                      <p>{achievement.story.what}</p>
                      <p className="text-green-400 font-semibold">{achievement.story.when}</p>
                      <p>{achievement.story.impact}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
                    <div className="text-sm font-semibold text-purple-300 mb-2">WHAT THIS MEANS:</div>
                    <p className="text-sm text-white">{achievement.story.meaning}</p>
                  </div>
                </div>

                {/* Reward */}
                <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm font-semibold text-yellow-300">REWARD UNLOCKED:</span>
                  </div>
                  <p className="text-sm text-white">{achievement.reward}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-4">
                  <Button
                    className="flex-1 bg-blue-500/20 border border-blue-500/30 text-blue-300 opacity-50 cursor-not-allowed"
                    disabled
                    title="Coming Soon"
                    onClick={() => handleComingSoonClick('Share Story')}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Story
                  </Button>
                  <Button
                    className="flex-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 opacity-50 cursor-not-allowed"
                    disabled
                    title="Coming Soon"
                    onClick={() => handleComingSoonClick('Learn More')}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Learn More
                  </Button>
                </div>
              </>
            ) : (
              /* Locked Achievement */
              <>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-6xl opacity-30">{achievement.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-400 mb-1">{achievement.name}</h3>
                    <p className="text-sm text-gray-500 italic">"{achievement.subtitle}"</p>
                    <Badge className="mt-2" variant="secondary">
                      🔒 LOCKED
                    </Badge>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-gray-900/30 border border-white/5 mb-4">
                  <div className="text-sm text-gray-400 mb-3">
                    {achievement.story.what}
                  </div>
                  {achievement.progress && (
                    <div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <span>Progress</span>
                        <span>{achievement.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
                          style={{ width: `${achievement.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-xs text-gray-500">
                  Unlock: {achievement.story.meaning}
                </div>
              </>
            )}
          </Card>
        ))}
      </div>

      {/* Stats Summary */}
      <Card className="mt-8 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <h3 className="text-white font-semibold mb-4">YOUR COLLECTION STATS:</h3>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-white mb-1">3</div>
            <div className="text-xs text-gray-400">Unlocked</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400 mb-1">1</div>
            <div className="text-xs text-gray-400">Rare</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-400 mb-1">0</div>
            <div className="text-xs text-gray-400">Legendary</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400 mb-1">+450</div>
            <div className="text-xs text-gray-400">Total XP</div>
          </div>
        </div>
      </Card>
    </Card>
  );
}
