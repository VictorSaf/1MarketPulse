import { Bell, Users, TrendingUp, Award, Zap, Info } from 'lucide-react';

import { Badge } from './ui/badge';
import { Card } from './ui/card';

// Community features require backend integration for real-time data
// TODO: Connect to backend WebSocket for live community stats and notifications

export function SocialProofNotifications() {
  return (
    <Card className="p-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-white/10">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              Community Intelligence
            </h2>
            <p className="text-sm text-gray-400">Connect with other traders</p>
          </div>
          <Badge className="bg-gray-500/20 text-gray-300 border-gray-400/30 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Coming Soon
          </Badge>
        </div>
      </div>

      {/* Placeholder content */}
      <div className="text-center py-12">
        <Users className="w-16 h-16 mx-auto mb-4 text-gray-600" />
        <h3 className="text-xl font-bold text-white mb-2">Community Features Coming Soon</h3>
        <p className="text-gray-400 mb-6 max-w-md mx-auto">
          Connect with other traders, see trending assets, and get community-driven insights.
          These features require real-time backend integration.
        </p>

        {/* Feature preview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-gray-900/50 border-white/10 text-center">
            <Users className="w-6 h-6 mx-auto mb-2 text-blue-400" />
            <div className="text-xs text-gray-400">Live</div>
            <div className="text-sm text-white">Online Users</div>
          </Card>
          <Card className="p-4 bg-gray-900/50 border-white/10 text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-400" />
            <div className="text-xs text-gray-400">Real-time</div>
            <div className="text-sm text-white">Trending Assets</div>
          </Card>
          <Card className="p-4 bg-gray-900/50 border-white/10 text-center">
            <Award className="w-6 h-6 mx-auto mb-2 text-purple-400" />
            <div className="text-xs text-gray-400">Global</div>
            <div className="text-sm text-white">Rankings</div>
          </Card>
          <Card className="p-4 bg-gray-900/50 border-white/10 text-center">
            <Bell className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
            <div className="text-xs text-gray-400">Smart</div>
            <div className="text-sm text-white">Notifications</div>
          </Card>
        </div>
      </div>

      <Card className="p-4 bg-blue-500/10 border-blue-500/20">
        <div className="flex items-center gap-3">
          <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />
          <p className="text-sm text-gray-400">
            Community features require WebSocket integration for real-time updates.
            All data will be anonymized and aggregated for privacy.
          </p>
        </div>
      </Card>
    </Card>
  );
}
