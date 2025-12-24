import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Volume2, VolumeX, Music, Bell } from 'lucide-react';

interface SoundTheme {
  name: string;
  description: string;
  icon: string;
  ambient: string;
  notifications: string;
}

const themes: SoundTheme[] = [
  {
    name: 'Sunny Market',
    description: 'Calm, optimistic tones',
    icon: '☀️',
    ambient: 'Gentle wind chimes, soft ambient synth (major key)',
    notifications: 'Pleasant bell sounds',
  },
  {
    name: 'Rainy Market',
    description: 'Subdued, cautious atmosphere',
    icon: '🌧️',
    ambient: 'Light rain ambient, lower synth pad (minor key)',
    notifications: 'Soft rain drops',
  },
  {
    name: 'Stormy Market',
    description: 'Intense, high-energy',
    icon: '⛈️',
    ambient: 'Heavy rain, wind, tense strings',
    notifications: 'Thunder rumble, lightning crack',
  },
];

const notificationSounds = [
  { event: 'Pattern Found', sound: 'Crystal chime', icon: '🔔' },
  { event: 'Position Profit', sound: 'Cash register (subtle)', icon: '💰' },
  { event: 'Stop Hit', sound: 'Low gong (somber)', icon: '📉' },
  { event: 'Achievement', sound: 'Triumphant horn', icon: '🏆' },
  { event: 'Alert', sound: 'Radar ping', icon: '⚠️' },
];

export function SoundDesign() {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [volume, setVolume] = useState(80);
  const [selectedTheme, setSelectedTheme] = useState(0);

  return (
    <Card className="p-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-white/10">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              🔊 SOUND DESIGN
            </h2>
            <p className="text-sm text-gray-400">Immersive audio experience for market states</p>
          </div>
          <Button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={
              audioEnabled
                ? 'bg-green-500/20 border border-green-500/30 text-green-300'
                : 'bg-gray-500/20 border border-gray-500/30 text-gray-400'
            }
          >
            {audioEnabled ? (
              <>
                <Volume2 className="w-4 h-4 mr-2" />
                Audio ON
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 mr-2" />
                Audio OFF
              </>
            )}
          </Button>
        </div>
      </div>

      {audioEnabled && (
        <Card className="p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20 mb-6 animate-in slide-in-from-top">
          <div className="flex items-center gap-3 mb-4">
            <Music className="w-6 h-6 text-green-400" />
            <div>
              <h3 className="text-white font-semibold">Audio Experience Active</h3>
              <p className="text-sm text-gray-400">Market sounds adapt to conditions in real-time</p>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-400">Master Volume</span>
              <span className="text-white font-semibold">{volume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
          </div>
        </Card>
      )}

      <Card className="p-6 bg-gray-900/50 border-white/10 mb-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Music className="w-5 h-5 text-blue-400" />
          AMBIENT SOUNDSCAPES
        </h3>
        <div className="space-y-3">
          {themes.map((theme, index) => (
            <Card
              key={index}
              className={`p-5 cursor-pointer transition-all ${
                selectedTheme === index
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30'
                  : 'bg-gray-900/30 border-white/10 hover:bg-gray-900/50'
              }`}
              onClick={() => setSelectedTheme(index)}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{theme.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-white font-semibold">{theme.name}</h4>
                    {selectedTheme === index && (
                      <Badge className="bg-green-500/20 text-green-300 border-green-400/30">
                        ACTIVE
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{theme.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <Music className="w-4 h-4 text-purple-400 mt-0.5" />
                      <div>
                        <div className="text-gray-500 text-xs">Ambient:</div>
                        <div className="text-gray-300">{theme.ambient}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Bell className="w-4 h-4 text-blue-400 mt-0.5" />
                      <div>
                        <div className="text-gray-500 text-xs">Notifications:</div>
                        <div className="text-gray-300">{theme.notifications}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-purple-500/10 border-purple-500/20 mb-6">
        <h3 className="text-white font-semibold mb-4">NOTIFICATION SOUNDS</h3>
        <div className="space-y-2">
          {notificationSounds.map((sound, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-900/30 border border-white/10"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">{sound.icon}</div>
                <div>
                  <div className="text-white font-semibold text-sm">{sound.event}</div>
                  <div className="text-xs text-gray-400">{sound.sound}</div>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-white/10 text-xs"
                disabled={!audioEnabled}
              >
                Test
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-6 bg-blue-500/10 border-blue-500/20">
          <h4 className="text-white font-semibold mb-3">BENEFITS:</h4>
          <div className="space-y-2 text-sm text-gray-300">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2" />
              <span>Immersive market experience</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2" />
              <span>Audio cues for important events</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2" />
              <span>Enhanced pattern recognition</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-green-500/10 border-green-500/20">
          <h4 className="text-white font-semibold mb-3">CONTROLS:</h4>
          <div className="space-y-2 text-sm text-gray-300">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2" />
              <span>Toggle on/off anytime</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2" />
              <span>Adjust volume independently</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2" />
              <span>Choose ambient theme</span>
            </div>
          </div>
        </Card>
      </div>

      {!audioEnabled && (
        <div className="mt-6 text-center p-4 rounded-lg bg-gray-900/30 border border-white/5">
          <p className="text-sm text-gray-500">
            💡 Enable audio to experience the full immersive market atmosphere
          </p>
        </div>
      )}
    </Card>
  );
}
