import { useState, useEffect, useMemo, useCallback } from 'react';

import { Heart, TrendingUp, TrendingDown, Info } from 'lucide-react';

import { useCryptoPrice } from '@/hooks/useCryptoPrice';
import { useFearGreed } from '@/hooks/useFearGreed';
import { useStockQuote } from '@/hooks/useStockQuote';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Progress } from './ui/progress';

interface MarketSegment {
  name: string;
  value: string;
  status: 'up' | 'down' | 'neutral';
  isReal?: boolean; // Indicates if data is from real API
  bpm?: number; // Segment-specific BPM if available
}

interface BPMFactor {
  label: string;
  impact: number;
  type: 'accelerator' | 'decelerator';
}

interface MarketHeartbeatProps {
  bpm?: number;
  segments?: MarketSegment[];
}

const bpmFactors: BPMFactor[] = [
  { label: 'VIX spike +12%', impact: 15, type: 'accelerator' },
  { label: 'NVDA volume 3x avg', impact: 8, type: 'accelerator' },
  { label: 'Crypto funding rates', impact: 6, type: 'accelerator' },
  { label: 'News velocity 2x', impact: 4, type: 'accelerator' },
  { label: 'Bond yields stable', impact: -5, type: 'decelerator' },
  { label: 'DXY range-bound', impact: -3, type: 'decelerator' },
  { label: 'Put/Call ratio normal', impact: -2, type: 'decelerator' },
];

