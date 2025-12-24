import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import {
  Target,
  Clock,
  Trophy,
  Zap,
  Brain,
  TrendingUp,
  Search,
  Award,
  CheckCircle2,
} from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'detective' | 'prediction' | 'speed' | 'analysis' | 'pattern';
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  timeLimit?: string;
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  progress?: number;
  icon: string;
  color: string;
}

const challenges: Challenge[] = [
  {
    id: '1',
    title: 'DETECTIVE CHALLENGE',
    description:
      'The VIX dropped 8% today but SPX only rose 0.3%. This is unusual. Find out why.',
    type: 'detective',
    difficulty: 'medium',
    xpReward: 50,
    timeLimit: '30 minutes',
    status: 'available',
    icon: '🔍',
    color: 'from-blue-500/10 to-purple-500/10',
  },
  {
    id: '2',
    title: 'PREDICTION CHALLENGE',
    description: 'FOMC minutes release at 14:00. Predict the SPX move.',
    type: 'prediction',
    difficulty: 'hard',
    xpReward: 30,
    timeLimit: 'Until 14:00',
    status: 'available',
    icon: '🎯',
    color: 'from-green-500/10 to-blue-500/10',
  },
  {
    id: '3',
    title: 'SPEED ROUND',
    description: '5 questions, 10 seconds each. Topic: Bond-Stock correlation',
    type: 'speed',
    difficulty: 'easy',
    xpReward: 20,
    timeLimit: '2 minutes',
    status: 'available',
    icon: '⚡',
    color: 'from-yellow-500/10 to-orange-500/10',
  },
  {
    id: '4',
    title: 'PATTERN MASTER',
    description: 'Identify 3 patterns in real market data. Accuracy matters.',
    type: 'pattern',
    difficulty: 'medium',
    xpReward: 40,
    status: 'in-progress',
    progress: 66,
    icon: '📊',
    color: 'from-purple-500/10 to-pink-500/10',
  },
  {
    id: '5',
    title: 'DAILY STREAK BONUS',
    description: 'Complete your 7-day streak for a massive XP boost!',
    type: 'analysis',
    difficulty: 'easy',
    xpReward: 100,
    status: 'locked',
    icon: '🔥',
    color: 'from-orange-500/10 to-red-500/10',
  },
];

