import { useState } from 'react';

import { BookOpen, ThumbsUp, MessageCircle, Share2, TrendingUp } from 'lucide-react';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';


interface StoryCharacter {
  name: string;
  icon: string;
  role: string;
  action: string;
  color: string;
}

interface StoryEnding {
  type: 'happy' | 'cliffhanger' | 'twist';
  probability: number;
  description: string;
  icon: string;
}

const storyCharacters: StoryCharacter[] = [
  {
    name: 'The Bull',
    icon: '🦁',
    role: 'Protagonist',
    action: 'Tech stocks, especially NVDA, showing accumulation. Smart money positioning?',
    color: 'text-green-400',
  },
  {
    name: 'The Bear',
    icon: '🐻',
    role: 'Antagonist',
    action: 'Bond yields creeping up. A warning sign that few are heeding.',
    color: 'text-red-400',
  },
  {
    name: 'The Wildcard',
    icon: '🦊',
    role: 'Plot Twist',
    action: 'Powell. One hawkish word and this whole narrative flips.',
    color: 'text-orange-400',
  },
];

const possibleEndings: StoryEnding[] = [
  {
    type: 'happy',
    probability: 65,
    description: 'Fed confirms pause, rally continues',
    icon: '📗',
  },
  {
    type: 'cliffhanger',
    probability: 25,
    description: 'Mixed signals, volatility tomorrow',
    icon: '📙',
  },
  {
    type: 'twist',
    probability: 10,
    description: 'Hawkish surprise, sharp reversal',
    icon: '📕',
  },
];

