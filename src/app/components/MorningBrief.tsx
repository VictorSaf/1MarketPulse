import { Sparkles, ChevronRight, RefreshCw, Cpu } from 'lucide-react';

import { useFearGreed } from '@/hooks/useFearGreed';
import { useMorningBrief } from '@/hooks/useOllamaAI';
import { useStockQuote } from '@/hooks/useStockQuote';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';


interface MorningBriefProps {
  persona?: string;
  highlights?: string[];
  aiSummary?: string; // Optional fallback
}

export function MorningBrief({
  persona = 'Active Trader',
  highlights = [],
  aiSummary: fallbackSummary
}: MorningBriefProps) {
  // Get real market data for AI context
  const { data: spyData } = useStockQuote({ symbol: 'SPY' });
  const { data: qqqData } = useStockQuote({ symbol: 'QQQ' });
  const { data: fearGreedData } = useFearGreed();

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

  // Default highlights if none provided
  const displayHighlights = highlights.length > 0 ? highlights : [
    'Monitor key support and resistance levels',
    'Check economic calendar for upcoming events',
    'Review your watchlist for potential opportunities',
  ];

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
            Generated at {new Date(generatedAt).toLocaleTimeString()}
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
          className="text-purple-300 hover:text-purple-200 hover:bg-purple-500/10"
          disabled={loading}
          size="sm"
          variant="ghost"
          onClick={() => regenerate()}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Regenerate
        </Button>
        <Button
          className="flex-1 justify-between text-purple-300 hover:text-purple-200 hover:bg-purple-500/10"
          variant="ghost"
        >
          <span>Read Full Analysis</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}
