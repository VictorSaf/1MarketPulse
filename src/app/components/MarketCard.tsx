import { memo } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

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
  return (
    <Card className="overflow-hidden bg-gray-800/50 border-white/10 backdrop-blur-sm hover:bg-gray-800/70 transition-all hover:scale-[1.02]">
      <div className="relative h-32 overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover opacity-60"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
        <Badge
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
        <h4 className="font-semibold text-white mb-2">{name}</h4>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl font-bold text-white">{value}</span>
          <div className="flex items-center gap-1">
            {change >= 0 ? (
              <ArrowUp className="w-4 h-4 text-green-400" />
            ) : (
              <ArrowDown className="w-4 h-4 text-red-400" />
            )}
            <span className={`text-sm font-medium ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {change >= 0 ? '+' : ''}{change.toFixed(2)}%
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-400">Volume: {volume}</p>
      </div>
    </Card>
  );
});

MarketCard.displayName = 'MarketCard';
