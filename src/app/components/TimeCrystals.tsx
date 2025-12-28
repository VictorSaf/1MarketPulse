import { useState } from 'react';

import { Clock, Zap, TrendingUp, Calendar } from 'lucide-react';

import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Progress } from './ui/progress';


interface TimeSlot {
  period: string;
  time: string;
  energy: number; // 0-100
  description: string;
  currentPosition?: boolean;
}

interface DayEnergy {
  day: string;
  energy: number;
  label: string;
  isToday?: boolean;
}

const dailyTimeSlots: TimeSlot[] = [
  {
    period: 'PRE',
    time: '4-9:30',
    energy: 30,
    description: 'Low volume',
  },
  {
    period: 'OPEN',
    time: '9:30-11',
    energy: 90,
    description: 'High energy zone',
    currentPosition: true,
  },
  {
    period: 'MID',
    time: '11-14',
    energy: 60,
    description: 'YOU ARE HERE',
  },
  {
    period: 'POWER',
    time: '14-15',
    energy: 95,
    description: 'FOMC SPIKE ZONE',
  },
  {
    period: 'CLOSE',
    time: '15-16',
    energy: 85,
    description: 'Usually strong finish',
  },
  {
    period: 'AFTER',
    time: '16+',
    energy: 25,
    description: 'Low volume',
  },
];

const weeklyEnergy: DayEnergy[] = [
  { day: 'MON', energy: 40, label: 'weak' },
  { day: 'TUE', energy: 50, label: 'soft' },
  { day: 'WED', energy: 90, label: 'high', isToday: true },
  { day: 'THU', energy: 85, label: 'high cat.' },
  { day: 'FRI', energy: 55, label: 'OpEx wild' },
];

const monthlyEnergy = [
  { week: 'Week 1', energy: 45, label: 'Post-expiration lull' },
  { week: 'Week 2', energy: 70, label: 'Building momentum' },
  { week: 'Week 3', energy: 90, label: 'Peak activity', isCurrent: true },
  { week: 'Week 4', energy: 75, label: 'Pre-expiration positioning' },
];

