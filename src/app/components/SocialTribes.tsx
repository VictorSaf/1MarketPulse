import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Users, TrendingUp, Award, MessageCircle, Crown, Flame } from 'lucide-react';

interface Tribe {
  id: string;
  name: string;
  icon: string;
  description: string;
  members: number;
  focus: string;
  avgAccuracy: number;
  topPerformer: string;
  yourRank?: number;
  activity: 'high' | 'medium' | 'low';
}

interface CommunityMember {
  username: string;
  avatar: string;
  level: number;
  accuracy: number;
  streak: number;
  prediction: string;
  timeAgo: string;
}

const tribes: Tribe[] = [
  {
    id: 'nvda',
    name: 'NVDA Hunters',
    icon: '🎯',
    description: 'Focused on semiconductor and AI stocks',
    members: 2847,
    focus: 'Tech/AI',
    avgAccuracy: 68,
    topPerformer: '@ChipMaster',
    yourRank: 12,
    activity: 'high',
  },
  {
    id: 'crypto',
    name: 'Crypto Warriors',
    icon: '⚡',
    description: 'Bitcoin, Ethereum, and altcoin traders',
    members: 4521,
    focus: 'Crypto',
    avgAccuracy: 61,
    topPerformer: '@SatoshiDreams',
    activity: 'high',
  },
  {
    id: 'macro',
    name: 'Macro Minds',
    icon: '🌍',
    description: 'Global markets and economic trends',
    members: 1834,
    focus: 'Economics',
    avgAccuracy: 72,
    topPerformer: '@EconGuru',
    activity: 'medium',
  },
  {
    id: 'options',
    name: 'Options Elite',
    icon: '🎲',
    description: 'Advanced options strategies',
    members: 892,
    focus: 'Options',
    avgAccuracy: 75,
    topPerformer: '@ThetaGang',
    activity: 'medium',
  },
];

const recentActivity: CommunityMember[] = [
  {
    username: '@PatternMaster',
    avatar: '🦊',
    level: 34,
    accuracy: 74,
    streak: 8,
    prediction: 'NVDA breaks $500 this week. Accumulation complete.',
    timeAgo: '5m ago',
  },
  {
    username: '@TechBull',
    avatar: '🦁',
    level: 28,
    accuracy: 68,
    streak: 12,
    prediction: 'SPX consolidation before next leg up. Watch 4800.',
    timeAgo: '15m ago',
  },
  {
    username: '@CryptoWizard',
    avatar: '⚡',
    level: 31,
    accuracy: 71,
    streak: 5,
    prediction: 'BTC forming ascending triangle. Breakout imminent.',
    timeAgo: '23m ago',
  },
];

