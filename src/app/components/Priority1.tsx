// Priority 1 Components - Essential Features
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { Bell, Activity } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';

export function WeeklyEvolution() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <Card className="glass-card border-purple-500/20">
        <div className="animate-pulse p-6 space-y-4">
          <div className="h-6 bg-gray-800/50 rounded w-1/2" />
          <div className="h-24 bg-gray-800/50 rounded" />
          <div className="h-16 bg-gray-800/50 rounded" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-purple-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-400" />
          Weekly Evolution Report
          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30 text-xs">
            DEMO DATA
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20">
          <h3 className="font-semibold mb-3">Your Progress This Week</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Prediction Accuracy</span>
                <span className="text-white font-bold">67% (+9%) <span className="text-xs text-gray-500">(demo)</span></span>
              </div>
              <Progress className="h-2" value={67} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Learning Progress</span>
                <span className="text-white font-bold">82% (+7%) <span className="text-xs text-gray-500">(demo)</span></span>
              </div>
              <Progress className="h-2" value={82} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-3 rounded-lg bg-gray-800/50">
            <div className="text-2xl font-bold text-green-400">+34% <span className="text-xs text-gray-500">(demo)</span></div>
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
  const handleComingSoonClick = () => {
    toast.info('Alert configuration coming soon!', {
      description: 'This feature is under development.',
    });
  };

  return (
    <Card className="glass-card border-blue-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-400" />
          Alert Configurator
          <Badge className="bg-gray-500/20 text-gray-300 border-gray-400/30 text-xs">
            COMING SOON
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <h3 className="font-semibold mb-2">Create Smart Alert</h3>
          <p className="text-sm text-gray-400 mb-3">
            Set conditions based on multiple factors
          </p>
          <div className="space-y-2">
            <Button
              className="w-full justify-start opacity-50 cursor-not-allowed"
              variant="outline"
              disabled
              title="Coming Soon"
            >
              When NVDA {'>'} $485 AND Volume {'>'} 2x
            </Button>
            <Button
              className="w-full justify-start opacity-50 cursor-not-allowed"
              variant="outline"
              disabled
              title="Coming Soon"
            >
              When VIX spikes {'>'} 20%
            </Button>
            <Button
              className="w-full justify-start opacity-50 cursor-not-allowed"
              variant="outline"
              disabled
              title="Coming Soon"
            >
              When Pattern detected
            </Button>
          </div>
        </div>
        <Button
          className="w-full opacity-50 cursor-not-allowed"
          disabled
          title="Coming Soon"
          onClick={handleComingSoonClick}
        >
          + Create New Alert
        </Button>
      </CardContent>
    </Card>
  );
}
