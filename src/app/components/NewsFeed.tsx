import { Clock, TrendingUp, TrendingDown, Minus, Loader2 } from 'lucide-react';

import { useMarketNews } from '@/hooks/useMarketNews';
import { useSentimentAnalysis } from '@/hooks/useSentimentAnalysis';

import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';


interface NewsFeedProps {
  category?: 'general' | 'forex' | 'crypto' | 'merger';
  limit?: number;
}

export function NewsFeed({ category = 'general', limit = 20 }: NewsFeedProps) {
  // Fetch real market news
  const { news, loading: newsLoading, error: newsError } = useMarketNews({
    category,
    limit,
    pollingInterval: 300000 // Update every 5 minutes
  });

  // Analyze sentiment with AI
  const {
    analyzedNews,
    analyzing,
    isAIAvailable
  } = useSentimentAnalysis({
    newsItems: news,
    autoAnalyze: true
  });

  const isLoading = newsLoading || analyzing;
  const displayNews = analyzedNews.length > 0 ? analyzedNews : news;
  // Format time ago from timestamp
  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) {return `${seconds}s ago`;}
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {return `${minutes}m ago`;}
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {return `${hours}h ago`;}
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getSentimentIcon = (sentiment: string) => {
    if (sentiment === 'bullish') {return <TrendingUp className="w-4 h-4 text-green-400" />;}
    if (sentiment === 'bearish') {return <TrendingDown className="w-4 h-4 text-red-400" />;}
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getSentimentColor = (sentiment: string) => {
    if (sentiment === 'bullish') {return 'bg-green-500/20 text-green-300 border-green-400/30';}
    if (sentiment === 'bearish') {return 'bg-red-500/20 text-red-300 border-red-400/30';}
    return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
  };

  return (
    <Card className="p-6 bg-gray-800/50 border-white/10 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white">Market News & Sentiment</h3>
        <div className="flex items-center gap-2">
          {isAIAvailable && (
            <Badge className="text-xs" variant="outline">
              AI Powered
            </Badge>
          )}
          {isLoading && (
            <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
          )}
          {!isLoading && (
            <Badge className="text-xs text-green-400" variant="outline">
              Live
            </Badge>
          )}
        </div>
      </div>

      {newsError && (
        <div className="text-sm text-red-400 p-4 rounded-lg bg-red-500/10 border border-red-500/20 mb-4">
          Failed to load news. Please try again later.
        </div>
      )}

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {displayNews.map((item) => (
            <a
              key={item.id}
              className="block p-4 rounded-lg bg-gray-900/50 border border-white/5 hover:bg-gray-900/70 transition-colors cursor-pointer"
              href={item.url}
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className="flex items-start justify-between mb-2">
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 text-xs">
                  {item.category}
                </Badge>
                {item.sentiment && (
                  <Badge className={`${getSentimentColor(item.sentiment.label)} text-xs flex items-center gap-1`}>
                    {getSentimentIcon(item.sentiment.label)}
                    {item.sentiment.label}
                    {item.sentiment.confidence && (
                      <span className="ml-1 opacity-70">
                        ({Math.round(item.sentiment.confidence * 100)}%)
                      </span>
                    )}
                  </Badge>
                )}
              </div>
              <h4 className="text-sm font-medium text-white mb-2 leading-relaxed">
                {item.title}
              </h4>
              {item.summary && (
                <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                  {item.summary}
                </p>
              )}
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span>{item.source}</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{getTimeAgo(item.timestamp)}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