export function DailyChallenges() {
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [completedToday, setCompletedToday] = useState(2);
  const totalChallenges = 3;

  const getDifficultyColor = (difficulty: Challenge['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500/20 text-green-300 border-green-400/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30';
      case 'hard':
        return 'bg-red-500/20 text-red-300 border-red-400/30';
    }
  };

  const getStatusBadge = (status: Challenge['status']) => {
    switch (status) {
      case 'available':
        return (
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">
            Available
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30 animate-pulse">
            In Progress
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-green-500/20 text-green-300 border-green-400/30">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case 'locked':
        return (
          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
            🔒 Locked
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-8 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-white/10 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="text-4xl">🎯</div>
            <div>
              <h2 className="text-2xl font-bold text-white">TODAY'S CHALLENGES</h2>
              <p className="text-sm text-gray-400">December 19, 2024</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-purple-400">
              {completedToday}/{totalChallenges}
            </div>
            <div className="text-xs text-gray-400">Completed Today</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Daily Progress</span>
            <span className="text-sm text-purple-400 font-semibold">
              {Math.round((completedToday / totalChallenges) * 100)}%
            </span>
          </div>
          <Progress
            value={(completedToday / totalChallenges) * 100}
            className="h-3"
          />
        </div>

        {/* Streak Info */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🔥</div>
              <div>
                <div className="text-lg font-bold text-white">12 Day Streak</div>
                <div className="text-sm text-gray-400">
                  Complete all challenges to keep it alive!
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-400">+50%</div>
              <div className="text-xs text-gray-400">XP Bonus Active</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges.map((challenge) => (
          <Card
            key={challenge.id}
            className={`p-6 border transition-all hover:scale-105 ${
              challenge.status === 'locked'
                ? 'opacity-50 cursor-not-allowed bg-gray-900/30 border-gray-700/30'
                : challenge.status === 'completed'
                ? 'bg-green-500/5 border-green-500/30'
                : 'bg-gray-900/50 border-white/10 cursor-pointer'
            } bg-gradient-to-br ${challenge.color}`}
            onClick={() => {
              if (challenge.status !== 'locked') {
                setSelectedChallenge(
                  selectedChallenge === challenge.id ? null : challenge.id
                );
              }
            }}
          >
            {/* Challenge Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{challenge.icon}</div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    {challenge.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge className={getDifficultyColor(challenge.difficulty)}>
                      {challenge.difficulty.toUpperCase()}
                    </Badge>
                    {getStatusBadge(challenge.status)}
                  </div>
                </div>
              </div>
            </div>

            {/* Challenge Description */}
            <p className="text-sm text-gray-300 mb-4">{challenge.description}</p>

            {/* Challenge Stats */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4 text-sm">
                {challenge.timeLimit && (
                  <div className="flex items-center gap-1 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{challenge.timeLimit}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-purple-400 font-semibold">
                  <Zap className="w-4 h-4" />
                  <span>+{challenge.xpReward} XP</span>
                </div>
              </div>
            </div>

            {/* Progress for in-progress challenges */}
            {challenge.status === 'in-progress' && challenge.progress !== undefined && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400">Progress</span>
                  <span className="text-xs text-yellow-400 font-semibold">
                    {challenge.progress}%
                  </span>
                </div>
                <Progress value={challenge.progress} className="h-2" />
              </div>
            )}

            {/* Action Button */}
            <Button
              className={`w-full ${
                challenge.status === 'locked'
                  ? 'bg-gray-700/50 cursor-not-allowed'
                  : challenge.status === 'completed'
                  ? 'bg-green-500/20 border border-green-500/30 text-green-300'
                  : challenge.status === 'in-progress'
                  ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-300'
                  : 'bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30'
              }`}
              disabled={challenge.status === 'locked'}
            >
              {challenge.status === 'locked' ? (
                '🔒 Complete previous challenges'
              ) : challenge.status === 'completed' ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Completed
                </>
              ) : challenge.status === 'in-progress' ? (
                <>
                  <Target className="w-4 h-4 mr-2" />
                  Continue Challenge
                </>
              ) : (
                <>
                  <Trophy className="w-4 h-4 mr-2" />
                  Start Challenge
                </>
              )}
            </Button>

            {/* Expanded Details */}
            {selectedChallenge === challenge.id && challenge.status === 'available' && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-2">
                      What You'll Learn:
                    </h4>
                    <ul className="space-y-1">
                      {challenge.type === 'detective' && (
                        <>
                          <li className="text-xs text-gray-400">
                            • How VIX and SPX can disconnect
                          </li>
                          <li className="text-xs text-gray-400">
                            • Options expiration calendar impact
                          </li>
                          <li className="text-xs text-gray-400">
                            • VIX futures term structure analysis
                          </li>
                        </>
                      )}
                      {challenge.type === 'prediction' && (
                        <>
                          <li className="text-xs text-gray-400">
                            • How to assess event risk
                          </li>
                          <li className="text-xs text-gray-400">
                            • Historical FOMC reaction patterns
                          </li>
                          <li className="text-xs text-gray-400">
                            • Position sizing around events
                          </li>
                        </>
                      )}
                      {challenge.type === 'speed' && (
                        <>
                          <li className="text-xs text-gray-400">
                            • Quick recall of key relationships
                          </li>
                          <li className="text-xs text-gray-400">
                            • Bond-stock correlation fundamentals
                          </li>
                          <li className="text-xs text-gray-400">
                            • Risk-on vs risk-off dynamics
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Leaderboard */}
      <Card className="p-6 bg-gray-800/50 border-white/10 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            Today's Leaderboard
          </h3>
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30">
            Top 10
          </Badge>
        </div>

        <div className="space-y-3">
          {[
            { rank: 1, name: '@PatternMaster', xp: 340, challenges: 3, streak: 18 },
            { rank: 2, name: '@CryptoWhale', xp: 310, challenges: 3, streak: 12 },
            { rank: 3, name: '@ValueInvestor', xp: 280, challenges: 3, streak: 9 },
            { rank: 4, name: 'You', xp: 220, challenges: 2, streak: 12, isYou: true },
            { rank: 5, name: '@TechBull', xp: 200, challenges: 2, streak: 7 },
          ].map((user) => (
            <div
              key={user.rank}
              className={`p-4 rounded-lg ${
                user.isYou
                  ? 'bg-blue-500/10 border-2 border-blue-500/30'
                  : 'bg-gray-900/50 border border-white/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`text-2xl font-bold ${
                      user.rank === 1
                        ? 'text-yellow-400'
                        : user.rank === 2
                        ? 'text-gray-300'
                        : user.rank === 3
                        ? 'text-orange-400'
                        : 'text-gray-500'
                    }`}
                  >
                    #{user.rank}
                  </div>
                  <div>
                    <div
                      className={`font-semibold ${
                        user.isYou ? 'text-blue-400' : 'text-white'
                      }`}
                    >
                      {user.name}
                      {user.rank <= 3 && (
                        <span className="ml-2">
                          {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉'}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      {user.challenges}/3 challenges • {user.streak} day streak
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-purple-400">{user.xp}</div>
                  <div className="text-xs text-gray-400">XP</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Weekly Progress */}
      <Card className="p-6 bg-gradient-to-r from-purple-500/5 to-blue-500/5 border-purple-500/20">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-purple-400" />
          Weekly Progress
        </h3>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
            const isToday = index === 3; // Thursday
            const isCompleted = index < 4;
            return (
              <div key={day} className="text-center">
                <div className="text-xs text-gray-400 mb-2">{day}</div>
                <div
                  className={`w-full aspect-square rounded-lg flex items-center justify-center ${
                    isToday
                      ? 'bg-blue-500/20 border-2 border-blue-400/50'
                      : isCompleted
                      ? 'bg-green-500/20 border border-green-400/30'
                      : 'bg-gray-900/50 border border-white/10'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  ) : isToday ? (
                    <span className="text-xl">🎯</span>
                  ) : (
                    <span className="text-gray-600">—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-white">4/7</div>
            <div className="text-xs text-gray-400">Days completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">820</div>
            <div className="text-xs text-gray-400">Total XP this week</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">94%</div>
            <div className="text-xs text-gray-400">Success rate</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
