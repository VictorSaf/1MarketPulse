import { useState, useRef, useEffect } from 'react';

import { Bot, MessageSquare, TrendingUp, AlertTriangle, Send, Loader2 } from 'lucide-react';

import { useCoachingTip, useAIHealth } from '@/hooks/useOllamaAI';
import { aiClient } from '@/services/ai/aiClient';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

const initialMessages: Message[] = [
  {
    id: '1',
    sender: 'ai',
    text: "Hi! I'm your AI trading coach. I can help analyze patterns, provide tips, and answer questions about trading strategies. What would you like to explore today?",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
    title: "Today's Tip",
    message: 'NVDA pattern forming. Similar to Nov 14. Trust your analysis.',
  },
];

export function AICoach() {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check AI availability
  const { isAvailable: aiAvailable } = useAIHealth();

  // Get coaching tip
  const { tip } = useCoachingTip({
    userLevel: 'intermediate',
    enabled: true,
  });

  // Update insights with AI tip if available
  const displayInsights = tip
    ? insights.map((i, idx) =>
        idx === 2 ? { ...i, message: tip } : i
      )
    : insights;

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message handler
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) {return;}

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Call AI to generate response
      const result = await aiClient.generate(
        `You are an AI trading coach. The user asks: "${userMessage.text}"

Provide a helpful, educational response about trading. Be concise (2-3 sentences max).
Focus on education, not financial advice. If they ask about specific trades,
remind them to do their own research.`,
        { temperature: 0.7, maxTokens: 150 }
      );

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: result?.content || "I'm here to help! Could you rephrase your question?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick action handler
  const handleQuickAction = async (action: string) => {
    const prompts: Record<string, string> = {
      'analyze': "Analyze my trading performance and identify key patterns.",
      'tips': "Give me personalized trading tips for today's market.",
      'predictions': "Help me review and improve my market predictions.",
      'learn': "What should I focus on learning next as a trader?",
    };

    setInputMessage(prompts[action] || '');
  };

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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
          <Badge
            className={`${
              aiAvailable
                ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                : 'bg-gray-500'
            } text-white border-0`}
          >
            <Bot className="w-3 h-3 mr-1" />
            {aiAvailable ? 'ONLINE' : 'OFFLINE'}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {displayInsights.map((insight, i) => (
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
          {messages.map((msg) => (
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
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-purple-500/20 border-purple-500/30 border rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-purple-400" />
                  <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                  <span className="text-xs text-gray-400">AI Coach is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-3">
          <input
            className="flex-1 bg-gray-900 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            disabled={isLoading}
            placeholder="Ask me anything about trading..."
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white disabled:opacity-50"
            disabled={isLoading || !inputMessage.trim()}
            onClick={handleSendMessage}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
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
            className="justify-start border-white/10 hover:bg-blue-500/20"
            variant="outline"
            onClick={() => handleQuickAction('analyze')}
          >
            📊 Analyze my performance
          </Button>
          <Button
            className="justify-start border-white/10 hover:bg-purple-500/20"
            variant="outline"
            onClick={() => handleQuickAction('tips')}
          >
            💡 Get personalized tips
          </Button>
          <Button
            className="justify-start border-white/10 hover:bg-green-500/20"
            variant="outline"
            onClick={() => handleQuickAction('predictions')}
          >
            🎯 Review my predictions
          </Button>
          <Button
            className="justify-start border-white/10 hover:bg-yellow-500/20"
            variant="outline"
            onClick={() => handleQuickAction('learn')}
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
