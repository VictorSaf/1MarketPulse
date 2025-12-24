import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Bell, Users, TrendingUp, Award, Zap } from 'lucide-react';

interface Notification {
  id: string;
  type: 'milestone' | 'community' | 'achievement' | 'performance' | 'streak';
  icon: string;
  message: string;
  context: string;
  timeAgo: string;
  relevant: boolean;
}

const notifications: Notification[] = [
  {
    id: '1',
    type: 'milestone',
    icon: '🎯',
    message: 'A trader at your level just made their first correct NVDA prediction',
    context: 'You have 3 correct predictions already!',
    timeAgo: '5 min ago',
    relevant: true,
  },
  {
    id: '2',
    type: 'performance',
    icon: '📈',
    message: 'Traders who completed the same course as you have 67% accuracy on patterns',
    context: "You're at 72%! Above average!",
    timeAgo: '1 hour ago',
    relevant: true,
  },
  {
    id: '3',
    type: 'community',
    icon: '🇷🇴',
    message: '12 traders from Romania are online now',
    context: '3 are watching NVDA, like you',
    timeAgo: '2 hours ago',
    relevant: true,
  },
  {
    id: '4',
    type: 'achievement',
    icon: '🏆',
    message: 'Someone who started on the same day as you just reached Level 10',
    context: "You're at Level 8 - you're close!",
    timeAgo: '3 hours ago',
    relevant: true,
  },
  {
    id: '5',
    type: 'streak',
    icon: '🔥',
    message: 'Traders with 12+ day streaks (like you) have 23% better accuracy',
    context: 'Keep your streak going!',
    timeAgo: '5 hours ago',
    relevant: true,
  },
];

const communityStats = {
  online: 1247,
  activeToday: 3842,
  yourRank: 156,
  totalUsers: 12847,
};

const trending = [
  { asset: 'NVDA', watchers: 234, change: '+45 in last hour' },
  { asset: 'BTC', watchers: 189, change: '+32 in last hour' },
  { asset: 'TSLA', watchers: 156, change: '+18 in last hour' },
];

export function SocialProofNotifications() {
  return (
    <Card className="p-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-white/10">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              👥 COMMUNITY INTELLIGENCE
            </h2>
            <p className="text-sm text-gray-400">
              {communityStats.online.toLocaleString()} traders online now
            </p>
          </div>
          <Badge className="bg-green-500/20 text-green-300 border-green-400/30">
            <Bell className="w-3 h-3 mr-1" />
            5 new
          </Badge>
        </div>
      </div>

      {/* Community Overview */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card className="p-4 bg-gray-900/50 border-white/5 text-center">
          <Users className="w-5 h-5 text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white mb-1">
            {communityStats.online.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">Online now</div>
        </Card>
        <Card className="p-4 bg-gray-900/50 border-white/5 text-center">
          <TrendingUp className="w-5 h-5 text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white mb-1">
            {communityStats.activeToday.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">Active today</div>
        </Card>
        <Card className="p-4 bg-gray-900/50 border-white/5 text-center">
          <Award className="w-5 h-5 text-purple-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white mb-1">#{communityStats.yourRank}</div>
          <div className="text-xs text-gray-400">Your rank</div>
        </Card>
        <Card className="p-4 bg-gray-900/50 border-white/5 text-center">
          <Zap className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white mb-1">Top 2%</div>
          <div className="text-xs text-gray-400">Activity</div>
        </Card>
      </div>

      {/* Relevant Notifications */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-400" />
          RELEVANT UPDATES
        </h3>
        <div className="space-y-3">
          {notifications.map((notif) => (
            <Card
              key={notif.id}
              className="p-4 bg-gradient-to-r from-blue-500/5 to-purple-500/5 border-blue-500/20 hover:bg-blue-500/10 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">{notif.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-white mb-2">{notif.message}</div>
                  <div className="text-sm font-semibold text-blue-400 mb-2">{notif.context}</div>
                  <div className="text-xs text-gray-500">{notif.timeAgo}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Trending Assets */}
      <Card className="p-6 bg-gray-900/50 border-white/10 mb-8">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          🔥 TRENDING IN COMMUNITY
        </h3>
        <div className="space-y-3">
          {trending.map((item, index) => (
            <div
              key={item.asset}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-900/30 border border-white/5"
            >
              <div className="flex items-center gap-3">
                <Badge className="bg-orange-500/20 text-orange-300 border-orange-400/30">
                  #{index + 1}
                </Badge>
                <div>
                  <div className="text-white font-semibold">{item.asset}</div>
                  <div className="text-xs text-gray-400">{item.change}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-semibold">{item.watchers}</div>
                <div className="text-xs text-gray-400">watching</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Community Sentiment */}
      <Card className="p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
        <h3 className="text-white font-semibold mb-4">COMMUNITY SENTIMENT TODAY:</h3>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-300">Overall market view:</span>
              <span className="text-green-400 font-semibold">72% Bullish</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 w-full relative">
                <div
                  className="absolute top-0 right-[28%] w-1 h-full bg-white"
                  title="Community position"
                />
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-400 mt-4">
            Most watched: NVDA (234), BTC (189), TSLA (156)
            <br />
            Most predicted: Tech sector rally continues
          </div>
        </div>
      </Card>

      {/* Privacy Note */}
      <div className="mt-6 p-4 rounded-lg bg-gray-900/30 border border-white/5 text-center">
        <div className="text-xs text-gray-500">
          🔒 All notifications are anonymized and aggregated. No personal data is shared.
        </div>
      </div>
    </Card>
  );
}