export function SignalStories() {
  const [reactions, setReactions] = useState({ likes: 234, comments: 45 });
  const [hasLiked, setHasLiked] = useState(false);

  const handleLike = () => {
    if (!hasLiked) {
      setReactions((prev) => ({ ...prev, likes: prev.likes + 1 }));
      setHasLiked(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Story Card */}
      <Card className="p-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-white/10 backdrop-blur-sm">
        {/* Story Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">TODAY'S MARKET STORY</h2>
              <p className="text-sm text-gray-400">Chapter 247 of 2024</p>
            </div>
          </div>
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30">
            Live Update
          </Badge>
        </div>

        {/* Story Content */}
        <div className="prose prose-invert max-w-none mb-8">
          <div className="p-6 rounded-lg bg-gray-900/50 border border-white/5">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              "THE QUIET BEFORE THE FED"
              <span className="text-sm font-normal text-gray-400">
                ━━━━━━━━━━━━━━━━━━━
              </span>
            </h3>

            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                The market woke up calm this morning. Asia had done the heavy lifting 
                overnight - Japan's Nikkei surged <span className="text-green-400 font-semibold">1.8%</span> on 
                whispers of extended stimulus. The baton passed smoothly to Europe, where 
                traders sipped their espressos and nudged indices gently higher.
              </p>

              <p>
                But there's tension beneath the surface. Everyone knows what's coming at{' '}
                <span className="text-yellow-400 font-semibold">2 PM</span>: the Fed minutes. 
                It's like waiting for exam results - you think you did well, but there's 
                always that nagging doubt.
              </p>

              <p>
                The VIX, our fear gauge, is suspiciously low at{' '}
                <span className="text-blue-400 font-semibold">14.2</span>. Some say complacency. 
                Others call it confidence. The truth is probably somewhere in between.
              </p>

              <div className="my-6 p-4 rounded-lg bg-blue-500/10 border-l-4 border-blue-400">
                <div className="text-sm text-blue-300 font-semibold mb-2">
                  📊 Current Market Pulse
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">SPX</div>
                    <div className="text-green-400 font-semibold">+0.6%</div>
                  </div>
                  <div>
                    <div className="text-gray-400">VIX</div>
                    <div className="text-blue-400 font-semibold">14.2</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Time</div>
                    <div className="text-yellow-400 font-semibold">11:30 AM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chapter Characters */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">CHAPTER CHARACTERS</h3>
          <div className="space-y-3">
            {storyCharacters.map((character, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-gray-900/30 border border-white/5 hover:bg-gray-900/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{character.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`font-bold ${character.color}`}>
                        {character.name}
                      </span>
                      <Badge className="text-xs" variant="secondary">
                        {character.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-300">{character.action}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How This Chapter Might End */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            HOW THIS CHAPTER MIGHT END
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {possibleEndings.map((ending, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  ending.type === 'happy'
                    ? 'bg-green-500/10 border-green-500/30'
                    : ending.type === 'cliffhanger'
                    ? 'bg-yellow-500/10 border-yellow-500/30'
                    : 'bg-red-500/10 border-red-500/30'
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{ending.icon}</span>
                  <div className="flex-1">
                    <div
                      className={`text-lg font-bold ${
                        ending.type === 'happy'
                          ? 'text-green-400'
                          : ending.type === 'cliffhanger'
                          ? 'text-yellow-400'
                          : 'text-red-400'
                      }`}
                    >
                      {ending.probability}%
                    </div>
                    <div className="text-xs text-gray-400 capitalize">
                      {ending.type} ending
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-300">{ending.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Story Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-white/10">
          <div className="flex items-center gap-6">
            <Button
              className={`gap-2 ${hasLiked ? 'text-red-400' : 'text-gray-400'}`}
              size="sm"
              variant="ghost"
              onClick={handleLike}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{reactions.likes}</span>
            </Button>
            <Button className="gap-2 text-gray-400" size="sm" variant="ghost">
              <MessageCircle className="w-4 h-4" />
              <span>{reactions.comments}</span>
            </Button>
            <Button className="gap-2 text-gray-400" size="sm" variant="ghost">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
          <div className="flex gap-2">
            <Button className="border-white/20" size="sm" variant="outline">
              📚 Read Previous Chapter
            </Button>
            <Button className="border-purple-500/30 text-purple-300" size="sm" variant="outline">
              🔮 Predict the Ending
            </Button>
          </div>
        </div>
      </Card>

      {/* Story Archive */}
      <Card className="p-6 bg-gray-800/50 border-white/10 backdrop-blur-sm">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          📚 THE 2024 CHRONICLES
        </h3>

        <div className="space-y-6">
          {/* Current Arc */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span className="text-sm font-semibold text-purple-300">
                CURRENT ARC: "The AI Gold Rush" (Chapters 180-present)
              </span>
            </div>
          </div>

          {/* Previous Arcs */}
          <div>
            <h4 className="text-sm font-semibold text-gray-400 mb-3">
              PREVIOUS ARCS
            </h4>
            <div className="space-y-4 pl-4 border-l-2 border-white/10">
              <div>
                <div className="text-sm font-semibold text-white mb-1">
                  ├─ "The Inflation Dragon" (Ch. 1-89)
                </div>
                <div className="text-xs text-gray-400 pl-4">
                  How central banks fought the beast and (mostly) won
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-white mb-1">
                  ├─ "The Regional Bank Scare" (Ch. 90-112)
                </div>
                <div className="text-xs text-gray-400 pl-4">
                  When SVB fell and fear spread, then faded
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-white mb-1">
                  ├─ "The Summer Lull" (Ch. 113-156)
                </div>
                <div className="text-xs text-gray-400 pl-4">
                  The market caught its breath. Some called it boring.
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-white mb-1">
                  └─ "The Election Uncertainty" (Ch. 157-179)
                </div>
                <div className="text-xs text-gray-400 pl-4">
                  Polls, predictions, and positioning
                </div>
              </div>
            </div>
          </div>

          {/* Reading Stats */}
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <h4 className="text-sm font-semibold text-blue-300 mb-3">
              YOUR READING STATS
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-gray-400">Chapters read</div>
                <div className="text-white font-semibold">89/247</div>
              </div>
              <div>
                <div className="text-gray-400">Predictions made</div>
                <div className="text-white font-semibold">34 (62% correct)</div>
              </div>
              <div>
                <div className="text-gray-400">Best call</div>
                <div className="text-green-400 font-semibold text-xs">
                  AI Gold Rush (Oct 15)
                </div>
              </div>
              <div>
                <div className="text-gray-400">Favorite arc</div>
                <div className="text-purple-400 font-semibold text-xs">
                  Current Arc
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Discussion Section */}
      <Card className="p-6 bg-gray-800/50 border-white/10 backdrop-blur-sm">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          💬 Community Discussion
          <Badge className="bg-green-500/20 text-green-300 border-green-400/30">
            89 online
          </Badge>
        </h3>

        <div className="space-y-4">
          {[
            {
              user: '@PatternMaster',
              comment: 'Called it! The Fed dovish pivot was obvious from the data.',
              likes: 23,
              time: '5m ago',
            },
            {
              user: '@CryptoWhale',
              comment:
                'This narrative ignores BTC correlation breakdown. Different story there.',
              likes: 15,
              time: '12m ago',
            },
            {
              user: '@ValueInvestor',
              comment: 'Great story but valuations are stretched. Caution warranted.',
              likes: 31,
              time: '18m ago',
            },
          ].map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-gray-900/30 border border-white/5"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="font-semibold text-blue-400">{item.user}</span>
                <span className="text-xs text-gray-500">{item.time}</span>
              </div>
              <p className="text-sm text-gray-300 mb-2">{item.comment}</p>
              <div className="flex items-center gap-2">
                <Button
                  className="h-6 px-2 text-xs text-gray-400"
                  size="sm"
                  variant="ghost"
                >
                  <ThumbsUp className="w-3 h-3 mr-1" />
                  {item.likes}
                </Button>
                <Button
                  className="h-6 px-2 text-xs text-gray-400"
                  size="sm"
                  variant="ghost"
                >
                  Reply
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Button className="w-full mt-4 bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30">
          <MessageCircle className="w-4 h-4 mr-2" />
          Join the Discussion
        </Button>
      </Card>
    </div>
  );
}
