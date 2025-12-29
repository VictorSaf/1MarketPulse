import { useState, useMemo } from 'react';

import { Sparkles, ChevronRight, RefreshCw, Cpu, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { toast } from 'sonner';

import { useFearGreed } from '@/hooks/useFearGreed';
import { useMorningBrief } from '@/hooks/useOllamaAI';
import { useStockQuote } from '@/hooks/useStockQuote';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';


interface MorningBriefProps {
  persona?: string;
  highlights?: string[];
  aiSummary?: string; // Optional fallback
}

/**
 * Morning Brief Component
 * 
 * Displays AI-generated daily market analysis with real-time market data.
 * Features a card preview with "Read Full Analysis" button that opens a dialog
 * with comprehensive market insights including SPY, QQQ, and Fear & Greed Index.
 * 
 * @param persona - Trading persona label (default: 'Active Trader')
 * @param highlights - Array of key market highlights
 * @param aiSummary - Optional fallback summary when AI is unavailable
 */
export function MorningBrief({
  persona = 'Active Trader',
  highlights = [],
  aiSummary: fallbackSummary
}: MorningBriefProps) {
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);
  // Get real market data for AI context
  const { data: spyData, error: spyError } = useStockQuote({ symbol: 'SPY' });
  const { data: qqqData, error: qqqError } = useStockQuote({ symbol: 'QQQ' });
  const { data: fearGreedData, error: fearGreedError } = useFearGreed();

  // Get AI-generated brief
  const {
    brief,
    generatedAt,
    isFallback,
    loading,
    regenerate
  } = useMorningBrief({
    marketData: {
      spx: spyData ? {
        price: spyData.price,
        change: spyData.changePercent
      } : undefined,
      nasdaq: qqqData ? {
        price: qqqData.price,
        change: qqqData.changePercent
      } : undefined,
      fearGreed: fearGreedData?.score,
    },
    enabled: true,
    refreshInterval: 900000, // Refresh every 15 minutes
  });

  // Use AI brief or fallback
  const displayBrief = brief || fallbackSummary ||
    'Markets are active today. Watch for key developments and sentiment shifts.';

  // Generate dynamic highlights based on real data
  const dynamicHighlights = useMemo(() => {
    const generated: string[] = [];

    // SPY/Market movement highlights
    if (spyData) {
      const absChange = Math.abs(spyData.changePercent);
      if (absChange > 1) {
        generated.push(
          spyData.changePercent > 0
            ? `S&P 500 showing strong momentum (+${spyData.changePercent.toFixed(2)}%)`
            : `S&P 500 under pressure (${spyData.changePercent.toFixed(2)}%)`
        );
      } else if (absChange > 0.3) {
        generated.push(
          spyData.changePercent > 0
            ? `S&P 500 trending higher (+${spyData.changePercent.toFixed(2)}%)`
            : `S&P 500 trending lower (${spyData.changePercent.toFixed(2)}%)`
        );
      }
    }

    // Fear & Greed highlights
    if (fearGreedData) {
      if (fearGreedData.score < 25) {
        generated.push('Market sentiment in extreme fear territory - potential contrarian opportunity');
      } else if (fearGreedData.score < 40) {
        generated.push('Fear dominates market sentiment - watch for reversal signals');
      } else if (fearGreedData.score > 75) {
        generated.push('Extreme greed detected - consider risk management');
      } else if (fearGreedData.score > 60) {
        generated.push('Greedy sentiment prevails - momentum may continue');
      }
    }

    // QQQ/Tech highlights
    if (qqqData) {
      const absChange = Math.abs(qqqData.changePercent);
      if (absChange > 1.5) {
        generated.push(
          qqqData.changePercent > 0
            ? `Tech sector leading gains (NASDAQ +${qqqData.changePercent.toFixed(2)}%)`
            : `Tech sector under selling pressure (NASDAQ ${qqqData.changePercent.toFixed(2)}%)`
        );
      }
    }

    // If no dynamic highlights generated, use generic ones
    if (generated.length === 0) {
      return [
        'Monitor key support and resistance levels',
        'Check economic calendar for upcoming events',
        'Review your watchlist for potential opportunities',
      ];
    }

    // Add a generic tip if we have room
    if (generated.length < 3) {
      generated.push('Stay disciplined and follow your trading plan');
    }

    return generated;
  }, [spyData, qqqData, fearGreedData]);

  // Use provided highlights, AI-generated, or dynamic highlights
  const displayHighlights = highlights.length > 0 ? highlights : dynamicHighlights;

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-white/10 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/20">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Your Morning Brief</h3>
            <p className="text-xs text-gray-400">
              {loading ? 'Generating...' : 'AI-powered insights'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isFallback && (
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 flex items-center gap-1">
              <Cpu className="w-3 h-3" />
              AI
            </Badge>
          )}
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30">
            {persona}
          </Badge>
        </div>
      </div>

      <div className="mb-4 p-4 rounded-lg bg-black/20 border border-white/5 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
            <RefreshCw className="w-5 h-5 text-purple-400 animate-spin" />
          </div>
        )}
        <p className="text-sm text-gray-300 leading-relaxed italic">
          "{displayBrief}"
        </p>
        {generatedAt && !isFallback && (
          <p className="text-[10px] text-gray-500 mt-2">
            Generated at {new Date(generatedAt).toLocaleString()}
          </p>
        )}
      </div>

      <div className="space-y-2 mb-4">
        {displayHighlights.map((highlight, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2" />
            <p className="text-sm text-gray-300">{highlight}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Button
          aria-label="Regenerate morning brief"
          className="text-purple-300 hover:text-purple-200 hover:bg-purple-500/10"
          disabled={loading}
          size="sm"
          variant="ghost"
          onClick={async () => {
            try {
              await regenerate();
              toast.success('Morning Brief updated');
            } catch {
              toast.error('Failed to update brief');
            }
          }}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
          Regenerate
        </Button>
        <Button
          className="flex-1 justify-between text-purple-300 hover:text-purple-200 hover:bg-purple-500/10"
          variant="ghost"
          onClick={() => setShowFullAnalysis(true)}
          aria-label="Read full market analysis"
        >
          <span>Read Full Analysis</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Full Analysis Dialog
          Opens when user clicks "Read Full Analysis" button.
          Displays comprehensive market analysis with real-time data,
          AI-generated brief, highlights, and regeneration capability.
      */}
      <Dialog open={showFullAnalysis} onOpenChange={setShowFullAnalysis}>
        <DialogContent className="max-w-[95vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-gray-800/95 border-white/10">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-xl font-semibold text-white">
                  Full Market Analysis
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-400 mt-1">
                  Comprehensive AI-powered market insights for {persona}
                  {generatedAt && !isFallback && (
                    <span className="block mt-1">
                      Generated at {new Date(generatedAt).toLocaleString()}
                    </span>
                  )}
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2">
                {!isFallback && (
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 flex items-center gap-1">
                    <Cpu className="w-3 h-3" />
                    AI Generated
                  </Badge>
                )}
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30">
                  {persona}
                </Badge>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 mt-4 relative">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800/80 rounded-lg z-10">
                <div className="flex flex-col items-center gap-2">
                  <RefreshCw className="w-6 h-6 text-purple-400 animate-spin" />
                  <p className="text-sm text-gray-300">Regenerating analysis...</p>
                </div>
              </div>
            )}
            {/* Market Data Summary
                Displays real-time SPY, QQQ, and Fear & Greed Index data.
                Shows error state if data unavailable.
            */}
            {(spyData || qqqData || fearGreedData || spyError || qqqError || fearGreedError) ? (
              <div className="p-4 rounded-lg bg-gray-900/50 border border-white/5">
                <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Current Market Data
                </h4>
                {(spyData || qqqData || fearGreedData) ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {spyData && (
                      <div className="flex items-center justify-between p-3 rounded bg-gray-800/50">
                        <div>
                          <p className="text-xs text-gray-400">S&P 500</p>
                          <p className="text-lg font-bold text-white">${spyData.price.toFixed(2)}</p>
                        </div>
                        <div className={`flex items-center gap-1 ${spyData.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {spyData.changePercent >= 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <span className="text-sm font-medium">
                            {spyData.changePercent >= 0 ? '+' : ''}{spyData.changePercent.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    )}
                    {qqqData && (
                      <div className="flex items-center justify-between p-3 rounded bg-gray-800/50">
                        <div>
                          <p className="text-xs text-gray-400">NASDAQ</p>
                          <p className="text-lg font-bold text-white">${qqqData.price.toFixed(2)}</p>
                        </div>
                        <div className={`flex items-center gap-1 ${qqqData.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {qqqData.changePercent >= 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <span className="text-sm font-medium">
                            {qqqData.changePercent >= 0 ? '+' : ''}{qqqData.changePercent.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    )}
                    {fearGreedData && (
                      <div className="flex items-center justify-between p-3 rounded bg-gray-800/50">
                        <div>
                          <p className="text-xs text-gray-400">Fear & Greed</p>
                          <p className="text-lg font-bold text-white">{Math.round(fearGreedData.score)}</p>
                        </div>
                        <Badge className={
                          fearGreedData.score >= 75
                            ? 'bg-green-500/20 text-green-300'
                            : fearGreedData.score <= 25
                            ? 'bg-red-500/20 text-red-300'
                            : 'bg-yellow-500/20 text-yellow-300'
                        }>
                          {fearGreedData.rating || (fearGreedData.score >= 55 ? 'Greed' : 'Fear')}
                        </Badge>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3 rounded bg-gray-800/50">
                    <p className="text-sm text-gray-400">Market data temporarily unavailable</p>
                  </div>
                )}
              </div>
            ) : null}

            {/* Full Brief
                AI-generated market analysis with whitespace preservation.
                Content is sanitized by backend API before display.
            */}
            <div className="p-4 rounded-lg bg-black/20 border border-white/5">
              <h4 className="text-sm font-semibold text-white mb-3">Market Analysis</h4>
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                {displayBrief}
              </p>
            </div>

            {/* Key Highlights */}
            <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/10">
              <h4 className="text-sm font-semibold text-white mb-3">Key Highlights</h4>
              <div className="space-y-2">
                {displayHighlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                    <p className="text-sm text-gray-300 flex-1">{highlight}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t border-white/10">
              <Button
                className="flex-1 text-purple-300 hover:text-purple-200 hover:bg-purple-500/10"
                variant="ghost"
                size="sm"
                disabled={loading}
                onClick={async () => {
                  try {
                    await regenerate();
                    toast.success('Morning Brief updated');
                  } catch {
                    toast.error('Failed to update brief');
                  }
                }}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Regenerating...' : 'Regenerate Analysis'}
              </Button>
              <Button
                className="text-purple-300 hover:text-purple-200 hover:bg-purple-500/10"
                variant="ghost"
                size="sm"
                onClick={() => setShowFullAnalysis(false)}
                disabled={loading}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
