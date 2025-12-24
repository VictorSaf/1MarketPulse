// Priority 1 Components - Essential Features
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp, Bell, Activity } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

export function WeeklyEvolution() {
  return (
    <Card className="glass-card border-purple-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-400" />
          Weekly Evolution Report
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20">
          <h3 className="font-semibold mb-3">Your Progress This Week</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Prediction Accuracy</span>
                <span className="text-white font-bold">67% (+9%)</span>
              </div>
              <Progress value={67} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Learning Progress</span>
                <span className="text-white font-bold">82% (+7%)</span>
              </div>
              <Progress value={82} className="h-2" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-3 rounded-lg bg-gray-800/50">
            <div className="text-2xl font-bold text-green-400">+34%</div>
            <div className="text-xs text-gray-400">Accuracy Up</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-gray-800/50">
            <div className="text-2xl font-bold text-blue-400">12</div>
            <div className="text-xs text-gray-400">Patterns Found</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-gray-800/50">
            <div className="text-2xl font-bold text-purple-400">+450 XP</div>
            <div className="text-xs text-gray-400">This Week</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AlertConfigurator() {
  return (
    <Card className="glass-card border-blue-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-400" />
          Alert Configurator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <h3 className="font-semibold mb-2">Create Smart Alert</h3>
          <p className="text-sm text-gray-400 mb-3">
            Set conditions based on multiple factors
          </p>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              When NVDA > $485 AND Volume > 2x
            </Button>
            <Button variant="outline" className="w-full justify-start">
              When VIX spikes > 20%
            </Button>
            <Button variant="outline" className="w-full justify-start">
              When Pattern detected
            </Button>
          </div>
        </div>
        <Button className="w-full">+ Create New Alert</Button>
      </CardContent>
    </Card>
  );
}
