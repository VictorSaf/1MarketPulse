// Priority 2 & 3 Components
import { Gamepad2, BookOpen, Trophy, Zap } from 'lucide-react';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function PatternPlayground() {
  return (
    <Card className="glass-card">
      <CardHeader><CardTitle><Gamepad2 className="w-5 h-5 inline mr-2"/>Pattern Playground</CardTitle></CardHeader>
      <CardContent><p className="text-gray-400">Interactive pattern recognition game</p><Button className="mt-4">Start Game</Button></CardContent>
    </Card>
  );
}

export function PaperTrading() {
  return (
    <Card className="glass-card">
      <CardHeader><CardTitle>📈 Paper Trading</CardTitle></CardHeader>
      <CardContent><p className="text-gray-400">Practice trading without risk</p><Badge className="mt-2">Portfolio: $10,000</Badge></CardContent>
    </Card>
  );
}

export function Leaderboards() {
  return (
    <Card className="glass-card">
      <CardHeader><CardTitle><Trophy className="w-5 h-5 inline mr-2"/>Leaderboards</CardTitle></CardHeader>
      <CardContent><p className="text-gray-400">Top traders this month</p></CardContent>
    </Card>
  );
}

export function DominoEffectTracker() {
  return (
    <Card className="glass-card">
      <CardHeader><CardTitle><Zap className="w-5 h-5 inline mr-2"/>Domino Effect Tracker</CardTitle></CardHeader>
      <CardContent><p className="text-gray-400">Track cause-effect chains</p></CardContent>
    </Card>
  );
}

export function FlowTracker() {
  return (
    <Card className="glass-card">
      <CardHeader><CardTitle>💰 Flow Tracker</CardTitle></CardHeader>
      <CardContent><p className="text-gray-400">Where money is flowing</p></CardContent>
    </Card>
  );
}

export function WhatIfSimulator() {
  return (
    <Card className="glass-card">
      <CardHeader><CardTitle>🎮 What-If Simulator</CardTitle></CardHeader>
      <CardContent><p className="text-gray-400">Test market scenarios</p></CardContent>
    </Card>
  );
}

export function MicroSimulations() {
  return (
    <Card className="glass-card">
      <CardHeader><CardTitle>⚡ Micro-Simulations</CardTitle></CardHeader>
      <CardContent><p className="text-gray-400">60-second simulations</p><Button className="mt-4">Start</Button></CardContent>
    </Card>
  );
}

export function DecisionJournal() {
  return (
    <Card className="glass-card">
      <CardHeader><CardTitle><BookOpen className="w-5 h-5 inline mr-2"/>Decision Journal</CardTitle></CardHeader>
      <CardContent><p className="text-gray-400">Track your decisions</p></CardContent>
    </Card>
  );
}

export function SmartWatchlist() {
  return (
    <Card className="glass-card">
      <CardHeader><CardTitle>⭐ Smart Watchlist</CardTitle></CardHeader>
      <CardContent><p className="text-gray-400">Intelligent watchlist</p></CardContent>
    </Card>
  );
}

export function EnhancedAchievementStories() {
  return (
    <Card className="glass-card">
      <CardHeader><CardTitle>🏆 Achievements</CardTitle></CardHeader>
      <CardContent><p className="text-gray-400">Your milestones</p></CardContent>
    </Card>
  );
}

export function SocialProofNotifications() {
  return (
    <Card className="glass-card">
      <CardHeader><CardTitle>👥 Social Proof</CardTitle></CardHeader>
      <CardContent><p className="text-gray-400">Community activity</p></CardContent>
    </Card>
  );
}
