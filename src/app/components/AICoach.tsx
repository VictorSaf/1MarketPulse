import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Bot, MessageSquare, TrendingUp, AlertTriangle } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

const conversationHistory: Message[] = [
  {
    id: '1',
    sender: 'ai',
    text: "Hi Victor! I've analyzed your trading pattern. You tend to perform best in the morning (9:30-11:00 AM) with 78% accuracy, but drop to 58% in the afternoon. Have you noticed this?",
    timestamp: '10:30 AM',
  },
  {
    id: '2',
    sender: 'user',
    text: "No, I didn't realize that. Why do you think that is?",
    timestamp: '10:32 AM',
  },
  {
    id: '3',
    sender: 'ai',
    text: 'Based on your decision journal, your afternoon predictions are more emotional ("gut feeling" vs "pattern-based"). Market fatigue? I suggest: 1) Make your key decisions before noon, 2) If trading afternoon, use checklist approach, not intuition.',
    timestamp: '10:33 AM',
  },
];

const insights = [
  {
    type: 'strength',
    icon: '✅',
    title: 'Your Strength',
    message: 'Pattern recognition in tech stocks - 82% accuracy',
  },
  {
    type: 'weakness',
    icon: '⚠️',
    title: 'Area to Improve',
    message: 'Crypto predictions - only 45% accurate. Need more study.',
  },
  {
    type: 'recommendation',
    icon: '💡',
    title: 'Today\'s Tip',
    message: 'NVDA pattern forming. Similar to Nov 14 (which you predicted correctly). Trust your analysis.',
  },
];

export function AICoach() {
  const [inputMessage, setInputMessage] = useState('');

  return (
    <Card className="p-8 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-white/10">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              🤖 AI COACH
            </h2>
            <p className="text-sm text-gray-400">Your personal trading assistant powered by AI</p>
          </div>
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
            <Bot className="w-3 h-3 mr-1" />
            ONLINE
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {insights.map((insight, i) => (
          <Card
            key={i}
            className={`p-4 ${
              insight.type === 'strength'
                ? 'bg-green-500/10 border-green-500/20'
                : insight.type === 'weakness'
                ? 'bg-yellow-500/10 border-yellow-500/20'
                : 'bg-blue-500/10 border-blue-500/20'
            }`}
          >
            <div className="text-3xl mb-2">{insight.icon}</div>
            <div className="text-xs text-gray-400 mb-1">{insight.title}</div>
            <p className="text-sm text-white">{insight.message}</p>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-gray-900/50 border-white/10 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-blue-400" />
          <h3 className="text-white font-semibold">CONVERSATION</h3>
        </div>

        <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto">
          {conversationHistory.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] ${
                  msg.sender === 'user'
                    ? 'bg-blue-500/20 border-blue-500/30'
                    : 'bg-purple-500/20 border-purple-500/30'
                } border rounded-lg p-4`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {msg.sender === 'ai' && <Bot className="w-4 h-4 text-purple-400" />}
                  <span className="text-xs text-gray-400">
                    {msg.sender === 'ai' ? 'AI Coach' : 'You'} • {msg.timestamp}
                  </span>
                </div>
                <p className="text-sm text-white">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask me anything about trading..."
            className="flex-1 bg-gray-900 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-gray-500"
          />
          <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            Send
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="p-6 bg-blue-500/10 border-blue-500/20">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-6 h-6 text-blue-400 flex-shrink-0" />
            <div>
              <h4 className="text-white font-semibold mb-3">WHAT AI COACH DOES:</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2" />
                  <span>Analyzes your trading patterns</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2" />
                  <span>Identifies strengths & weaknesses</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2" />
                  <span>Suggests improvements</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2" />
                  <span>Answers your questions 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-purple-500/10 border-purple-500/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
            <div>
              <h4 className="text-white font-semibold mb-3">WHAT IT DOESN'T DO:</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-2" />
                  <span>No guaranteed predictions</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-2" />
                  <span>No "buy this now" signals</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-2" />
                  <span>No financial advice</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-2" />
                  <span>Focus on education, not tips</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
        <h4 className="text-white font-semibold mb-4">QUICK ACTIONS:</h4>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="justify-start border-white/10 hover:bg-blue-500/20"
          >
            📊 Analyze my performance
          </Button>
          <Button
            variant="outline"
            className="justify-start border-white/10 hover:bg-purple-500/20"
          >
            💡 Get personalized tips
          </Button>
          <Button
            variant="outline"
            className="justify-start border-white/10 hover:bg-green-500/20"
          >
            🎯 Review my predictions
          </Button>
          <Button
            variant="outline"
            className="justify-start border-white/10 hover:bg-yellow-500/20"
          >
            🔍 What should I learn?
          </Button>
        </div>
      </Card>

      <div className="mt-6 p-4 rounded-lg bg-gray-900/30 border border-white/5 text-center">
        <p className="text-xs text-gray-500">
          💡 AI Coach learns from your behavior and adapts recommendations over time
        </p>
      </div>
    </Card>
  );
}
