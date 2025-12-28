import { useState, useMemo, useEffect } from 'react';

import {
  Lock,
  Unlock,
  CheckCircle2,
  Trophy,
  Zap,
  Brain,
  Target,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';

import { getUserEngagementStats, UserEngagementStats } from '@/services/api/userStatsService';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';


interface SkillNode {
  id: string;
  name: string;
  description: string;
  status: 'locked' | 'available' | 'completed';
  xpRequired: number;
  benefit: string;
  unlocks?: string[];
  prerequisites?: string[];
  icon: string;
}

const skillTree: SkillNode[] = [
  // Foundation
  {
    id: 'start',
    name: 'START',
    description: 'Welcome to your learning journey',
    status: 'completed',
    xpRequired: 0,
    benefit: 'Access to basic features',
    icon: '🎯',
  },
  // Layer 1
  {
    id: 'basic-patterns',
    name: 'BASIC PATTERNS',
    description: 'Support, Resistance, Trend Lines',
    status: 'completed',
    xpRequired: 100,
    benefit: 'Identify basic chart patterns',
    prerequisites: ['start'],
    icon: '📊',
  },
  {
    id: 'volume-basics',
    name: 'VOLUME BASICS',
    description: 'Understanding volume and its importance',
    status: 'completed',
    xpRequired: 100,
    benefit: 'Read volume patterns',
    prerequisites: ['start'],
    icon: '📈',
  },
  // Layer 2
  {
    id: 'breakouts',
    name: 'BREAKOUTS',
    description: 'Breakout patterns and confirmation',
    status: 'completed',
    xpRequired: 200,
    benefit: 'Spot breakout opportunities',
    prerequisites: ['basic-patterns'],
    icon: '🚀',
  },
  {
    id: 'support-resistance',
    name: 'SUPPORT/RESISTANCE',
    description: 'Advanced S/R levels and zones',
    status: 'completed',
    xpRequired: 200,
    benefit: 'Identify key price levels',
    prerequisites: ['basic-patterns'],
    icon: '🎯',
  },
  {
    id: 'money-flow',
    name: 'MONEY FLOW',
    description: 'Institutional buying and selling',
    status: 'available',
    xpRequired: 250,
    benefit: 'See where big money is moving',
    prerequisites: ['volume-basics', 'basic-patterns'],
    icon: '💰',
  },
  // Layer 3
  {
    id: 'complex-patterns',
    name: 'COMPLEX PATTERNS',
    description: 'H&S, Cup & Handle, Wedges',
    status: 'locked',
    xpRequired: 400,
    benefit: 'Advanced pattern recognition',
    prerequisites: ['breakouts', 'support-resistance'],
    icon: '🔮',
  },
  {
    id: 'reversal-patterns',
    name: 'REVERSAL PATTERNS',
    description: 'Spotting trend reversals',
    status: 'locked',
    xpRequired: 400,
    benefit: 'Catch major trend changes',
    prerequisites: ['breakouts'],
    icon: '🔄',
  },
  {
    id: 'correlation-matrix',
    name: 'CORRELATION MATRIX',
    description: 'Asset correlations and divergences',
    status: 'locked',
    xpRequired: 500,
    benefit: 'Understand market relationships',
    prerequisites: ['money-flow'],
    icon: '🕸️',
  },
  // Layer 4 - Expert
  {
    id: 'options-basics',
    name: 'OPTIONS BASICS',
    description: 'Greeks, IV, and option strategies',
    status: 'locked',
    xpRequired: 600,
    benefit: 'Understand options market',
    prerequisites: ['correlation-matrix'],
    icon: '⚡',
  },
  {
    id: 'spread-strategies',
    name: 'SPREAD STRATEGIES',
    description: 'Advanced option spreads',
    status: 'locked',
    xpRequired: 800,
    benefit: 'Build complex positions',
    prerequisites: ['options-basics'],
    icon: '🎲',
  },
];

export function KnowledgeTree() {
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  const [backendStats, setBackendStats] = useState<UserEngagementStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  // Try to fetch XP from backend
  useEffect(() => {
    async function fetchStats() {
      setIsLoadingStats(true);
      setStatsError(null);
      try {
        const stats = await getUserEngagementStats();
        setBackendStats(stats);
      } catch (error) {
        console.warn('Could not fetch backend stats, using demo XP:', error);
        setStatsError(error instanceof Error ? error.message : 'Failed to load stats');
      } finally {
        setIsLoadingStats(false);
      }
    }
    fetchStats();
  }, []);

  // Use backend XP if available, otherwise fallback to demo
  const isDemoMode = !backendStats;
  const currentXP = backendStats?.totalXp ?? 1847; // Demo fallback

  // Memoize tree statistics to avoid recalculation on every render
  const treeStats = useMemo(() => {
    const totalNodes = skillTree.length;
    const completedNodes = skillTree.filter((n) => n.status === 'completed').length;
    const availableNodes = skillTree.filter((n) => n.status === 'available').length;
    const progressPercentage = Math.round((completedNodes / totalNodes) * 100);

    return { totalNodes, completedNodes, availableNodes, progressPercentage };
  }, []);

  const { totalNodes, completedNodes, availableNodes, progressPercentage } = treeStats;

  const getNodeIcon = (node: SkillNode) => {
    switch (node.status) {
      case 'completed':
        return <CheckCircle2 className="w-6 h-6 text-green-400" />;
      case 'available':
        return <Unlock className="w-6 h-6 text-blue-400" />;
      case 'locked':
        return <Lock className="w-6 h-6 text-gray-600" />;
    }
  };

  const getNodeColor = (node: SkillNode) => {
    switch (node.status) {
      case 'completed':
        return 'bg-green-500/20 border-green-400/50';
      case 'available':
        return 'bg-blue-500/20 border-blue-400/50 animate-pulse';
      case 'locked':
        return 'bg-gray-800/30 border-gray-700/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Demo Mode Banner */}
      {isDemoMode && !isLoadingStats && (
        <div className="p-4 rounded-lg bg-amber-500/10 border-2 border-amber-500/30 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <div className="flex-1">
              <h3 className="text-sm font-bold text-amber-300">DEMO MODE - Skills Not Saved</h3>
              <p className="text-xs text-amber-200/70">
                {statsError
                  ? `Backend unavailable: ${statsError}. Showing demo XP (${currentXP}).`
                  : `Progress and skills are simulated. Connect to backend to persist your learning.`
                }
              </p>
            </div>
            <Badge className="bg-amber-500/20 text-amber-300 border-amber-400/30 text-xs">
              Demo XP: {currentXP}
            </Badge>
          </div>
        </div>
      )}

      {/* Header */}
      <Card className="p-8 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-white/10 backdrop-blur-sm">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            🌳 KNOWLEDGE TREE
            {isDemoMode && (
              <Badge className="bg-gray-500/30 text-gray-400 border-gray-500/30 text-[10px]">
                DEMO
              </Badge>
            )}
          </h2>
          <p className="text-sm text-gray-400">Your learning journey - unlock skills as you grow</p>
        </div>

        {/* Progress Overview */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400">Overall Progress</span>
            <span className="text-sm text-purple-400 font-semibold">{progressPercentage}%</span>
          </div>
          <Progress className="h-3 mb-4" value={progressPercentage} />
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
              <div className="text-2xl font-bold text-green-400">{completedNodes}</div>
              <div className="text-xs text-gray-400">Completed</div>
            </div>
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <div className="text-2xl font-bold text-blue-400">{availableNodes}</div>
              <div className="text-xs text-gray-400">Available</div>
            </div>
            <div className="p-3 rounded-lg bg-gray-500/10 border border-gray-500/30">
              <div className="text-2xl font-bold text-gray-400">
                {totalNodes - completedNodes - availableNodes}
              </div>
              <div className="text-xs text-gray-400">Locked</div>
            </div>
          </div>
        </div>

        {/* Skill Tree Visualization */}
        <div className="relative">
          {/* Foundation Level */}
          <div className="flex justify-center mb-12">
            <button
              className={`p-6 rounded-xl border-2 transition-all hover:scale-105 ${getNodeColor(
                skillTree[0]
              )}`}
              onClick={() => setSelectedNode(skillTree[0])}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">{skillTree[0].icon}</div>
                <div className="text-sm font-bold text-white mb-1">{skillTree[0].name}</div>
                {getNodeIcon(skillTree[0])}
              </div>
            </button>
          </div>

          {/* Connection Lines */}
          <div className="flex justify-center mb-4">
            <div className="w-px h-12 bg-gradient-to-b from-green-400/50 to-transparent" />
          </div>

          {/* Layer 1 - Basics */}
          <div className="flex justify-center gap-8 mb-12">
            {skillTree.slice(1, 3).map((node) => (
              <div key={node.id} className="flex flex-col items-center">
                <button
                  className={`p-6 rounded-xl border-2 transition-all hover:scale-105 ${getNodeColor(
                    node
                  )}`}
                  onClick={() => setSelectedNode(node)}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">{node.icon}</div>
                    <div className="text-sm font-bold text-white mb-1">{node.name}</div>
                    {getNodeIcon(node)}
                  </div>
                </button>
              </div>
            ))}
          </div>

          {/* Connection to Layer 2 */}
          <div className="flex justify-center gap-8 mb-4">
            {skillTree.slice(1, 3).map((_, idx) => (
              <div key={idx} className="w-px h-12 bg-gradient-to-b from-green-400/50 to-blue-400/30" />
            ))}
          </div>

          {/* Layer 2 - Intermediate */}
          <div className="flex justify-center gap-6 mb-12">
            {skillTree.slice(3, 6).map((node) => (
              <div key={node.id} className="flex flex-col items-center">
                <button
                  className={`p-5 rounded-xl border-2 transition-all hover:scale-105 ${getNodeColor(
                    node
                  )}`}
                  disabled={node.status === 'locked'}
                  onClick={() => setSelectedNode(node)}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{node.icon}</div>
                    <div className="text-xs font-bold text-white mb-1">{node.name}</div>
                    {getNodeIcon(node)}
                  </div>
                </button>
              </div>
            ))}
          </div>

          {/* Connection to Layer 3 */}
          <div className="flex justify-center gap-6 mb-4">
            {skillTree.slice(3, 6).map((_, idx) => (
              <div
                key={idx}
                className="w-px h-12 bg-gradient-to-b from-blue-400/30 to-purple-400/20"
              />
            ))}
          </div>

          {/* Layer 3 - Advanced */}
          <div className="flex justify-center gap-6 mb-12">
            {skillTree.slice(6, 9).map((node) => (
              <div key={node.id} className="flex flex-col items-center">
                <button
                  className={`p-4 rounded-xl border-2 transition-all ${getNodeColor(node)}`}
                  disabled={node.status === 'locked'}
                  onClick={() => setSelectedNode(node)}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">{node.icon}</div>
                    <div className="text-xs font-bold text-white mb-1">{node.name}</div>
                    {getNodeIcon(node)}
                  </div>
                </button>
              </div>
            ))}
          </div>

          {/* Expert Level */}
          <div className="flex justify-center gap-8">
            {skillTree.slice(9).map((node) => (
              <div key={node.id} className="flex flex-col items-center">
                <button
                  className={`p-4 rounded-xl border-2 transition-all ${getNodeColor(node)}`}
                  disabled={node.status === 'locked'}
                  onClick={() => setSelectedNode(node)}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">{node.icon}</div>
                    <div className="text-xs font-bold text-white mb-1">{node.name}</div>
                    {getNodeIcon(node)}
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-12 pt-6 border-t border-white/10">
          <div className="flex justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-gray-400">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <Unlock className="w-4 h-4 text-blue-400" />
              <span className="text-gray-400">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-gray-600" />
              <span className="text-gray-400">Locked</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Selected Node Details */}
      {selectedNode && (
        <Card className="p-6 bg-gray-800/50 border-white/10 backdrop-blur-sm">
          <div className="flex items-start gap-4 mb-6">
            <div className="text-5xl">{selectedNode.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold text-white">{selectedNode.name}</h3>
                <Badge
                  className={
                    selectedNode.status === 'completed'
                      ? 'bg-green-500/20 text-green-300 border-green-400/30'
                      : selectedNode.status === 'available'
                      ? 'bg-blue-500/20 text-blue-300 border-blue-400/30'
                      : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                  }
                >
                  {selectedNode.status === 'completed' && '✓ Completed'}
                  {selectedNode.status === 'available' && '🔓 Available'}
                  {selectedNode.status === 'locked' && '🔒 Locked'}
                </Badge>
              </div>
              <p className="text-gray-400 mb-4">{selectedNode.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* What You'll Unlock */}
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-5 h-5 text-purple-400" />
                <h4 className="text-sm font-semibold text-purple-300">BENEFIT</h4>
              </div>
              <p className="text-sm text-gray-300">{selectedNode.benefit}</p>
            </div>

            {/* XP Required */}
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-blue-400" />
                <h4 className="text-sm font-semibold text-blue-300">REQUIREMENTS</h4>
              </div>
              {selectedNode.status === 'available' ? (
                <div>
                  <p className="text-sm text-gray-300 mb-2">
                    XP Required: <span className="text-blue-400 font-bold">{selectedNode.xpRequired}</span>
                  </p>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    Your XP: {currentXP} {currentXP >= selectedNode.xpRequired && '✓'}
                    {isDemoMode && (
                      <span className="text-amber-400/70 text-[10px]">(demo)</span>
                    )}
                  </p>
                </div>
              ) : selectedNode.status === 'locked' ? (
                <p className="text-sm text-gray-400">
                  Complete prerequisites to unlock
                </p>
              ) : (
                <p className="text-sm text-green-400">✓ You've mastered this skill</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {selectedNode.status === 'available' && (
            <div className="flex gap-3">
              <Button className="flex-1 bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30">
                <Brain className="w-4 h-4 mr-2" />
                Start Learning
              </Button>
              <Button className="flex-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30">
                <Target className="w-4 h-4 mr-2" />
                Take Quiz
              </Button>
            </div>
          )}

          {selectedNode.status === 'locked' && (
            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-sm text-yellow-300 text-center">
                🔒 Complete the required skills first to unlock this node
              </p>
            </div>
          )}
        </Card>
      )}

      {/* Next Unlock Preview */}
      <Card className="p-6 bg-gradient-to-r from-blue-500/5 to-purple-500/5 border-blue-500/20">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-blue-400" />
          <h3 className="text-lg font-bold text-white">Next Unlock</h3>
        </div>

        {availableNodes > 0 ? (
          <div>
            <p className="text-sm text-gray-300 mb-3">
              You have <span className="text-blue-400 font-bold">{availableNodes}</span> skill
              {availableNodes > 1 ? 's' : ''} ready to learn!
            </p>
            <Button className="bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30">
              View Available Skills
            </Button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-300 mb-2">
              Complete your current skills to unlock the next level
            </p>
            <div className="text-xs text-gray-500">
              Next unlock: {skillTree.find((n) => n.status === 'locked')?.name || 'All complete!'}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
