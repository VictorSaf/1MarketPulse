import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MessageCircle, Star, TrendingUp, Users } from 'lucide-react';

interface Mentor {
  id: string;
  username: string;
  avatar: string;
  level: number;
  accuracy: number;
  experience: string;
  specialization: string;
  mentees: number;
  rating: number;
}

const availableMentors: Mentor[] = [
  {
    id: '1',
    username: 'TechTrader',
    avatar: '🦊',
    level: 34,
    accuracy: 89,
    experience: '6 months',
    specialization: 'Tech stocks, Pattern recognition',
    mentees: 3,
    rating: 4.8,
  },
  {
    id: '2',
    username: 'CryptoMaster',
    avatar: '🚀',
    level: 42,
    accuracy: 85,
    experience: '8 months',
    specialization: 'Crypto, Momentum trading',
    mentees: 5,
    rating: 4.9,
  },
];

export function MentorshipSystem() {
  return (
    <Card className="p-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-white/10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          🎓 MENTORSHIP SYSTEM
        </h2>
        <p className="text-sm text-gray-400">Learn from experienced traders, or become a mentor yourself</p>
      </div>

      <Card className="p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-3xl">
            🦊
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-white">YOUR MENTOR: @TechTrader</h3>
              <Badge className="bg-green-500/20 text-green-300 border-green-400/30">
                <Star className="w-3 h-3 mr-1" />
                Active
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
              <div>
                <div className="text-gray-400">Level</div>
                <div className="text-white font-semibold">34</div>
              </div>
              <div>
                <div className="text-gray-400">Accuracy</div>
                <div className="text-green-400 font-semibold">89%</div>
              </div>
              <div>
                <div className="text-gray-400">Experience</div>
                <div className="text-white font-semibold">6 months</div>
              </div>
            </div>
            <p className="text-sm text-gray-300 mb-3">
              <strong className="text-blue-300">Specialization:</strong> Tech stocks, Pattern recognition
            </p>
            <div className="flex gap-3">
              <Button
                size="sm"
                className="bg-blue-500/20 border border-blue-500/30 text-blue-300"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Send Message
              </Button>
              <Button size="sm" variant="outline" className="border-white/10">
                View Profile
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gray-900/50 border-white/10 mb-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-400" />
          WHAT YOU GET
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
              ✓
            </div>
            <div>
              <div className="text-white font-semibold mb-1">Feedback on predictions (async)</div>
              <div className="text-gray-400">Get expert insights on your trading decisions</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 flex-shrink-0">
              ✓
            </div>
            <div>
              <div className="text-white font-semibold mb-1">Q&A (24h response time)</div>
              <div className="text-gray-400">Ask questions about strategies and setups</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
              ✓
            </div>
            <div>
              <div className="text-white font-semibold mb-1">Weekly personalized tip</div>
              <div className="text-gray-400">Tailored advice based on your progress</div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-purple-500/10 border-purple-500/20 mb-6">
        <h3 className="text-white font-semibold mb-4">FIND A NEW MENTOR</h3>
        <div className="space-y-4">
          {availableMentors.map((mentor) => (
            <Card key={mentor.id} className="p-5 bg-gray-900/50 border-white/10">
              <div className="flex items-start gap-4">
                <div className="text-4xl">{mentor.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-white font-semibold">{mentor.username}</span>
                    <Badge variant="secondary" className="text-xs">
                      Level {mentor.level}
                    </Badge>
                    <div className="flex items-center gap-1 text-yellow-400 text-sm">
                      <Star className="w-3 h-3 fill-current" />
                      {mentor.rating}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-2 text-xs">
                    <div>
                      <span className="text-gray-400">Accuracy:</span>{' '}
                      <span className="text-green-400 font-semibold">{mentor.accuracy}%</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Experience:</span>{' '}
                      <span className="text-white">{mentor.experience}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Mentees:</span>{' '}
                      <span className="text-white">{mentor.mentees}/5</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{mentor.specialization}</p>
                  <Button
                    size="sm"
                    className="bg-purple-500/20 border border-purple-500/30 text-purple-300"
                  >
                    Request Mentor
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
        <div className="flex items-start gap-4">
          <TrendingUp className="w-8 h-8 text-yellow-400 flex-shrink-0" />
          <div>
            <h3 className="text-white font-bold mb-3">BECOME A MENTOR (Level 25+)</h3>
            <div className="space-y-2 text-sm text-gray-300 mb-4">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-2" />
                <span>
                  <strong className="text-yellow-300">Earn 2x XP</strong> for mentorship activities
                </span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-2" />
                <span>
                  <strong className="text-yellow-300">Get "Mentor" badge</strong> (prestigious!)
                </span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-2" />
                <span>
                  <strong className="text-yellow-300">Access mentor-only features</strong>
                </span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-2" />
                <span>
                  <strong className="text-yellow-300">Priority support</strong>
                </span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-black/20 border border-white/10 text-sm">
              <strong className="text-white">Time commitment:</strong>{' '}
              <span className="text-gray-400">10-15 min/week per mentee</span>
            </div>
            <Button
              className="mt-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
              disabled
            >
              Unlock at Level 25
            </Button>
          </div>
        </div>
      </Card>
    </Card>
  );
}
