import { Bell, Plus } from 'lucide-react';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';


export function AlertConfigurator() {
  const alerts = [
    { name: 'NVDA > $500', status: 'active', type: 'price' },
    { name: 'VIX Spike > 20', status: 'active', type: 'volatility' },
    { name: 'Volume > 2x Avg', status: 'paused', type: 'volume' },
  ];

  return (
    <Card className="p-8 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-white/10">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <Bell className="w-6 h-6" />
              ALERT CONFIGURATOR
            </h2>
            <p className="text-sm text-gray-400">Custom market alerts and notifications</p>
          </div>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-500">
            <Plus className="w-4 h-4 mr-2" />
            New Alert
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {alerts.map((alert, i) => (
          <Card key={i} className="p-4 bg-gray-900/50 border-white/10 hover:bg-gray-900/70 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className={`w-5 h-5 ${alert.status === 'active' ? 'text-green-400' : 'text-gray-500'}`} />
                <div>
                  <div className="text-white font-semibold">{alert.name}</div>
                  <div className="text-xs text-gray-500">Type: {alert.type}</div>
                </div>
              </div>
              <Badge className={alert.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-400'}>
                {alert.status}
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <Card className="p-4 bg-blue-500/10 border-blue-500/20 text-center">
          <div className="text-2xl font-bold text-blue-400">3</div>
          <div className="text-xs text-gray-400">Active</div>
        </Card>
        <Card className="p-4 bg-green-500/10 border-green-500/20 text-center">
          <div className="text-2xl font-bold text-green-400">12</div>
          <div className="text-xs text-gray-400">Triggered</div>
        </Card>
        <Card className="p-4 bg-purple-500/10 border-purple-500/20 text-center">
          <div className="text-2xl font-bold text-purple-400">89%</div>
          <div className="text-xs text-gray-400">Accuracy</div>
        </Card>
      </div>
    </Card>
  );
}
