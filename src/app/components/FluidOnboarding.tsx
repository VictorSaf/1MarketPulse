import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { TrendingUp, Bitcoin, BarChart3, Brain } from 'lucide-react';

type OnboardingStep = 'welcome' | 'interest' | 'test' | 'profile';

interface UserProfile {
  interests: string[];
  level: 'explorer' | 'student' | 'practitioner' | 'analyst' | 'pro';
  testAnswer?: string;
}

export function FluidOnboarding() {
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [profile, setProfile] = useState<UserProfile>({
    interests: [],
    level: 'explorer',
  });

  return (
    <Card className="p-8 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-white/10 max-w-3xl mx-auto">
      {step === 'welcome' && (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">👋</div>
          <h2 className="text-3xl font-bold text-white mb-4">Welcome!</h2>
          <p className="text-lg text-gray-300 mb-8">
            Let's see what's happening in the markets today.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card className="p-4 bg-green-500/10 border-green-500/20">
              <div className="text-2xl font-bold text-green-400">+0.62%</div>
              <div className="text-sm text-gray-400">S&P 500</div>
            </Card>
            <Card className="p-4 bg-blue-500/10 border-blue-500/20">
              <div className="text-2xl font-bold text-blue-400">+0.89%</div>
              <div className="text-sm text-gray-400">NASDAQ</div>
            </Card>
            <Card className="p-4 bg-purple-500/10 border-purple-500/20">
              <div className="text-2xl font-bold text-purple-400">+3.2%</div>
              <div className="text-sm text-gray-400">BTC</div>
            </Card>
          </div>

          <p className="text-gray-300 mb-6">What interests you most?</p>

          <div className="grid grid-cols-3 gap-3">
            <Button
              onClick={() => {
                setProfile({ ...profile, interests: ['stocks'] });
                setStep('test');
              }}
              className="h-auto py-6 flex flex-col gap-2 bg-green-500/20 border border-green-400/30 text-green-300"
            >
              <TrendingUp className="w-8 h-8" />
              <span>Stocks</span>
            </Button>
            <Button
              onClick={() => {
                setProfile({ ...profile, interests: ['crypto'] });
                setStep('test');
              }}
              className="h-auto py-6 flex flex-col gap-2 bg-orange-500/20 border border-orange-400/30 text-orange-300"
            >
              <Bitcoin className="w-8 h-8" />
              <span>Crypto</span>
            </Button>
            <Button
              onClick={() => {
                setProfile({ ...profile, interests: ['all'] });
                setStep('test');
              }}
              className="h-auto py-6 flex flex-col gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300"
            >
              <BarChart3 className="w-8 h-8" />
              <span>Everything</span>
            </Button>
          </div>

          <p className="text-xs text-gray-500 mt-6">
            💡 Don't worry - we won't ask your experience level. We'll figure it out together.
          </p>
        </div>
      )}

      {step === 'test' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
              <Brain className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Quick question...</h3>
              <p className="text-sm text-gray-400">No right or wrong answer</p>
            </div>
          </div>

          <Card className="p-6 bg-gray-900/50 border-white/10">
            <p className="text-white mb-4">
              Here's today's news: <strong>"Fed signals pause in rate hikes"</strong>
            </p>
            <p className="text-gray-300 mb-6">What do you think this means for markets?</p>

            <div className="space-y-3">
              <Button
                onClick={() => {
                  setProfile({ ...profile, level: 'explorer', testAnswer: 'good' });
                  setStep('profile');
                }}
                className="w-full justify-start text-left bg-green-500/10 border border-green-500/20 text-green-300"
              >
                <span className="mr-2">🟢</span>
                It's good for stocks
              </Button>
              <Button
                onClick={() => {
                  setProfile({ ...profile, level: 'student', testAnswer: 'depends' });
                  setStep('profile');
                }}
                className="w-full justify-start text-left bg-yellow-500/10 border border-yellow-500/20 text-yellow-300"
              >
                <span className="mr-2">🟡</span>
                Depends on market expectations
              </Button>
              <Button
                onClick={() => {
                  setProfile({ ...profile, level: 'analyst', testAnswer: 'yields' });
                  setStep('profile');
                }}
                className="w-full justify-start text-left bg-blue-500/10 border border-blue-500/20 text-blue-300"
              >
                <span className="mr-2">🔵</span>
                I want to see how bond yields react
              </Button>
              <Button
                onClick={() => {
                  setProfile({ ...profile, level: 'explorer', testAnswer: 'idk' });
                  setStep('profile');
                }}
                className="w-full justify-start text-left bg-gray-500/10 border border-gray-500/20 text-gray-300"
              >
                <span className="mr-2">❓</span>
                I don't know what this means
              </Button>
            </div>
          </Card>

          <p className="text-xs text-gray-500 text-center">
            This helps us personalize your experience
          </p>
        </div>
      )}

      {step === 'profile' && (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">
              {profile.level === 'explorer' ? '🌱' : profile.level === 'student' ? '📚' : '🎯'}
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Your Profile is Ready!</h3>
            <p className="text-gray-400">
              We've identified you as:{' '}
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30">
                {profile.level === 'explorer'
                  ? 'THE EXPLORER'
                  : profile.level === 'student'
                  ? 'THE STUDENT'
                  : 'THE ANALYST'}
              </Badge>
            </p>
          </div>

          <Card className="p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
            <h4 className="text-white font-semibold mb-4">What this means:</h4>
            <div className="space-y-2 text-sm text-gray-300">
              {profile.level === 'explorer' && (
                <>
                  <div className="flex items-start gap-2">
                    <span>✓</span>
                    <span>We'll use simple explanations and real-world analogies</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Focus on "What is?" before "How to trade?"</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Lots of small rewards to keep you motivated</span>
                  </div>
                </>
              )}
              {profile.level === 'student' && (
                <>
                  <div className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Structured curriculum with clear progression</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Balance between theory and practice</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Certificates and milestones to track growth</span>
                  </div>
                </>
              )}
              {profile.level === 'analyst' && (
                <>
                  <div className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Advanced data and deep analysis available</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Skip the basics - get to the insights</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Focus on edge, alpha, market inefficiencies</span>
                  </div>
                </>
              )}
            </div>
          </Card>

          <Card className="p-6 bg-gray-900/50 border-white/10">
            <h4 className="text-white font-semibold mb-4">Your Dashboard Will Show:</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <span className="text-gray-300">
                  Daily {profile.interests[0]} market updates
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-gray-300">Learning content at your level</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-400" />
                <span className="text-gray-300">Challenges matched to your skill</span>
              </div>
            </div>
          </Card>

          <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-lg py-6">
            🚀 Start Your Journey
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Don't worry - your profile adapts as you learn and grow
          </p>
        </div>
      )}
    </Card>
  );
}