export function MarketHeartbeat({ segments: customSegments }: Omit<MarketHeartbeatProps, 'bpm'>) {
  const [showDetails, setShowDetails] = useState(false);
  const [pulse, setPulse] = useState(0);

  // Fetch Fear & Greed data for BPM calculation
  const { data: fearGreedData, loading: fgLoading } = useFearGreed();

  // Fetch real market data for segments
  const { data: spyData } = useStockQuote({ symbol: 'SPY', pollingInterval: 30000 });
  const { data: vixData } = useStockQuote({ symbol: '^VIX', pollingInterval: 30000 });
  const { data: btcData } = useCryptoPrice({ symbol: 'BTC', pollingInterval: 30000 });

  // Build dynamic segments with real data where available
  const segments = useMemo<MarketSegment[]>(() => {
    // Use custom segments if provided
    if (customSegments && customSegments.length > 0) {
      return customSegments;
    }

    // Calculate US segment from SPY data
    const usSegment: MarketSegment = spyData
      ? {
          name: 'US',
          value: `${spyData.changePercent >= 0 ? '+' : ''}${spyData.changePercent.toFixed(1)}%`,
          status: spyData.changePercent > 0.1 ? 'up' : spyData.changePercent < -0.1 ? 'down' : 'neutral',
          isReal: true,
          bpm: vixData ? Math.round(40 + (vixData.price * 2)) : undefined, // BPM from VIX
        }
      : { name: 'US', value: 'fut', status: 'up' as const };

    // Calculate VIX segment
    const vixSegment: MarketSegment = vixData
      ? {
          name: 'VIX',
          value: vixData.price < 15 ? 'LOW' : vixData.price < 20 ? 'MED' : vixData.price < 30 ? 'HIGH' : 'EXTREME',
          status: vixData.price < 20 ? 'up' : vixData.price < 30 ? 'neutral' : 'down',
          isReal: true,
        }
      : { name: 'VIX', value: 'LOW', status: 'up' as const };

    // Calculate CRYPTO segment from BTC
    const cryptoSegment: MarketSegment = btcData
      ? {
          name: 'CRYPTO',
          value: `${btcData.changePercent24h >= 0 ? '+' : ''}${btcData.changePercent24h.toFixed(1)}%`,
          status: btcData.changePercent24h > 0.5 ? 'up' : btcData.changePercent24h < -0.5 ? 'down' : 'neutral',
          isReal: true,
          bpm: Math.abs(btcData.changePercent24h) > 5 ? 100 : Math.abs(btcData.changePercent24h) > 2 ? 85 : 70,
        }
      : { name: 'CRYPTO', value: '+3.2', status: 'up' as const };

    // SENT segment from Fear & Greed
    const sentSegment: MarketSegment = fearGreedData
      ? {
          name: 'SENT',
          value: fearGreedData.score >= 75 ? 'greed' : fearGreedData.score >= 55 ? 'greed' : fearGreedData.score >= 45 ? 'neutral' : 'fear',
          status: fearGreedData.score >= 55 ? 'up' : fearGreedData.score <= 45 ? 'down' : 'neutral',
          isReal: true,
        }
      : { name: 'SENT', value: 'greed', status: 'up' as const };

    return [
      { name: 'ASIA', value: '+1.2', status: 'up' as const }, // Estimated - no API
      { name: 'EU', value: '+0.8', status: 'up' as const },   // Estimated - no API
      usSegment,
      cryptoSegment,
      { name: 'COMM', value: '+0.9', status: 'up' as const }, // Estimated - commodities
      vixSegment,
      { name: 'BOND', value: 'flat', status: 'neutral' as const },
      { name: 'FX', value: 'weak', status: 'neutral' as const },
      sentSegment,
      { name: 'VOL', value: vixData && vixData.price < 20 ? 'low' : 'high', status: vixData && vixData.price < 20 ? 'up' : 'down' as const, isReal: !!vixData },
      { name: 'FLOW', value: 'in', status: 'up' as const },
    ];
  }, [customSegments, spyData, vixData, btcData, fearGreedData]);

  // Calculate BPM from Fear & Greed Index
  // Fear & Greed is inverted from VIX:
  // - Low Fear & Greed (0-25) = Extreme Fear = High volatility = High BPM
  // - High Fear & Greed (75-100) = Extreme Greed = Low volatility = Low BPM
  // Formula: BPM = 130 - (Fear&Greed * 0.8)
  // F&G 0 (Extreme Fear) → 130 BPM (Panic)
  // F&G 25 (Fear) → 110 BPM (Excited)
  // F&G 50 (Neutral) → 90 BPM (Alert)
  // F&G 75 (Greed) → 70 BPM (Calm)
  // F&G 100 (Extreme Greed) → 50 BPM (Comatose/Complacent)
  const bpm = useMemo(() => {
    if (!fearGreedData) {return 72;} // Default fallback
    const score = fearGreedData.score;
    const calculatedBpm = Math.round(130 - (score * 0.8));
    return Math.min(Math.max(calculatedBpm, 50), 130); // Clamp between 50-130
  }, [fearGreedData]);

  // Calculate heartbeat state based on BPM - memoized for performance
  const heartbeatState = useMemo(() => {
    if (bpm < 56) {return { state: 'Comatose', color: 'text-slate-400', bg: 'from-slate-500/20 to-slate-600/5' };}
    if (bpm < 71) {return { state: 'Calm', color: 'text-green-400', bg: 'from-green-500/20 to-green-600/5' };}
    if (bpm < 86) {return { state: 'Alert', color: 'text-yellow-400', bg: 'from-yellow-500/20 to-yellow-600/5' };}
    if (bpm < 101) {return { state: 'Excited', color: 'text-orange-400', bg: 'from-orange-500/20 to-orange-600/5' };}
    return { state: 'Panic', color: 'text-red-400', bg: 'from-red-500/20 to-red-600/5' };
  }, [bpm]);

  const heartbeatDuration = useMemo(() => 60000 / bpm, [bpm]); // Convert BPM to milliseconds
  
  // Animate pulse wave
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(prev => (prev + 1) % 100);
    }, heartbeatDuration / 10);
    
    return () => clearInterval(interval);
  }, [heartbeatDuration]);
  
  const getStatusColor = (status: string) => {
    if (status === 'up') {return 'text-green-400';}
    if (status === 'down') {return 'text-red-400';}
    return 'text-yellow-400';
  };
  
  const getStatusIcon = (status: string) => {
    if (status === 'up') {return '🟢';}
    if (status === 'down') {return '🔴';}
    return '🟡';
  };

  const netEffect = useMemo(() =>
    bpmFactors.reduce((sum, factor) => sum + factor.impact, 0),
    []
  );

  // Memoize callback handlers to prevent re-renders
  const handleShowDetails = useCallback(() => setShowDetails(true), []);
  const handleCloseDetails = useCallback(() => setShowDetails(false), []);

  return (
    <>
      <Card className={`p-8 bg-gradient-to-br ${heartbeatState.bg} border-white/10 backdrop-blur-sm overflow-hidden relative`}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-white">THE MARKET IS BREATHING</h2>
              {!fgLoading && fearGreedData && (
                <Badge className="text-xs" variant="outline">
                  Fear & Greed: {Math.round(fearGreedData.score)} ({fearGreedData.rating || 'Loading'})
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-400">Real-time market volatility indicator</p>
          </div>
          
          {/* Heart Container */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              {/* Pulsing glow effect */}
              <div 
                className={`absolute inset-0 rounded-full ${heartbeatState.color} opacity-20 blur-2xl`}
                style={{
                  animation: `pulse ${heartbeatDuration}ms ease-in-out infinite`
                }}
              />
              
              {/* Heart with BPM */}
              <div 
                className="relative bg-gray-900/50 backdrop-blur-sm rounded-full p-12 border-2 border-white/10"
                style={{
                  animation: `heartbeat ${heartbeatDuration}ms ease-in-out infinite`
                }}
              >
                <Heart 
                  className={`w-24 h-24 ${heartbeatState.color} fill-current`}
                  strokeWidth={1.5}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center" aria-live="polite" aria-atomic="true">
                    <div className={`text-4xl font-bold ${heartbeatState.color}`}>{bpm}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">BPM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* State Display */}
          <div className="text-center mb-8">
            <p className="text-xl font-semibold text-white mb-1">
              Current rhythm: <span className={heartbeatState.color}>{bpm} BPM</span>
            </p>
            <p className={`text-lg ${heartbeatState.color}`}>
              ({heartbeatState.state}, {heartbeatState.state === 'Panic' ? 'Volatile' : heartbeatState.state === 'Excited' ? 'Active' : 'Confident'})
            </p>
          </div>
          
          {/* Market Segments */}
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs text-gray-500">Market Segments Overview</span>
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-600/30 text-emerald-400 border-emerald-500/30 text-[10px]">
                LIVE: US, CRYPTO, VIX
              </Badge>
              <Badge className="bg-gray-600/30 text-gray-400 border-gray-500/30 text-[10px]">
                ASIA, EU: estimated
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-11 gap-2 mb-8">
            {segments.map((segment, index) => (
              <div
                key={index}
                className={`text-center p-3 rounded-lg border transition-colors ${
                  segment.isReal
                    ? 'bg-gray-900/30 border-emerald-500/20 hover:border-emerald-500/40'
                    : 'bg-gray-900/30 border-white/5 hover:bg-gray-900/50'
                }`}
                title={segment.isReal ? 'Live data' : 'Estimated'}
              >
                <div className="text-xs text-gray-400 mb-1 flex items-center justify-center gap-1">
                  {segment.name}
                  {!segment.isReal && <span className="text-[8px] text-amber-400/70">*</span>}
                </div>
                <div className={`text-sm font-semibold ${getStatusColor(segment.status)}`}>
                  {segment.value}
                </div>
                <div className="text-lg mt-1">{getStatusIcon(segment.status)}</div>
                {segment.bpm && (
                  <div className="text-[9px] text-gray-500 mt-1">{segment.bpm} BPM</div>
                )}
              </div>
            ))}
          </div>
          
          {/* Pulse Wave Visualization */}
          <div className="mb-6">
            <div className="h-16 relative overflow-hidden rounded-lg bg-gray-900/30 border border-white/5">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 100">
                <path
                  className={heartbeatState.color}
                  d={`M 0 50 ${Array.from({ length: 20 }, (_, i) => {
                    const x = (i / 20) * 1000;
                    const baseY = 50;
                    const amplitude = 20;
                    const frequency = (bpm / 60) * 2;
                    const offset = (pulse / 100) * Math.PI * 2;
                    const y = baseY + Math.sin((i * frequency) - offset) * amplitude;
                    return `L ${x} ${y}`;
                  }).join(' ')} L 1000 50`}
                  fill="none"
                  opacity="0.6"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              <div className="absolute bottom-2 left-4 text-xs text-gray-500">
                Heartbeat visualization - pulse faster = more volatility
              </div>
            </div>
          </div>
          
          {/* Info Button */}
          <div className="text-center">
            <Button
              aria-label={`Learn why the market heart is beating at ${bpm} BPM`}
              className="group border-white/20 hover:border-white/40 hover:bg-white/5"
              variant="outline"
              onClick={handleShowDetails}
            >
              <Info className="w-4 h-4 mr-2" aria-hidden="true" />
              Why is the heart beating at {bpm} BPM?
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Details Modal */}
      <Dialog open={showDetails} onOpenChange={handleCloseDetails}>
        <DialogContent className="max-w-3xl bg-gray-900 border-white/10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <Heart className={`w-8 h-8 ${heartbeatState.color}`} />
              Why is the heart beating at {bpm} BPM?
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Analysis of factors affecting market volatility and heart rate
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="p-2 rounded bg-gray-700/30 border border-gray-600/30 text-center">
              <p className="text-xs text-gray-500">
                Example factors for educational purposes - not real-time market data
              </p>
            </div>
            {/* Factors Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Accelerators */}
              <div>
                <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  ACCELERATORS (+)
                  <Badge className="bg-gray-600/30 text-gray-400 border-gray-500/30 text-[10px] ml-2">
                    EXAMPLE
                  </Badge>
                </h3>
                <div className="space-y-3">
                  {bpmFactors.filter(f => f.type === 'accelerator').map((factor, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                      <div className="text-red-400 text-sm mt-0.5">🔺</div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-300">{factor.label}</div>
                        <div className="text-xs text-red-400 font-semibold mt-1">+{factor.impact} BPM</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Decelerators */}
              <div>
                <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                  <TrendingDown className="w-5 h-5" />
                  DECELERATORS (-)
                  <Badge className="bg-gray-600/30 text-gray-400 border-gray-500/30 text-[10px] ml-2">
                    EXAMPLE
                  </Badge>
                </h3>
                <div className="space-y-3">
                  {bpmFactors.filter(f => f.type === 'decelerator').map((factor, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <div className="text-green-400 text-sm mt-0.5">🔻</div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-300">{factor.label}</div>
                        <div className="text-xs text-green-400 font-semibold mt-1">{factor.impact} BPM</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Net Effect */}
            <div className="p-6 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-2">NET EFFECT</div>
                <div className={`text-3xl font-bold mb-3 ${netEffect > 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {netEffect > 0 ? '+' : ''}{netEffect} BPM above baseline
                </div>
                <Progress className="h-2 mb-4" value={((bpm - 60) / 60) * 100} />
                <div className="text-sm text-gray-300 italic">
                  💡 "The market is {heartbeatState.state.toLowerCase()} but not panicked. {
                    bpm > 85 ? 'High volatility - trade with caution and tight stops.' :
                    bpm > 70 ? 'Good time for active trading, but keep stops tight.' :
                    'Low volatility environment - consider range-bound strategies.'
                  }"
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