export function SocialTribes() {
  const [selectedTribe, setSelectedTribe] = useState<Tribe | null>(null);
  const [activeView, setActiveView] = useState<'tribes' | 'community' | 'mentors'>('tribes');

  const getActivityColor = (activity: string) => {
    switch (activity) {
      case 'high':
        return 'bg-green-500/20 text-green-300 border-green-400/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30';
      case 'low':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-white/10 backdrop-blur-sm">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            👥 COMMUNITY & TRIBES
          </h2>
          <p className="text-sm text-gray-400">Connect, learn, and grow together</p>
        </div>

        {/* View Selector */}
        <div className="flex justify-center gap-2 mb-8">
          {(['tribes', 'community', 'mentors'] as const).map((view) => (
            <Button
              key={view}
              onClick={() => setActiveView(view)}
              className={`${
                activeView === view
                  ? 'bg-blue-500/30 text-blue-300 border-2 border-blue-400/50'
                  : 'bg-gray-800/50 text-gray-400 border border-white/10'
              }`}
            >
              {view === 'tribes' && <Users className="w-4 h-4 mr-2" />}
              {view === 'community' && <MessageCircle className="w-4 h-4 mr-2" />}
              {view === 'mentors' && <Crown className="w-4 h-4 mr-2" />}
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </Button>
          ))}
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">12,847</div>
            <div className="text-xs text-gray-400">Traders Online</div>
          </div>
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">72%</div>
            <div className="text-xs text-gray-400">Community Bullish</div>
          </div>
          <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30 text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">4</div>
            <div className="text-xs text-gray-400">Active Tribes</div>
          </div>
          <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">89</div>
            <div className="text-xs text-gray-400">Predictions Today</div>
          </div>
        </div>

        {/* Tribes View */}
        {activeView === 'tribes' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Your Tribes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tribes.map((tribe) => (
                  <button
                    key={tribe.id}
                    onClick={() => setSelectedTribe(tribe)}
                    className="p-6 rounded-lg border-2 text-left transition-all hover:scale-105 bg-gray-900/50 border-white/10 hover:border-blue-400/50"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-4xl">{tribe.icon}</div>
                        <div>
                          <div className="text-lg font-bold text-white mb-1">
                            {tribe.name}
                          </div>
                          <Badge className={getActivityColor(tribe.activity)}>
                            {tribe.activity} activity
                          </Badge>
                        </div>
                      </div>
                      {tribe.yourRank && (
                        <Badge className="bg-purple-500/20 text-purple-300">
                          #{tribe.yourRank}
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-gray-400 mb-4">{tribe.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Members</div>
                        <div className="text-sm font-semibold text-white">
                          {tribe.members.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Avg Accuracy</div>
                        <div className="text-sm font-semibold text-green-400">
                          {tribe.avgAccuracy}%
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Top: {tribe.topPerformer}</span>
                      <Badge className="bg-blue-500/20 text-blue-300">{tribe.focus}</Badge>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Join New Tribe */}
            <div className="p-6 rounded-lg bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-blue-500/20">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-6 h-6 text-blue-400" />
                <h3 className="text-lg font-bold text-white">Discover More Tribes</h3>
              </div>
              <p className="text-sm text-gray-300 mb-4">
                Find traders who share your interests and learn from their strategies
              </p>
              <Button className="bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30">
                Explore All Tribes
              </Button>
            </div>
          </div>
        )}

        {/* Community Feed */}
        {activeView === 'community' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((member, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-gray-900/50 border border-white/10 hover:bg-gray-900/70 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{member.avatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold text-white">{member.username}</span>
                          <Badge className="bg-purple-500/20 text-purple-300">
                            Lv {member.level}
                          </Badge>
                          <Badge className="bg-green-500/20 text-green-300">
                            {member.accuracy}% accurate
                          </Badge>
                          {member.streak >= 5 && (
                            <Badge className="bg-orange-500/20 text-orange-300">
                              <Flame className="w-3 h-3 mr-1" />
                              {member.streak} streak
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-300 mb-2">{member.prediction}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{member.timeAgo}</span>
                          <button className="hover:text-blue-400 transition-colors">
                            💬 Comment
                          </button>
                          <button className="hover:text-green-400 transition-colors">
                            👍 Agree (234)
                          </button>
                          <button className="hover:text-red-400 transition-colors">
                            👎 Disagree (45)
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Post Your Prediction */}
            <div className="p-6 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
              <h3 className="text-lg font-bold text-white mb-4">Share Your Prediction</h3>
              <textarea
                placeholder="What's your market call? Share your analysis..."
                className="w-full p-4 rounded-lg bg-gray-900/50 border border-white/10 text-white placeholder-gray-500 mb-3 resize-none"
                rows={3}
              />
              <Button className="bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30">
                Post Prediction
              </Button>
            </div>
          </div>
        )}

        {/* Mentors */}
        {activeView === 'mentors' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Top Mentors</h3>
              <p className="text-sm text-gray-400 mb-6">
                Learn from experienced traders with verified track records
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    name: '@PatternMaster',
                    avatar: '🦊',
                    level: 34,
                    accuracy: 74,
                    students: 23,
                    specialty: 'Pattern Recognition',
                    monthlyReturn: 12.3,
                  },
                  {
                    name: '@TechGuru',
                    avatar: '🦁',
                    level: 42,
                    accuracy: 78,
                    students: 45,
                    specialty: 'Tech Stocks',
                    monthlyReturn: 15.7,
                  },
                  {
                    name: '@MacroMind',
                    avatar: '🦉',
                    level: 38,
                    accuracy: 81,
                    students: 34,
                    specialty: 'Global Markets',
                    monthlyReturn: 9.8,
                  },
                  {
                    name: '@OptionsWizard',
                    avatar: '🐉',
                    level: 40,
                    accuracy: 76,
                    students: 18,
                    specialty: 'Options Trading',
                    monthlyReturn: 18.2,
                  },
                ].map((mentor, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-4xl">{mentor.avatar}</div>
                        <div>
                          <div className="font-bold text-white mb-1">{mentor.name}</div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-yellow-500/20 text-yellow-300">
                              <Crown className="w-3 h-3 mr-1" />
                              Mentor
                            </Badge>
                            <Badge className="bg-purple-500/20 text-purple-300">
                              Lv {mentor.level}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Accuracy</span>
                        <span className="text-sm font-bold text-green-400">
                          {mentor.accuracy}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Monthly Return</span>
                        <span className="text-sm font-bold text-green-400">
                          +{mentor.monthlyReturn}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Students</span>
                        <span className="text-sm font-bold text-blue-400">
                          {mentor.students}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Specialty</span>
                        <Badge className="bg-blue-500/20 text-blue-300 text-xs">
                          {mentor.specialty}
                        </Badge>
                      </div>
                    </div>

                    <Button className="w-full bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30">
                      Request Mentorship
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Your Mentor */}
            <div className="p-6 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
              <div className="flex items-start gap-4">
                <div className="text-5xl">🦊</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-white">Your Mentor</h3>
                    <Badge className="bg-yellow-500/20 text-yellow-300">
                      <Crown className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  <div className="font-semibold text-purple-400 mb-3">@TechTrader</div>
                  <p className="text-sm text-gray-300 mb-4">
                    "Your pattern recognition skills are improving. Keep focusing on volume
                    confirmation. Great job on the NVDA call!"
                  </p>
                  <div className="flex gap-3">
                    <Button
                      size="sm"
                      className="bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30"
                    >
                      💬 Send Message
                    </Button>
                    <Button
                      size="sm"
                      className="bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30"
                    >
                      📊 View Activity
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Selected Tribe Detail */}
      {selectedTribe && (
        <Card className="p-6 bg-gray-800/50 border-white/10">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{selectedTribe.icon}</div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">{selectedTribe.name}</h3>
                <p className="text-sm text-gray-400">{selectedTribe.description}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedTribe(null)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <div className="text-sm text-gray-400 mb-1">Total Members</div>
              <div className="text-2xl font-bold text-white">
                {selectedTribe.members.toLocaleString()}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
              <div className="text-sm text-gray-400 mb-1">Avg Accuracy</div>
              <div className="text-2xl font-bold text-green-400">
                {selectedTribe.avgAccuracy}%
              </div>
            </div>
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
              <div className="text-sm text-gray-400 mb-1">Your Rank</div>
              <div className="text-2xl font-bold text-purple-400">
                #{selectedTribe.yourRank || 'N/A'}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-gray-900/50 border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-yellow-400" />
                <h4 className="text-sm font-semibold text-white">Top Performer</h4>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">{selectedTribe.topPerformer}</span>
                <Badge className="bg-yellow-500/20 text-yellow-300">
                  🥇 #1 this month
                </Badge>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <h4 className="text-sm font-semibold text-blue-300">Tribe Performance</h4>
              </div>
              <p className="text-sm text-gray-300">
                Members of {selectedTribe.name} have an average accuracy of{' '}
                {selectedTribe.avgAccuracy}% over the last 30 days. The tribe specializes in{' '}
                {selectedTribe.focus} trading strategies.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
