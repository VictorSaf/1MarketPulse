import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp } from 'lucide-react';

export function WeeklyEvolution() {
  return (
    <Card className="p-8 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-white/10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">📊 WEEKLY EVOLUTION</h2>
        <p className="text-sm text-gray-400">Your progress over the past week</p>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Prediction Accuracy</span>
            <Badge className="bg-green-500/20 text-green-300">+9%</Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full" style={{width: '67%'}} />
            </div>
            <span className="text-white font-semibold">67%</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Learning Progress</span>
            <Badge className="bg-blue-500/20 text-blue-300">+7%</Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{width: '82%'}} />
            </div>
            <span className="text-white font-semibold">82%</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Pattern Recognition</span>
            <Badge className="bg-purple-500/20 text-purple-300">+12%</Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{width: '75%'}} />
            </div>
            <span className="text-white font-semibold">75%</span>
          </div>
        </div>
      </div>

      <Card className="mt-6 p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-green-400" />
          <div>
            <div className="text-white font-semibold">Great Progress!</div>
            <div className="text-sm text-gray-400">You improved in all areas this week</div>
          </div>
        </div>
      </Card>
    </Card>
  );
}
