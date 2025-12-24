import { Calendar, TrendingUp } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';

interface CalendarEvent {
  id: string;
  time: string;
  event: string;
  impact: 'high' | 'medium' | 'low';
  country: string;
  previous: string;
  forecast: string;
}

interface EconomicCalendarProps {
  events: CalendarEvent[];
}

export function EconomicCalendar({ events }: EconomicCalendarProps) {
  const getImpactColor = (impact: string) => {
    if (impact === 'high') return 'bg-red-500/20 text-red-300 border-red-400/30';
    if (impact === 'medium') return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30';
    return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
  };

  return (
    <Card className="p-6 bg-gray-800/50 border-white/10 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-blue-500/20">
          <Calendar className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Economic Calendar</h3>
          <p className="text-xs text-gray-400">Today's key events</p>
        </div>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-3">
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
