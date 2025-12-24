// Priority 4 - Adaptive & Personalization Components
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { User, Brain, Sparkles, Calendar, Trophy } from 'lucide-react';

export function FluidOnboarding() {
  return (<Card className="glass-card"><CardHeader><CardTitle><User className="w-5 h-5 inline mr-2"/>Fluid Onboarding</CardTitle></CardHeader><CardContent><p className="text-gray-400">Behavior-based onboarding</p></CardContent></Card>);
}

export function PersonaContentAdapter() {
  return (<Card className="glass-card"><CardHeader><CardTitle>🎭 Persona Adapter</CardTitle></CardHeader><CardContent><p className="text-gray-400">5 personas content adaptation</p></CardContent></Card>);
}

export function DailyMorphing() {
  return (<Card className="glass-card"><CardHeader><CardTitle>🔄 Daily Morphing</CardTitle></CardHeader><CardContent><p className="text-gray-400">App changes daily</p></CardContent></Card>);
}

export function ProgressiveRevelation() {
  return (<Card className="glass-card"><CardHeader><CardTitle>🔓 Progressive Revelation</CardTitle></CardHeader><CardContent><p className="text-gray-400">Unlock features as you learn</p></CardContent></Card>);
}

export function SurpriseSystem() {
  return (<Card className="glass-card"><CardHeader><CardTitle><Sparkles className="w-5 h-5 inline mr-2"/>Surprise System</CardTitle></CardHeader><CardContent><p className="text-gray-400">Daily surprises</p><Button className="mt-4">Today's Surprise</Button></CardContent></Card>);
}

export function ContextualQuizzes() {
  return (<Card className="glass-card"><CardHeader><CardTitle>❓ Contextual Quizzes</CardTitle></CardHeader><CardContent><p className="text-gray-400">Learn while browsing</p></CardContent></Card>);
}

export function TraderPersonality() {
  return (<Card className="glass-card"><CardHeader><CardTitle><Brain className="w-5 h-5 inline mr-2"/>Trader Personality</CardTitle></CardHeader><CardContent><p className="text-gray-400">Your trading archetype</p><Badge className="mt-2">🦊 The Fox</Badge></CardContent></Card>);
}

export function CuriosityGaps() {
  return (<Card className="glass-card"><CardHeader><CardTitle>🔮 Curiosity Gaps</CardTitle></CardHeader><CardContent><p className="text-gray-400">Mystery insights</p></CardContent></Card>);
}

export function DailyRitualBuilder() {
  return (<Card className="glass-card"><CardHeader><CardTitle><Calendar className="w-5 h-5 inline mr-2"/>Daily Ritual</CardTitle></CardHeader><CardContent><p className="text-gray-400">Your personalized routine</p></CardContent></Card>);
}

export function AdaptiveComplexity() {
  return (<Card className="glass-card"><CardHeader><CardTitle>📊 Adaptive Complexity</CardTitle></CardHeader><CardContent><p className="text-gray-400">Content adjusts to your level</p></CardContent></Card>);
}

export function ContextualLearning() {
  return (<Card className="glass-card"><CardHeader><CardTitle>💡 Contextual Learning</CardTitle></CardHeader><CardContent><p className="text-gray-400">Learn in context</p></CardContent></Card>);
}

export function HomeScreenMorphing() {
  return (<Card className="glass-card"><CardHeader><CardTitle>🏠 Home Morphing</CardTitle></CardHeader><CardContent><p className="text-gray-400">Dynamic home screen</p></CardContent></Card>);
}

export function EasterEggsSystem() {
  return (<Card className="glass-card"><CardHeader><CardTitle><Trophy className="w-5 h-5 inline mr-2"/>Easter Eggs</CardTitle></CardHeader><CardContent><p className="text-gray-400">Hidden surprises</p></CardContent></Card>);
}
