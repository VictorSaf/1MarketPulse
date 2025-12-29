import { useState, useEffect, useCallback, useRef } from 'react';

import { Flame, Trophy, Target, Zap, RefreshCw } from 'lucide-react';

import { getUserEngagementStats } from '@/services/api/userStatsService';
import { reportError } from '@/services/monitoring';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';

interface EngagementStatsProps {
  xpToNextLevel?: number;
}

/**
 * EngagementStats Component
 * 
 * Displays user engagement statistics including streak, level, XP, and achievements.
 * 
 * Features:
 * - Automatic retry with exponential backoff (max 3 attempts)
 * - Error logging integrated with Sentry monitoring
 * - User-friendly error messages with retry button
 * - Optimized retry logic using useRef to prevent unnecessary re-renders
 * - Accessibility: ARIA attributes for screen readers
 * 
 * Error Handling:
 * - Retries failed requests up to 3 times with exponential backoff (1s, 2s, 4s delays)
 * - Shows specific error messages based on HTTP status codes
 * - Displays retry status and exhaustion message when all retries fail
 * - Logs errors to Sentry with component context for monitoring
 */
export function EngagementStats({
  xpToNextLevel = 1000
}: EngagementStatsProps) {
  const [stats, setStats] = useState({
    streak: 0,
    level: 1,
    xp: 0,
    achievements: 0,
    dailyCompleted: 0,
    dailyTotal: 3
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const retryCountRef = useRef(0);

  // Fetch engagement stats from backend
  const fetchStats = useCallback(async (isRetry = false) => {
    if (!isRetry) {
      setIsLoading(true);
      setRetryCount(0);
      retryCountRef.current = 0; // Reset retry count on manual fetch
    }
    setError(null);

    try {
      const engagementStats = await getUserEngagementStats();
      
      // Calculate XP progress within current level
      const xpInCurrentLevel = engagementStats.totalXp % xpToNextLevel;
      
      setStats({
        streak: engagementStats.currentStreak,
        level: engagementStats.level,
        xp: xpInCurrentLevel,
        achievements: engagementStats.achievements,
        dailyCompleted: 0,
        dailyTotal: 3
      });
      setRetryCount(0);
      retryCountRef.current = 0; // Reset retry count on success
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching engagement stats:', err);
      
      // Log error for monitoring
      if (err instanceof Error) {
        try {
          reportError(err, {
            component: 'EngagementStats',
            action: isRetry ? 'retry' : 'initial',
            retryCount: retryCountRef.current,
            xpToNextLevel,
          });
        } catch (sentryError) {
          // Sentry not available or failed, continue without it
          console.warn('Failed to log error to Sentry:', sentryError);
        }
        
        // Emit error event for other error tracking integrations
        window.dispatchEvent(new CustomEvent('engagement-stats-error', {
          detail: {
            message: err.message,
            timestamp: Date.now(),
            retryCount: retryCountRef.current,
          }
        }));
      }
      
      const errorMessage = err instanceof Error && err.message
        ? err.message
        : 'Unable to load engagement stats. Please check your connection and try again.';
      setError(errorMessage);
      setIsLoading(false);
    }
  }, [xpToNextLevel]);

  // Use ref to store latest fetchStats to avoid retry effect re-triggers
  const fetchStatsRef = useRef(fetchStats);
  useEffect(() => {
    fetchStatsRef.current = fetchStats;
  }, [fetchStats]);

  // Fetch on mount
  useEffect(() => {
    fetchStatsRef.current();
  }, []); // Empty deps - only run on mount

  // Auto-retry with exponential backoff on error
  useEffect(() => {
    if (error && retryCount < 3) {
      const delay = Math.min(1000 * Math.pow(2, retryCount), 10000); // Max 10 seconds
      const timeoutId = setTimeout(() => {
        const nextRetryCount = retryCount + 1;
        setRetryCount(nextRetryCount);
        retryCountRef.current = nextRetryCount; // Update ref
        fetchStatsRef.current(true);
      }, delay);
      return () => clearTimeout(timeoutId);
    }
  }, [error, retryCount]); // Removed fetchStats from deps - using ref instead

  const handleRetry = () => {
    setRetryCount(0);
    retryCountRef.current = 0;
    fetchStats();
  };

  // Handler for XP updates from challenges or other components
  const handleXpEarned = useCallback((event: CustomEvent<{ xp: number; type: string }>) => {
    setStats(prev => {
      const newXp = prev.xp + event.detail.xp;
      const newLevel = Math.floor(newXp / xpToNextLevel) + 1;
      return {
        ...prev,
        xp: newXp % xpToNextLevel,
        level: newLevel,
        achievements: event.detail.type === 'achievement' ? prev.achievements + 1 : prev.achievements
      };
    });
  }, [xpToNextLevel]);

  // Listen for XP updates from challenges or other components
  useEffect(() => {
    const handler = handleXpEarned as EventListener;
    window.addEventListener('xp-earned', handler);
    return () => window.removeEventListener('xp-earned', handler);
  }, [handleXpEarned]);

  const xpProgress = (stats.xp / xpToNextLevel) * 100;

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-4 bg-gray-800/50 border-white/10 animate-pulse">
              <div className="h-20" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    const hasExhaustedRetries = retryCount >= 3;
    const isRetrying = retryCount > 0 && retryCount < 3;
    
    return (
      <div className="space-y-2">
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg" role="alert" aria-live="polite">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm text-red-400 font-medium mb-1">Unable to Load Stats</p>
              <p className="text-xs text-red-300/80">{error}</p>
              {isRetrying && (
                <p className="text-xs text-red-300/60 mt-1">
                  Retrying... ({retryCount}/3)
                </p>
              )}
              {hasExhaustedRetries && (
                <p className="text-xs text-red-300/60 mt-1">
                  All retry attempts failed. Please try again manually.
                </p>
              )}
            </div>
            <Button
              onClick={handleRetry}
              variant="ghost"
              size="sm"
              className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
              disabled={isLoading}
              aria-label="Retry loading engagement statistics"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-orange-500/20 to-red-500/10 border-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-orange-500/20">
              <Flame className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Streak</p>
              <p className="text-2xl font-bold text-white">{stats.streak}</p>
            </div>
          </div>
          <p className="text-xs text-gray-400">days in a row</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/10 border-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Zap className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Level</p>
              <p className="text-2xl font-bold text-white">{stats.level}</p>
            </div>
          </div>
          <div className="space-y-1">
            <Progress className="h-1.5 bg-white/10" value={xpProgress} />
            <p className="text-xs text-gray-400">{stats.xp}/{xpToNextLevel} XP</p>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Trophy className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Achievements</p>
              <p className="text-2xl font-bold text-white">{stats.achievements}</p>
            </div>
          </div>
          <p className="text-xs text-gray-400">unlocked</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/10 border-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-green-500/20">
              <Target className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Daily Challenge</p>
              <p className="text-lg font-semibold text-white">{stats.dailyCompleted}/{stats.dailyTotal}</p>
            </div>
          </div>
          <Progress className="h-1.5 bg-white/10" value={(stats.dailyCompleted / stats.dailyTotal) * 100} />
        </Card>
      </div>
    </div>
  );
}
