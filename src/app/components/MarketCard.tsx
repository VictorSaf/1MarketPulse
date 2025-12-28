import { memo } from 'react';

import { ArrowUp, ArrowDown } from 'lucide-react';

import { Badge } from './ui/badge';
import { Card } from './ui/card';

interface MarketCardProps {
  name: string;
  value: string;
  change: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  volume: string;
  imageUrl: string;
}

export const MarketCard = memo(function MarketCard({
  name,
  value,
  change,
  sentiment,
  volume,
  imageUrl
}: MarketCardProps) {
  const priceDirection = change >= 0 ? 'up' : 'down';
  const priceChangeLabel = `Price ${priceDirection} ${Math.abs(change).toFixed(2)} percent`;

  return (
    <article
      aria-label={`${name} market card. Current value: ${value}, ${priceChangeLabel}`}
      className="overflow-hidden bg-gray-800/50 border border-white/10 rounded-lg backdrop-blur-sm hover:bg-gray-800/70 transition-all hover:scale-[1.02]"
    >
      <div className="relative h-32 overflow-hidden">
        <img
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-60"
          loading="lazy"
          src={imageUrl}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
        <Badge
          aria-label={`Market sentiment: ${sentiment}`}
          className={`absolute top-3 right-3 ${
            sentiment === 'positive' ? 'bg-green-500/80' :
            sentiment === 'negative' ? 'bg-red-500/80' :
            'bg-yellow-500/80'
          } text-white border-0`}
        >
          {sentiment}
        </Badge>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-white mb-2">{name}</h3>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl font-bold text-white">{value}</span>
          <div className="flex items-center gap-1" role="status" aria-live="polite">
            {change >= 0 ? (
              <ArrowUp aria-hidden="true" className="w-4 h-4 text-green-400" />
            ) : (
              <ArrowDown aria-hidden="true" className="w-4 h-4 text-red-400" />
            )}
            <span
              aria-label={priceChangeLabel}
              className={`text-sm font-medium ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}
            >
              {change >= 0 ? '+' : ''}{change.toFixed(2)}%
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-400">Volume: {volume}</p>
      </div>
    </article>
  );
});

MarketCard.displayName = 'MarketCard';
