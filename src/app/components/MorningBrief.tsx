import { Sparkles, ChevronRight } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface MorningBriefProps {
  persona: string;
  highlights: string[];
  aiSummary: string;
}

export function MorningBrief({ persona, highlights, aiSummary }: MorningBriefProps) {
  return (
    <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-white/10 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/20">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Your Morning Brief</h3>
            <p className="text-xs text-gray-400">Personalized for you</p>
          </div>
        </div>
        <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30">
          {persona}
        </Badge>
      </div>
      
      <div className="mb-4 p-4 rounded-lg bg-black/20 border border-white/5">
        <p className="text-sm text-gray-300 leading-relaxed italic">
          "{aiSummary}"
        </p>
      </div>
      
      <div className="space-y-2 mb-4">
        {highlights.map((highlight, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2" />
            <p className="text-sm text-gray-300">{highlight}</p>
          </div>
        ))}
      </div>
      
      <Button 
        variant="ghost" 
        className="w-full justify-between text-purple-300 hover:text-purple-200 hover:bg-purple-500/10"
      >
        <span>Read Full Analysis</span>
        <ChevronRight className="w-4 h-4" />
      </Button>
    </Card>
  );
}