export function TimeCrystals() {
  const [activeView, setActiveView] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const getEnergyColor = (energy: number) => {
    if (energy >= 80) {return 'bg-purple-500';}
    if (energy >= 60) {return 'bg-blue-500';}
    if (energy >= 40) {return 'bg-yellow-500';}
    return 'bg-gray-500';
  };

  const getEnergyGlow = (energy: number) => {
    if (energy >= 80) {return 'shadow-[0_0_20px_rgba(168,85,247,0.5)]';}
    if (energy >= 60) {return 'shadow-[0_0_20px_rgba(59,130,246,0.5)]';}
    if (energy >= 40) {return 'shadow-[0_0_20px_rgba(234,179,8,0.5)]';}
    return '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-8 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-white/10 backdrop-blur-sm">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            💎 TIME CRYSTAL - Energy Flow
          </h2>
          <p className="text-sm text-gray-400">
            How energy changes throughout the day, week, and month
          </p>
        </div>

        {/* View Selector */}
        <div className="flex justify-center gap-2 mb-8">
          {(['daily', 'weekly', 'monthly'] as const).map((view) => (
            <button
              key={view}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                activeView === view
                  ? 'bg-purple-500/30 text-purple-300 border-2 border-purple-400/50'
                  : 'bg-gray-800/50 text-gray-400 border border-white/10 hover:bg-gray-800/70'
              }`}
              onClick={() => setActiveView(view)}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>

        {/* Daily Crystal */}
        {activeView === 'daily' && (
          <div className="space-y-6">
            <div className="flex items-center justify-center mb-4">
              <Clock className="w-5 h-5 text-purple-400 mr-2" />
              <span className="text-sm text-purple-300 font-semibold">
                Daily Energy Flow
              </span>
            </div>

            {/* Time Slots */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {dailyTimeSlots.map((slot, index) => (
                <div
                  key={index}
                  className={`relative p-4 rounded-lg border transition-all ${
                    slot.currentPosition
                      ? 'bg-blue-500/20 border-blue-400/50 scale-105'
                      : 'bg-gray-900/50 border-white/10 hover:bg-gray-900/70'
                  }`}
                >
                  <div className="text-center mb-3">
                    <div className="text-xs text-purple-400 font-bold mb-1">
                      {slot.period}
                    </div>
                    <div className="text-xs text-gray-400">{slot.time}</div>
                  </div>

                  {/* Energy Crystal */}
                  <div className="flex justify-center mb-3">
                    <div
                      className={`w-16 h-16 rounded-lg ${getEnergyColor(
                        slot.energy
                      )} ${getEnergyGlow(slot.energy)} transition-all`}
                      style={{ opacity: slot.energy / 100 }}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <Zap className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-xs text-gray-300 mb-1">
                      {slot.description}
                    </div>
                    {slot.currentPosition && (
                      <div className="text-xs text-blue-400 font-semibold">↑</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Current Reading */}
            <div className="p-6 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
              <div className="flex items-start gap-4">
                <div className="text-4xl">💎</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-purple-300 mb-2">
                    CRYSTAL READING
                  </h3>
                  <p className="text-sm text-gray-300">
                    "You're in the calm mid-day period. Energy builds toward 14:00 when
                    FOMC minutes drop. Best action: position BEFORE 13:30."
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Weekly Crystal */}
        {activeView === 'weekly' && (
          <div className="space-y-6">
            <div className="flex items-center justify-center mb-4">
              <Calendar className="w-5 h-5 text-blue-400 mr-2" />
              <span className="text-sm text-blue-300 font-semibold">Weekly Energy Flow</span>
            </div>

            <div className="grid grid-cols-5 gap-4">
              {weeklyEnergy.map((day, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-lg border text-center transition-all ${
                    day.isToday
                      ? 'bg-blue-500/20 border-blue-400/50 scale-105'
                      : 'bg-gray-900/50 border-white/10'
                  }`}
                >
                  <div className="text-sm font-bold text-white mb-2">{day.day}</div>
                  
                  {/* Energy Bar */}
                  <div className="mb-3">
                    <div className="w-full h-24 bg-gray-800/50 rounded-lg overflow-hidden relative">
                      <div
                        className={`absolute bottom-0 left-0 right-0 ${getEnergyColor(
                          day.energy
                        )} ${getEnergyGlow(day.energy)} transition-all duration-500`}
                        style={{ height: `${day.energy}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-xs text-gray-400">{day.label}</div>
                  {day.isToday && (
                    <div className="text-xs text-blue-400 font-semibold mt-2">
                      ← ● TODAY
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-6 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
              <p className="text-sm text-gray-300 text-center">
                💡 <span className="font-semibold text-blue-300">Weekly Pattern:</span> Energy
                peaks mid-week (Wed-Thu) with highest catalysts. Friday can be wild due to
                options expiration.
              </p>
            </div>
          </div>
        )}

        {/* Monthly Crystal */}
        {activeView === 'monthly' && (
          <div className="space-y-6">
            <div className="flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
              <span className="text-sm text-green-300 font-semibold">
                Monthly Energy Cycle
              </span>
            </div>

            <div className="space-y-4">
              {monthlyEnergy.map((week, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-lg border ${
                    week.isCurrent
                      ? 'bg-green-500/10 border-green-400/30'
                      : 'bg-gray-900/50 border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="text-sm font-semibold text-white min-w-[80px]">
                      {week.week}
                    </div>
                    <div className="flex-1">
                      <Progress className="h-3" value={week.energy} />
                    </div>
                    <div className="text-sm font-bold text-purple-400 min-w-[50px] text-right">
                      {week.energy}%
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-400">{week.label}</div>
                    {week.isCurrent && (
                      <Badge className="bg-green-500/20 text-green-300 border-green-400/30">
                        ← WE ARE HERE
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-lg bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20">
              <p className="text-sm text-gray-300 text-center">
                💡 <span className="font-semibold text-green-300">Monthly Pattern:</span> Week 3
                typically shows peak activity as institutional positioning intensifies before
                options expiration in Week 4.
              </p>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="text-xs text-gray-400 text-center mb-3">ENERGY LEVELS</div>
          <div className="flex justify-center gap-4 flex-wrap">
            {[
              { label: 'Very Low', color: 'bg-gray-500', range: '0-40%' },
              { label: 'Moderate', color: 'bg-yellow-500', range: '40-60%' },
              { label: 'High', color: 'bg-blue-500', range: '60-80%' },
              { label: 'Very High', color: 'bg-purple-500', range: '80-100%' },
            ].map((level, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded ${level.color}`} />
                <div className="text-xs text-gray-400">
                  {level.label} <span className="text-gray-500">({level.range})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
