import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Sun, TrendingUp, BookOpen, Target, Calendar } from 'lucide-react';

type DayType = 'monday' | 'tuesday' | 'fomc' | 'friday' | 'weekend';

interface HomeLayout {
  greeting: string;
  primaryWidget: string;
  secondaryWidgets: string[];
  accentColor: string;
  icon: JSX.Element;
}

const layouts: Record<DayType, HomeLayout> = {
  monday: {
    greeting: 'Fresh Start Monday - Weekly preview ready',
    primaryWidget: 'Weekly Preview',
    secondaryWidgets: ['Key Events Calendar', 'Top Opportunities', 'Weekend Learning Recap'],
    accentColor: 'from-blue-500 to-purple-500',
    icon: <Calendar className="w-6 h-6" />,
  },
  tuesday: {
    greeting: 'Deep Dive Tuesday - Tech sector in focus',
    primaryWidget: 'Sector Analysis: Technology',
    secondaryWidgets: ['NVDA Deep Dive', 'Pattern Scanner', 'Flow Analysis'],
    accentColor: 'from-green-500 to-blue-500',
    icon: <Target className="w-6 h-6" />,
  },
  fomc: {
    greeting: '🏛️ FED DAY - Minutes release at 14:00 UTC',
    primaryWidget: 'FOMC Preparation Dashboard',
    secondaryWidgets: ['Pre-Event Positioning', 'Scenario Analysis', 'Historical Reactions'],
    accentColor: 'from-yellow-500 to-orange-500',
    icon: <TrendingUp className="w-6 h-6" />,
  },
  friday: {
    greeting: 'Finale Friday - Weekly wrap-up time',
    primaryWidget: 'Weekly Performance Review',
    secondaryWidgets: ['What You Learned', 'Achievement Summary', 'Weekend Prep'],
    accentColor: 'from-purple-500 to-pink-500',
    icon: <BookOpen className="w-6 h-6" />,
  },
  weekend: {
    greeting: 'Learning Weekend - Markets closed, time to study',
    primaryWidget: 'Educational Dashboard',
    secondaryWidgets: ['Recommended Courses', 'Pattern Library', 'Trading Simulations'],
    accentColor: 'from-indigo-500 to-purple-500',
    icon: <Sun className="w-6 h-6" />,
  },
};

export function HomeScreenMorphing() {
  const [currentDay, setCurrentDay] = useState<DayType>('tuesday');
  const layout = layouts[currentDay];

  return (
    <Card className="p-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-white/10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          🏠 HOME SCREEN MORPHING
        </h2>
        <p className="text-sm text-gray-400">Dashboard adapts daily - never the same twice</p>
      </div>

      <Card
        className={`p-6 bg-gradient-to-r ${layout.accentColor}/20 border-2 ${layout.accentColor.split(' ')[1]}/30 mb-6`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-12 h-12 rounded-full bg-gradient-to-r ${layout.accentColor} flex items-center justify-center text-white`}
          >
            {layout.icon}
          </div>
          <div className="flex-1">
            <Badge
              className={`bg-gradient-to-r ${layout.accentColor} text-white border-0 mb-2`}
            >
              {currentDay.toUpperCase()}
            </Badge>
            <h3 className="text-xl font-bold text-white">{layout.greeting}</h3>
          </div>
        </div>

        <div className="space-y-3">
          <Card className="p-4 bg-black/20 border-white/10">
            <div className="text-xs text-gray-400 mb-2">PRIMARY WIDGET</div>
            <div className="text-white font-semibold flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              {layout.primaryWidget}
            </div>
          </Card>

          <Card className="p-4 bg-black/20 border-white/10">
            <div className="text-xs text-gray-400 mb-2">SECONDARY WIDGETS</div>
            <div className="space-y-2">
              {layout.secondaryWidgets.map((widget, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  {widget}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Card>

      <div className="grid grid-cols-5 gap-2 mb-6">
        {(Object.keys(layouts) as DayType[]).map((day) => (
          <Button
            key={day}
            onClick={() => setCurrentDay(day)}
            variant={day === currentDay ? 'default' : 'outline'}
            className={
              day === currentDay
                ? `bg-gradient-to-r ${layouts[day].accentColor} text-white border-0`
                : 'border-white/10 hover:bg-gray-900/50'
            }
          >
            {day === 'monday'
              ? '📅 Mon'
              : day === 'tuesday'
              ? '🎯 Tue'
              : day === 'fomc'
              ? '🏛️ FOMC'
              : day === 'friday'
              ? '📚 Fri'
              : '☀️ Week'}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="p-4 bg-purple-500/10 border-purple-500/20">
          <h4 className="text-white font-semibold mb-3 text-sm">MORPHING TRIGGERS:</h4>
          <div className="space-y-2 text-xs text-gray-300">
            <div>• Day of week</div>
            <div>• Major events (FOMC, OpEx)</div>
            <div>• Market conditions</div>
            <div>• Your activity patterns</div>
          </div>
        </Card>

        <Card className="p-4 bg-blue-500/10 border-blue-500/20">
          <h4 className="text-white font-semibold mb-3 text-sm">WHAT CHANGES:</h4>
          <div className="space-y-2 text-xs text-gray-300">
            <div>• Widget order & priority</div>
            <div>• Color scheme & accents</div>
            <div>• Greeting message</div>
            <div>• Featured content</div>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-gray-900/50 border-white/10">
        <h4 className="text-white font-semibold mb-4">REAL EXAMPLES:</h4>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <Badge className="bg-green-500/20 text-green-300 border-green-400/30 shrink-0">
              Monday
            </Badge>
            <div className="text-gray-300">
              Weekly preview first. Shows upcoming events, key levels to watch, top opportunities
              for the week.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30 shrink-0">
              FOMC
            </Badge>
            <div className="text-gray-300">
              Everything focuses on the event. Pre-positioning data, historical outcomes, scenario
              analysis takes priority.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30 shrink-0">
              Friday
            </Badge>
            <div className="text-gray-300">
              Recap mode. Shows your weekly performance, what you learned, achievements unlocked,
              weekend learning suggestions.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 shrink-0">
              Weekend
            </Badge>
            <div className="text-gray-300">
              Markets closed, so focus shifts to education. Courses, pattern studies, paper trading
              simulations take center stage.
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 text-center">
        <p className="text-sm text-gray-300">
          💡 <strong className="text-purple-300">Result:</strong> Your dashboard feels fresh every
          day, showing exactly what matters most right now.
        </p>
      </div>
    </Card>
  );
}
