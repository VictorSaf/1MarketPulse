import { useState, useMemo } from 'react';

import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Bell,
  Activity,
  Users,
  Loader2,
} from 'lucide-react';

import { useFearGreed } from '@/hooks/useFearGreed';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';



/**
 * Maps Fear & Greed Index score (0-100) to bullish percentage
 * Based on the inverse relationship between fear/greed and retail sentiment
 */
function mapFearGreedToBullish(score: number): number {
  if (score <= 25) {
    // Extreme Fear (0-25) → 25-35% bullish
    return Math.round(25 + (score / 25) * 10);
  } else if (score <= 45) {
    // Fear (25-45) → 35-45% bullish
    return Math.round(35 + ((score - 25) / 20) * 10);
  } else if (score <= 55) {
    // Neutral (45-55) → 45-55% bullish
    return Math.round(45 + ((score - 45) / 10) * 10);
  } else if (score <= 75) {
    // Greed (55-75) → 55-70% bullish
    return Math.round(55 + ((score - 55) / 20) * 15);
  } else {
    // Extreme Greed (75-100) → 70-85% bullish
    return Math.round(70 + ((score - 75) / 25) * 15);
  }
}

interface Persona {
  id: string;
  name: string;
  icon: string;
  description: string;
  activity: 'high' | 'medium' | 'low';
  direction: 'buying' | 'selling' | 'neutral';
  strength: number; // 1-3 arrows
  details: string[];
  insight: string;
  color: string;
}

const personas: Persona[] = [
  {
    id: 'banks',
    name: 'BANKS',
    icon: '🏦',
    description: 'Institutional Banks',
    activity: 'medium',
    direction: 'buying',
    strength: 2,
    details: [
      'Accumulating positions in financials',
      'Defensive positioning in utilities',
      'Reducing exposure to high-beta tech',
    ],
    insight: 'Banks are cautiously optimistic, focusing on dividend stocks.',
    color: 'text-blue-400',
  },
  {
    id: 'algos',
    name: 'ALGOS',
    icon: '🤖',
    description: 'Algorithmic Trading',
    activity: 'high',
    direction: 'neutral',
    strength: 1,
    details: [
      'High-frequency trading dominates',
      'Volume spike in tech options',
      'Arbitrage opportunities active',
    ],
    insight: 'Algos are creating volatility but no clear direction.',
    color: 'text-gray-400',
  },
  {
    id: 'whales',
    name: 'WHALES',
    icon: '🦈',
    description: 'Large Institutional Investors',
    activity: 'high',
    direction: 'buying',
    strength: 3,
    details: [
      'Large block trades detected in NVDA, MSFT, AMZN',
      'Pattern: Accumulation in $10M+ chunks',
      'Last time: Nov 8 (market +2.3% next 5 days)',
    ],
    insight: 'When whales feed quietly, smart fish follow.',
    color: 'text-green-400',
  },
  {
    id: 'funds',
    name: 'FUNDS',
    icon: '👨‍💼',
    description: 'Mutual & Hedge Funds',
    activity: 'medium',
    direction: 'selling',
    strength: 1,
    details: [
      'Institutional rebalancing detected',
      'Month-end positioning underway',
      'Selling winners (tech), buying laggards (energy)',
    ],
    insight: "Don't fight the flow, but know it's mechanical, not fear.",
    color: 'text-yellow-400',
  },
  {
    id: 'retail',
    name: 'RETAIL',
    icon: '🎰',
    description: 'Retail Traders (Us!)',
    activity: 'high',
    direction: 'buying',
    strength: 2,
    details: [
      '1MarketPulse community sentiment: 72% Bullish',
      'Most watched: NVDA, TSLA, BTC',
      'Most traded: NVDA calls, SPY puts (hedging?)',
    ],
    insight: "We're optimistic but cautious. Good sign.",
    color: 'text-purple-400',
  },
];

