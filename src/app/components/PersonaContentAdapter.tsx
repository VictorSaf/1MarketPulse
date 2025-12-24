import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

type Persona = 'explorer' | 'student' | 'practitioner' | 'analyst' | 'pro';

interface ContentVersion {
  title: string;
  content: string;
  action?: string;
}

const vixContent: Record<Persona, ContentVersion> = {
  explorer: {
    title: '😌 Market is Calm',
    content:
      'VIX = a kind of "fear thermometer" for the stock market. When it\'s low (like now at 14.2), it means investors are relaxed.',
    action: '🎓 Learn more about VIX',
  },
  student: {
    title: '📉 VIX: 14.2 (6-month low)',
    content:
      'What it is: Volatility Index, measures expected volatility derived from S&P 500 options prices. Interpretation: Below 15 = Market complacency. Historically, low VIX preceded spikes in 35% of cases.',
    action: '📊 See VIX chart',
  },
  practitioner: {
    title: '⚠️ VIX 14.2 - Opportunity Alert',
    content:
      'Put options are CHEAP now. Cost of hedging: ~0.5% for 5% protection. Suggestion: If you\'re long, consider taking protection while it\'s affordable.',
    action: '🛡️ Calculate hedge',
  },
  analyst: {
    title: 'VIX 14.2 | VVIX 89 | Contango 8%',
    content:
      'Term structure: 14.2 → 15.8 → 17.2 (M1/M2/M3). Put/Call skew: -2.3 (divergence). Dealer gamma: +$4.2B (will buy dips). Historical analog: Dec 2019 (pre-COVID). Probability spike >25 in 30 days: 23%.',
    action: '📊 Full vol surface',
  },
  pro: {
    title: 'VIX 14.2 ↓8% | Contango 8% | Gamma +$4.2B',
    content: '',
    action: '🛡️ Quick hedge',
  },
};

export function PersonaContentAdapter({ persona = 'student' }: { persona?: Persona }) {
  const content = vixContent[persona];

  return (
    <Card className="p-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-white/10">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Content Adaptation Demo</h2>
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30">
            {persona.toUpperCase()}
          </Badge>
        </div>
        <p className="text-sm text-gray-400">
          Same information, 5 different ways - adapted to your level
        </p>
      </div>

      <Card className="p-6 bg-gray-900/50 border-white/10 mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">{content.title}</h3>
        <p className="text-gray-300 mb-4">{content.content}</p>
        {content.action && (
          <Button className="bg-blue-500/20 border border-blue-500/30 text-blue-300">
            {content.action}
          </Button>
        )}
      </Card>

      <div className="grid grid-cols-5 gap-2">
        {(['explorer', 'student', 'practitioner', 'analyst', 'pro'] as Persona[]).map((p) => (
          <Button
            key={p}
            size="sm"
            variant={p === persona ? 'default' : 'outline'}
            className={p === persona ? 'bg-purple-500 text-white' : 'border-white/10'}
          >
            {p === 'explorer' ? '🌱' : p === 'student' ? '📚' : p === 'practitioner' ? '⚡' : p === 'analyst' ? '🎯' : '🦅'}
          </Button>
        ))}
      </div>

      <Card className="mt-6 p-4 bg-purple-500/10 border-purple-500/20">
        <div className="text-sm text-gray-300">
          <strong className="text-purple-300">How it works:</strong> System detects your level from
          behavior, then automatically adapts ALL content. As you grow, content complexity
          increases naturally.
        </div>
      </Card>
    </Card>
  );
}
