import { Users, Trophy, Target, TrendingUp } from 'lucide-react';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';


interface Challenge {
  id: string;
  name: string;
  description: string;
  goal: number;
  current: number;
  participants: number;
  timeLeft: string;
  reward: string;
  type: 'collective' | 'competitive';
}

const activeChallenges: Challenge[] = [
  {
    id: '1',
    name: 'Collective Pattern Hunt',
    description: 'Community goal: Find 1,000 valid patterns this week',
    goal: 1000,
    current: 734,
    participants: 847,
    timeLeft: '3 days',
    reward: '200 XP for all participants when goal reached',
    type: 'collective',
  },
  {
    id: '2',
    name: 'Prediction Accuracy Contest',
    description: 'Who can maintain highest accuracy over 20 predictions?',
    goal: 20,
    current: 12,
    participants: 234,
    timeLeft: '5 days',
    reward: 'Top 10: Legendary badges + 500 XP',
    type: 'competitive',
  },
];

export function CommunityChallenges() {
  return (
    <Card className="p-8 bg-gradient-to-br from-orange-500/10 to-pink-500/10 border-white/10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          🏆 COMMUNITY CHALLENGES
        </h2>
        <p className="text-sm text-gray-400">Compete together, achieve together</p>
      </div>

      <Card className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Users className="w-8 h-8 text-purple-400" />
          <div>
            <h3 className="text-xl font-bold text-white">Community Power</h3>
            <p className="text-sm text-gray-400">When we work together, everyone wins</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-purple-400 mb-1">847</div>
            <div className="text-xs text-gray-400">Active Members</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-400 mb-1">12</div>
            <div className="text-xs text-gray-400">Active Challenges</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-400 mb-1">156</div>
            <div className="text-xs text-gray-400">Goals Completed</div>
          </div>
        </div>
      </Card>

      <div className="space-y-4 mb-6">
        {activeChallenges.map((challenge) => (
          <Card
            key={challenge.id}
            className={`p-6 ${
              challenge.type === 'collective'
                ? 'bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20'
                : 'bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/20'
            }`}
          >
            <div className="flex items-start gap-4 mb-4">
              {challenge.type === 'collective' ? (
                <Users className="w-8 h-8 text-green-400" />
              ) : (
                <Trophy className="w-8 h-8 text-orange-400" />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-white">{challenge.name}</h3>
                  <Badge
                    className={
                      challenge.type === 'collective'
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-orange-500/20 text-orange-300'
                    }
                  >
                    {challenge.type === 'collective' ? 'COLLECTIVE' : 'COMPETITIVE'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-400 mb-4">{challenge.description}</p>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white font-semibold">
                      {challenge.current} / {challenge.goal}
                    </span>
                  </div>
                  <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`absolute top-0 left-0 h-full ${
                        challenge.type === 'collective'
                          ? 'bg-gradient-to-r from-green-500 to-blue-500'
                          : 'bg-gradient-to-r from-orange-500 to-red-500'
                      } rounded-full transition-all duration-500`}
                      style={{ width: `${(challenge.current / challenge.goal) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {Math.round((challenge.current / challenge.goal) * 100)}% complete
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span className="text-white">{challenge.participants} participants</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-purple-400" />
                      <span className="text-white">{challenge.timeLeft} left</span>
                    </div>
                  </div>
                </div>

                <Card className="p-4 bg-black/20 border-white/10 mb-4">
                  <div className="text-xs text-gray-400 mb-1">REWARD:</div>
                  <div className="text-sm text-white font-semibold">{challenge.reward}</div>
                </Card>

                <div className="flex gap-3">
                  <Button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    Join Challenge
                  </Button>
                  <Button className="border-white/10" variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="p-6 bg-green-500/10 border-green-500/20">
          <div className="flex items-start gap-3">
            <Users className="w-6 h-6 text-green-400 flex-shrink-0" />
            <div>
              <h4 className="text-white font-semibold mb-3">COLLECTIVE CHALLENGES:</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2" />
                  <span>Community works together toward one goal</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2" />
                  <span>Everyone wins when goal is reached</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2" />
                  <span>Builds camaraderie and teamwork</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-orange-500/10 border-orange-500/20">
          <div className="flex items-start gap-3">
            <Trophy className="w-6 h-6 text-orange-400 flex-shrink-0" />
            <div>
              <h4 className="text-white font-semibold mb-3">COMPETITIVE CHALLENGES:</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2" />
                  <span>Top performers win exclusive rewards</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2" />
                  <span>Leaderboards track real-time rankings</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2" />
                  <span>Pushes you to improve your skills</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-blue-500/10 border-blue-500/20">
        <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          UPCOMING CHALLENGES
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-900/30 border border-white/10">
            <span className="text-white">Weekly Paper Trading Contest</span>
            <Badge className="bg-blue-500/20 text-blue-300">Starts in 2 days</Badge>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-900/30 border border-white/10">
            <span className="text-white">Community Learning Goal: 10,000 Lessons</span>
            <Badge className="bg-green-500/20 text-green-300">Starts in 5 days</Badge>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-900/30 border border-white/10">
            <span className="text-white">Monthly Prediction Marathon</span>
            <Badge className="bg-purple-500/20 text-purple-300">Starts in 1 week</Badge>
          </div>
        </div>
      </Card>

      <div className="mt-6 text-center p-4 rounded-lg bg-gray-900/30 border border-white/5">
        <p className="text-xs text-gray-500">
          💡 New challenges every week - check back often for opportunities to win rewards!
        </p>
      </div>
    </Card>
  );
}
