import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Heart, Sparkles, TrendingUp, Gift } from 'lucide-react';

export function AdvancedAnimations() {
  const [heartbeat, setHeartbeat] = useState(false);
  const [weatherTransition, setWeatherTransition] = useState(false);
  const [cardFlip, setCardFlip] = useState(false);
  const [patternReveal, setPatternReveal] = useState(false);

  const triggerHeartbeat = () => {
    setHeartbeat(true);
    setTimeout(() => setHeartbeat(false), 600);
  };

  const triggerWeather = () => {
    setWeatherTransition(true);
    setTimeout(() => setWeatherTransition(false), 2000);
  };

  const triggerCardFlip = () => {
    setCardFlip(true);
    setTimeout(() => setCardFlip(false), 600);
  };

  const triggerPattern = () => {
    setPatternReveal(true);
    setTimeout(() => setPatternReveal(false), 1500);
  };

  return (
    <Card className="p-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-white/10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          ✨ ADVANCED ANIMATIONS
        </h2>
        <p className="text-sm text-gray-400">Signature micro-interactions that bring the app to life</p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* HEARTBEAT TAP */}
        <Card className="p-6 bg-gradient-to-br from-red-500/10 to-pink-500/10 border-red-500/20">
          <div className="text-center mb-4">
            <h3 className="text-white font-semibold mb-2">1. THE HEARTBEAT TAP</h3>
            <p className="text-sm text-gray-400 mb-4">
              Heart icon "beats" once with haptic feedback
            </p>
          </div>

          <div className="flex justify-center mb-6">
            <button
              onClick={triggerHeartbeat}
              className={`text-6xl transition-all duration-200 ${
                heartbeat ? 'scale-125' : 'scale-100'
              }`}
            >
              {heartbeat ? '❤️' : '♥️'}
            </button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            <div className="mb-2">Animation: scale 1.0 → 1.2 → 1.0</div>
            <div className="mb-2">Duration: 200ms</div>
            <div>Haptic: Light impact</div>
          </div>
        </Card>

        {/* WEATHER TRANSITION */}
        <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
          <div className="text-center mb-4">
            <h3 className="text-white font-semibold mb-2">2. WEATHER TRANSITION</h3>
            <p className="text-sm text-gray-400 mb-4">Weather icon morphs with particle effects</p>
          </div>

          <div className="flex justify-center mb-6">
            <div className="text-6xl transition-all duration-800">
              {!weatherTransition && '☀️'}
              {weatherTransition && '🌧️'}
            </div>
          </div>

          <Button
            onClick={triggerWeather}
            className="w-full bg-blue-500/20 border border-blue-500/30 text-blue-300"
            disabled={weatherTransition}
          >
            Trigger Transition
          </Button>

          <div className="text-xs text-gray-500 text-center mt-4">
            <div className="mb-2">☀️ → particles fade → ⛅ → clouds drift → 🌧️</div>
            <div>Duration: 800ms with easing</div>
          </div>
        </Card>

        {/* CARD FLIP */}
        <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border-purple-500/20">
          <div className="text-center mb-4">
            <h3 className="text-white font-semibold mb-2">3. CARD FLIP</h3>
            <p className="text-sm text-gray-400 mb-4">Tarot card 3D rotation with edge glow</p>
          </div>

          <div className="flex justify-center mb-6">
            <div
              className={`w-32 h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500/30 rounded-lg flex items-center justify-center text-4xl transition-all duration-600 ${
                cardFlip ? 'rotate-y-180' : ''
              }`}
              style={{
                transform: cardFlip ? 'rotateY(180deg)' : 'rotateY(0deg)',
                transformStyle: 'preserve-3d',
              }}
            >
              {cardFlip ? '🃏' : '❓'}
            </div>
          </div>

          <Button
            onClick={triggerCardFlip}
            className="w-full bg-purple-500/20 border border-purple-500/30 text-purple-300"
            disabled={cardFlip}
          >
            Flip Card
          </Button>

          <div className="text-xs text-gray-500 text-center mt-4">
            <div className="mb-2">[░░░] → [flip 180°] → [███]</div>
            <div>Duration: 600ms</div>
          </div>
        </Card>

        {/* PATTERN DISCOVERY */}
        <Card className="p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
          <div className="text-center mb-4">
            <h3 className="text-white font-semibold mb-2">4. PATTERN DISCOVERY</h3>
            <p className="text-sm text-gray-400 mb-4">"Excavation" effect reveals artifact</p>
          </div>

          <div className="flex justify-center mb-6">
            <div className="relative">
              {!patternReveal && (
                <div className="text-6xl opacity-30 blur-sm">🏺</div>
              )}
              {patternReveal && (
                <div className="text-6xl animate-in zoom-in fade-in duration-1000">
                  🏺
                </div>
              )}
            </div>
          </div>

          <Button
            onClick={triggerPattern}
            className="w-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-300"
            disabled={patternReveal}
          >
            Discover Pattern
          </Button>

          <div className="text-xs text-gray-500 text-center mt-4">
            <div className="mb-2">[dirt blur] → [brush away] → [🏺 glow]</div>
            <div>Duration: 1500ms</div>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-gray-900/50 border-white/10 mb-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          MORE MICRO-INTERACTIONS
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="text-purple-300 font-semibold mb-2">Compass Needle:</h4>
            <p className="text-gray-400 mb-2">Subtle wobble like real compass, settles gradually</p>
            <div className="text-xs text-gray-500">→ → → ← → (wobble) → (settle)</div>
          </div>

          <div>
            <h4 className="text-blue-300 font-semibold mb-2">Score Counter:</h4>
            <p className="text-gray-400 mb-2">Numbers count up with easing animation</p>
            <div className="text-xs text-gray-500">0 → 25 → 50 → 72 (ease-out)</div>
          </div>

          <div>
            <h4 className="text-green-300 font-semibold mb-2">Achievement Pop:</h4>
            <p className="text-gray-400 mb-2">Slide in from top with bounce</p>
            <div className="text-xs text-gray-500">Slide + scale + bounce + confetti</div>
          </div>

          <div>
            <h4 className="text-orange-300 font-semibold mb-2">Loading Pulse:</h4>
            <p className="text-gray-400 mb-2">Smooth breathing effect while loading</p>
            <div className="text-xs text-gray-500">opacity 0.5 ↔ 1.0 (infinite)</div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-blue-500/10 border-blue-500/20">
        <h4 className="text-white font-semibold mb-4">ANIMATION PRINCIPLES:</h4>
        <div className="space-y-3 text-sm text-gray-300">
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2" />
            <span>
              <strong className="text-blue-300">Purpose-driven:</strong> Every animation has meaning,
              never decorative only
            </span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2" />
            <span>
              <strong className="text-blue-300">Performance:</strong> 60fps, GPU-accelerated,
              optimized for mobile
            </span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2" />
            <span>
              <strong className="text-blue-300">Timing:</strong> Natural easing curves, respects
              user's reduced-motion preferences
            </span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2" />
            <span>
              <strong className="text-blue-300">Consistency:</strong> Same elements animate the same
              way everywhere
            </span>
          </div>
        </div>
      </Card>
    </Card>
  );
}
