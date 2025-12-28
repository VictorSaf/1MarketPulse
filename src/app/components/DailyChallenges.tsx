import { useState } from 'react';

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
  Play,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';


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
  const [challengeStates, setChallengeStates] = useState<Record<string, Challenge['status']>>({});
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const totalChallenges = 3;

  // Get current status (from state or default)
  const getChallengeStatus = (challenge: Challenge): Challenge['status'] => {
    return challengeStates[challenge.id] || challenge.status;
  };

  // Handle starting a challenge
  const handleStartChallenge = (challenge: Challenge, e: React.MouseEvent) => {
    e.stopPropagation();

    if (challenge.status === 'locked') {
      toast.error('Complete previous challenges first!');
      return;
    }

    setChallengeStates(prev => ({
      ...prev,
      [challenge.id]: 'in-progress'
    }));
    setActiveChallenge(challenge);

    toast.success(`Started: ${challenge.title}`, {
      description: `You have ${challenge.timeLimit || 'unlimited time'} to complete this challenge.`,
      action: {
        label: 'View',
        onClick: () => setSelectedChallenge(challenge.id),
      },
    });
  };

  // Handle continuing a challenge
  const handleContinueChallenge = (challenge: Challenge, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveChallenge(challenge);
    setSelectedChallenge(challenge.id);

    toast.info(`Continuing: ${challenge.title}`, {
      description: `Progress: ${challenge.progress || 0}%`,
    });
  };

  // Handle completing a challenge (simulated)
  const handleCompleteChallenge = (challenge: Challenge) => {
    setChallengeStates(prev => ({
      ...prev,
      [challenge.id]: 'completed'
    }));
    setCompletedToday(prev => prev + 1);
    setActiveChallenge(null);

    toast.success(`Challenge Completed!`, {
      description: `You earned +${challenge.xpReward} XP!`,
    });
  };

  // Handle abandoning a challenge
  const handleAbandonChallenge = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeChallenge) {
      setChallengeStates(prev => ({
        ...prev,
        [activeChallenge.id]: 'available'
      }));
      setActiveChallenge(null);
      toast.warning('Challenge abandoned', {
        description: 'You can restart anytime.',
      });
    }
  };

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
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-white">TODAY'S CHALLENGES</h2>
                <Badge className="bg-amber-500/20 text-amber-300 border-amber-400/30 text-xs">
                  Demo
                </Badge>
              </div>
              <p className="text-sm text-gray-400">Interactive learning challenges</p>
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
            className="h-3"
            value={(completedToday / totalChallenges) * 100}
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
        {challenges.map((challenge) => {
          const status = getChallengeStatus(challenge);
          return (
          <Card
            key={challenge.id}
            className={`p-6 border transition-all hover:scale-105 ${
              status === 'locked'
                ? 'opacity-50 cursor-not-allowed bg-gray-900/30 border-gray-700/30'
                : status === 'completed'
                ? 'bg-green-500/5 border-green-500/30'
                : status === 'in-progress'
                ? 'bg-yellow-500/5 border-yellow-500/30 ring-2 ring-yellow-500/20'
                : 'bg-gray-900/50 border-white/10 cursor-pointer'
            } bg-gradient-to-br ${challenge.color}`}
            onClick={() => {
              if (status !== 'locked') {
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
                    {getStatusBadge(status)}
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
            {(status === 'in-progress' || (challenge.status === 'in-progress' && status !== 'completed')) && challenge.progress !== undefined && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400">Progress</span>
                  <span className="text-xs text-yellow-400 font-semibold">
                    {challenge.progress}%
                  </span>
                </div>
                <Progress className="h-2" value={challenge.progress} />
              </div>
            )}

            {/* Action Button */}
            {(() => {
              const status = getChallengeStatus(challenge);
              return (
                <Button
                  className={`w-full ${
                    status === 'locked'
                      ? 'bg-gray-700/50 cursor-not-allowed'
                      : status === 'completed'
                      ? 'bg-green-500/20 border border-green-500/30 text-green-300'
                      : status === 'in-progress'
                      ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-300'
                      : 'bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30'
                  }`}
                  disabled={status === 'locked'}
                  onClick={(e) => {
                    if (status === 'available') {
                      handleStartChallenge(challenge, e);
                    } else if (status === 'in-progress') {
                      handleContinueChallenge(challenge, e);
                    }
                  }}
                >
                  {status === 'locked' ? (
                    '🔒 Complete previous challenges'
                  ) : status === 'completed' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Completed
                    </>
                  ) : status === 'in-progress' ? (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Continue Challenge
                    </>
                  ) : (
                    <>
                      <Trophy className="w-4 h-4 mr-2" />
                      Start Challenge
                    </>
                  )}
                </Button>
              );
            })()}

            {/* Expanded Details */}
            {selectedChallenge === challenge.id && getChallengeStatus(challenge) === 'available' && (
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
          );
        })}
      </div>

      {/* Active Challenge Panel */}
      {activeChallenge && (
        <Card className="p-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30 animate-pulse-slow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-4xl">{activeChallenge.icon}</div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Active: {activeChallenge.title}
                </h3>
                <p className="text-sm text-gray-400">{activeChallenge.description}</p>
              </div>
            </div>
            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30 animate-pulse">
              IN PROGRESS
            </Badge>
          </div>

          <div className="p-4 rounded-lg bg-black/20 border border-white/5 mb-4">
            <p className="text-sm text-gray-300 text-center">
              Challenge simulation: Click "Complete" to finish or "Abandon" to quit.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              className="flex-1 bg-green-500/20 border border-green-500/30 text-green-300 hover:bg-green-500/30"
              onClick={() => handleCompleteChallenge(activeChallenge)}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Complete Challenge (+{activeChallenge.xpReward} XP)
            </Button>
            <Button
              className="border-red-500/30 text-red-300 hover:bg-red-500/20"
              variant="outline"
              onClick={handleAbandonChallenge}
            >
              <X className="w-4 h-4 mr-2" />
              Abandon
            </Button>
          </div>
        </Card>
      )}

      {/* Leaderboard - Requires Backend Integration */}
      <Card className="p-6 bg-gray-800/50 border-white/10 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            Leaderboard
          </h3>
          <Badge className="bg-gray-500/20 text-gray-300 border-gray-400/30">
            Coming Soon
          </Badge>
        </div>

        <div className="text-center py-8">
          <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-600" />
          <p className="text-gray-400 mb-2">Leaderboard requires backend integration</p>
          <p className="text-xs text-gray-500">
            Complete challenges to earn XP and compete with others once connected.
          </p>
        </div>

        {/* Your Stats */}
        <div className="mt-4 p-4 rounded-lg bg-blue-500/10 border-2 border-blue-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold text-gray-500">-</div>
              <div>
                <div className="font-semibold text-blue-400">You</div>
                <div className="text-xs text-gray-400">
                  {completedToday}/{totalChallenges} challenges completed today
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-purple-400">
                {challenges.filter(c => getChallengeStatus(c) === 'completed').reduce((sum, c) => sum + c.xpReward, 0)}
              </div>
              <div className="text-xs text-gray-400">XP earned</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Weekly Progress - Session Based */}
      <Card className="p-6 bg-gradient-to-r from-purple-500/5 to-blue-500/5 border-purple-500/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-400" />
            Session Progress
          </h3>
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 text-xs">
            This Session
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-white">{completedToday}/{totalChallenges}</div>
            <div className="text-xs text-gray-400">Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">
              {challenges.filter(c => getChallengeStatus(c) === 'completed').reduce((sum, c) => sum + c.xpReward, 0)}
            </div>
            <div className="text-xs text-gray-400">XP Earned</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">
              {totalChallenges > 0 ? Math.round((completedToday / totalChallenges) * 100) : 0}%
            </div>
            <div className="text-xs text-gray-400">Progress</div>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-lg bg-gray-900/30 border border-white/5">
          <p className="text-xs text-gray-400 text-center">
            Progress is tracked per session. Connect to backend to persist your progress across sessions.
          </p>
        </div>
      </Card>
    </div>
  );
}
