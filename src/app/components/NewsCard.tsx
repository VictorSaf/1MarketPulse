import { memo } from 'react';

import { Clock, Bookmark, Share } from 'lucide-react';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  source: string;
  timeAgo: string;
  url: string;
}

interface NewsCardProps {
  article: NewsArticle;
  onBookmark: (id: string) => void;
  onShare: (id: string) => void;
  isBookmarked?: boolean;
}

export const NewsCard = memo(function NewsCard({ article, onBookmark, onShare, isBookmarked = false }: NewsCardProps) {
  return (
    <Card className="overflow-hidden border-0 shadow-sm bg-white">
      <div className="relative h-48 overflow-hidden">
        <img
          alt={article.title}
          className="w-full h-full object-cover"
          src={article.imageUrl}
        />
        <Badge className="absolute top-3 left-3 bg-blue-600 text-white border-0">
          {article.category}
        </Badge>
      </div>
      
      <div className="p-4">
        <h3 className="mb-2 line-clamp-2">
          {article.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {article.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-gray-500">
            <span className="text-sm">{article.source}</span>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{article.timeAgo}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              className="h-8 w-8"
              size="icon"
              variant="ghost"
              onClick={() => onBookmark(article.id)}
            >
              <Bookmark
                className={`w-5 h-5 ${isBookmarked ? 'fill-blue-600 text-blue-600' : 'text-gray-500'}`}
              />
            </Button>
            <Button
              className="h-8 w-8"
              size="icon"
              variant="ghost"
              onClick={() => onShare(article.id)}
            >
              <Share className="w-5 h-5 text-gray-500" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
});
