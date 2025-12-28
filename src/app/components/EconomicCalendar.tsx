import { Calendar, Loader2, RefreshCw } from 'lucide-react';

import { useEconomicCalendar } from '@/hooks/useEconomicCalendar';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';


export function EconomicCalendar() {
  // Fetch real economic calendar data
  const { events, loading, error, refetch } = useEconomicCalendar({
    pollingInterval: 1800000 // Update every 30 minutes
  });
  const getImpactColor = (impact: string) => {
    if (impact === 'high') {return 'bg-red-500/20 text-red-300 border-red-400/30';}
    if (impact === 'medium') {return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30';}
    return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
  };

  return (
    <Card className="p-6 bg-gray-800/50 border-white/10 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/20">
            <Calendar className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Economic Calendar</h3>
            <p className="text-xs text-gray-400">Upcoming key events</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {loading && (
            <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
          )}
          {!loading && !error && (
            <Badge className="text-xs text-green-400" variant="outline">
              Live
            </Badge>
          )}
          <Button
            className="h-8 w-8 p-0"
            size="sm"
            variant="ghost"
            onClick={() => refetch()}
          >
            <RefreshCw className="w-4 h-4 text-gray-400" />
          </Button>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-400 p-4 rounded-lg bg-red-500/10 border border-red-500/20 mb-4">
          Failed to load economic calendar. Please try again later.
        </div>
      )}

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-3">
          {events.length === 0 && !loading && !error && (
            <div className="text-center text-gray-400 py-8">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No upcoming events</p>
            </div>
          )}
          {events.map((event) => (
            <div
              key={event.id}
              className="p-4 rounded-lg bg-gray-900/50 border border-white/5"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-blue-400">{event.time}</span>
                  <Badge className="bg-gray-700/50 text-gray-300 border-gray-600/30 text-xs">
                    {event.country}
                  </Badge>
                </div>
                <Badge className={`${getImpactColor(event.impact)} text-xs uppercase`}>
                  {event.impact}
                </Badge>
              </div>

              <h4 className="text-sm font-medium text-white mb-3">
                {event.event}
              </h4>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-500">Previous: </span>
                  <span className="text-gray-300">{event.previous}</span>
                </div>
                <div>
                  <span className="text-gray-500">Forecast: </span>
                  <span className="text-gray-300 font-medium">{event.forecast}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