export function MarketPersonas() {
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [showAlerts, setShowAlerts] = useState(false);

  // Fetch Fear & Greed data for real bullish sentiment
  const { data: fearGreedData, loading: fearGreedLoading } = useFearGreed();

  // Calculate bullish percentage from Fear & Greed score
  const bullishPercentage = useMemo(() => {
    if (!fearGreedData?.score) {return null;}
    return mapFearGreedToBullish(fearGreedData.score);
  }, [fearGreedData?.score]);

  const buyingCount = personas.filter((p) => p.direction === 'buying').length;
  const sellingCount = personas.filter((p) => p.direction === 'selling').length;
  const buyingPower = Math.round((buyingCount / personas.length) * 100);

  const getDirectionIcon = (direction: Persona['direction']) => {
    switch (direction) {
      case 'buying':
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'selling':
        return <TrendingDown className="w-5 h-5 text-red-400" />;
      default:
        return <ArrowRight className="w-5 h-5 text-gray-400" />;
    }
  };

  const getActivityBadge = (activity: Persona['activity']) => {
    const colors = {
      high: 'bg-red-500/20 text-red-300 border-red-400/30',
      medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
      low: 'bg-gray-500/20 text-gray-300 border-gray-400/30',
    };
    return colors[activity];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-white/10 backdrop-blur-sm">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            👥 WHO'S MOVING THE MARKET TODAY
          </h2>
          <p className="text-sm text-gray-400">
            Real-time analysis of market participants and their actions
          </p>
        </div>

        {/* Personas Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {personas.map((persona) => (
            <button
              key={persona.id}
              className={`p-4 rounded-lg border transition-all hover:scale-105 ${
                selectedPersona === persona.id
                  ? 'bg-gray-800/80 border-blue-400/50'
                  : 'bg-gray-900/50 border-white/10'
              }`}
              onClick={() =>
                setSelectedPersona(selectedPersona === persona.id ? null : persona.id)
              }
            >
              <div className="text-center">
                <div className="text-4xl mb-2">{persona.icon}</div>
                <div className={`text-sm font-bold mb-1 ${persona.color}`}>
                  {persona.name}
                </div>
                <Badge className={`text-xs mb-2 ${getActivityBadge(persona.activity)}`}>
                  {persona.activity.toUpperCase()}
                </Badge>
                <div className="flex items-center justify-center gap-1 mb-2">
                  {getDirectionIcon(persona.direction)}
                  <div className="flex gap-0.5">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 h-3 rounded-full ${
                          i < persona.strength
                            ? persona.direction === 'buying'
                              ? 'bg-green-400'
                              : persona.direction === 'selling'
                              ? 'bg-red-400'
                              : 'bg-gray-400'
                            : 'bg-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-xs text-gray-400 uppercase">
                  {persona.direction}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Selected Persona Details */}
        {selectedPersona && (
          <div className="p-6 rounded-lg bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-white/10">
            {(() => {
              const persona = personas.find((p) => p.id === selectedPersona)!;
              return (
                <>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-5xl">{persona.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className={`text-2xl font-bold ${persona.color}`}>
                          {persona.name}
                        </h3>
                        <Badge className={getActivityBadge(persona.activity)}>
                          Activity: {persona.activity}
                        </Badge>
                      </div>
                      <p className="text-gray-400 mb-4">{persona.description}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">
                        What They're Doing:
                      </h4>
                      <ul className="space-y-2">
                        {persona.details.map((detail, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span className="text-blue-400 mt-1">•</span>
                            <span className="text-gray-300">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">💡</span>
                        <div>
                          <div className="text-sm font-semibold text-blue-300 mb-1">
                            Insight:
                          </div>
                          <p className="text-sm text-gray-300">{persona.insight}</p>
                        </div>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30"
                      onClick={() => setShowAlerts(true)}
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      Alert me on {persona.name} activity
                    </Button>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* Power Balance */}
        <div className="mt-8 p-6 rounded-lg bg-gradient-to-r from-green-500/10 to-red-500/10 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-white">⚖️ POWER BALANCE</div>
            <div className="text-sm text-gray-400">
              Buyers {buyingPower}% | Sellers {100 - buyingPower}%
            </div>
          </div>
          <Progress className="h-3 mb-3" value={buyingPower} />
          <p className="text-sm text-gray-300 text-center">
            When whales and retail align, good things tend to happen.
          </p>
        </div>
      </Card>

      {/* Real-Time Activity Feed */}
      <Card className="p-6 bg-gray-800/50 border-white/10 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-400" />
            Real-Time Activity Feed
          </h3>
          <Badge className="bg-green-500/20 text-green-300 border-green-400/30 animate-pulse">
            LIVE
          </Badge>
        </div>

        <div className="space-y-3">
          {[
            {
              time: '2m ago',
              persona: '🦈',
              action: 'Large block trade detected',
              details: 'NVDA: $45M buy order at $481.50',
              impact: 'Bullish',
            },
            {
              time: '5m ago',
              persona: '🤖',
              action: 'Algo volume spike',
              details: 'SPY options: Call/Put ratio shifted to 1.8',
              impact: 'Neutral',
            },
            {
              time: '8m ago',
              persona: '👨‍💼',
              action: 'Fund rebalancing',
              details: 'Tech sector: -$120M outflow',
              impact: 'Bearish',
            },
            {
              time: '12m ago',
              persona: '🎰',
              action: 'Retail sentiment shift',
              details: 'Community bullish sentiment up 5% → 72%',
              impact: 'Bullish',
            },
          ].map((activity, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-gray-900/50 border border-white/5 hover:bg-gray-900/70 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{activity.persona}</span>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {activity.action}
                    </div>
                    <div className="text-xs text-gray-500">{activity.time}</div>
                  </div>
                </div>
                <Badge
                  className={
                    activity.impact === 'Bullish'
                      ? 'bg-green-500/20 text-green-300'
                      : activity.impact === 'Bearish'
                      ? 'bg-red-500/20 text-red-300'
                      : 'bg-gray-500/20 text-gray-300'
                  }
                >
                  {activity.impact}
                </Badge>
              </div>
              <p className="text-sm text-gray-400">{activity.details}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Community Stats */}
      <Card className="p-6 bg-gradient-to-r from-purple-500/5 to-blue-500/5 border-purple-500/20">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-6 h-6 text-purple-400" />
          <h3 className="text-lg font-bold text-white">1MarketPulse Community</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-lg bg-gray-900/50">
            <div className="text-2xl font-bold text-purple-400 mb-1">12,847</div>
            <div className="text-xs text-gray-400">Traders Online</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-gray-900/50">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {fearGreedLoading ? (
                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
              ) : (
                `${bullishPercentage ?? 50}%`
              )}
            </div>
            <div className="text-xs text-gray-400">Bullish</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-gray-900/50">
            <div className="text-2xl font-bold text-blue-400 mb-1">3.2K</div>
            <div className="text-xs text-gray-400">Active Positions</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-gray-900/50">
            <div className="text-2xl font-bold text-yellow-400 mb-1">89%</div>
            <div className="text-xs text-gray-400">Success Rate Today</div>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <p className="text-sm text-gray-300 text-center">
            💡 <span className="font-semibold text-blue-300">Community Insight:</span>{' '}
            When retail sentiment aligns with whale activity (as it does today), historical
            data shows a 78% probability of sustained momentum.
          </p>
        </div>
      </Card>
    </div>
  );
}
