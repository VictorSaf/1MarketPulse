import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Brain, CheckCircle, XCircle } from 'lucide-react';

interface Quiz {
  context: string;
  question: string;
  options: { text: string; correct: boolean; explanation: string }[];
}

const contextualQuiz: Quiz = {
  context: 'You just read: "VIX dropped to 14.2, lowest in 6 months"',
  question: 'Quick check: When yields drop, what usually happens to bond prices?',
  options: [
    {
      text: '📈 They rise',
      correct: true,
      explanation: 'Correct! Bond prices and yields move inversely. When yields fall, bond prices rise.',
    },
    {
      text: '📉 They fall',
      correct: false,
      explanation: 'Not quite. Bond prices and yields move in opposite directions.',
    },
    {
      text: '➡️ Stay the same',
      correct: false,
      explanation: 'No - bond prices and yields have an inverse relationship.',
    },
  ],
};

export function ContextualQuizzes() {
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleAnswer = (index: number) => {
    setSelectedOption(index);
    setAnswered(true);
  };

  return (
    <Card className="p-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-white/10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          🧠 CONTEXTUAL QUIZ
        </h2>
        <p className="text-sm text-gray-400">Learn naturally while reading</p>
      </div>

      <Card className="p-6 bg-gray-900/50 border-white/10 mb-6">
        <div className="flex items-start gap-3 mb-4">
          <Brain className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
          <div>
            <div className="text-sm text-gray-400 mb-2">{contextualQuiz.context}</div>
            <div className="text-white font-semibold">{contextualQuiz.question}</div>
          </div>
        </div>

        <div className="space-y-3">
          {contextualQuiz.options.map((option, index) => (
            <div key={index}>
              <Button
                onClick={() => handleAnswer(index)}
                disabled={answered}
                className={`w-full justify-start text-left transition-all ${
                  !answered
                    ? 'bg-gray-900/50 border border-white/10 hover:bg-gray-900/70'
                    : selectedOption === index
                    ? option.correct
                      ? 'bg-green-500/20 border-green-500/30 text-green-300'
                      : 'bg-red-500/20 border-red-500/30 text-red-300'
                    : option.correct
                    ? 'bg-green-500/10 border-green-500/20 text-green-400'
                    : 'bg-gray-900/30 border-white/5 text-gray-500'
                }`}
              >
                <span className="mr-3">{option.text}</span>
                {answered && (
                  <>
                    {selectedOption === index &&
                      (option.correct ? (
                        <CheckCircle className="w-5 h-5 ml-auto" />
                      ) : (
                        <XCircle className="w-5 h-5 ml-auto" />
                      ))}
                    {selectedOption !== index && option.correct && (
                      <CheckCircle className="w-5 h-5 ml-auto opacity-50" />
                    )}
                  </>
                )}
              </Button>

              {answered && selectedOption === index && (
                <div
                  className={`mt-2 p-3 rounded-lg text-sm ${
                    option.correct
                      ? 'bg-green-500/10 border border-green-500/20 text-green-300'
                      : 'bg-red-500/10 border border-red-500/20 text-red-300'
                  }`}
                >
                  {option.explanation}
                </div>
              )}
            </div>
          ))}
        </div>

        {answered && (
          <Card className="mt-4 p-4 bg-blue-500/10 border-blue-500/20">
            <div className="flex items-center gap-2 text-blue-300 text-sm">
              <Badge className="bg-blue-500/20 text-blue-300">+5 XP</Badge>
              <span>Knowledge reinforced!</span>
            </div>
          </Card>
        )}
      </Card>

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 bg-purple-500/10 border-purple-500/20">
          <div className="text-sm text-gray-400 mb-2">Quiz Type 1</div>
          <div className="text-white font-semibold">In-Reading</div>
          <div className="text-xs text-gray-500 mt-1">While you read news</div>
        </Card>
        <Card className="p-4 bg-blue-500/10 border-blue-500/20">
          <div className="text-sm text-gray-400 mb-2">Quiz Type 2</div>
          <div className="text-white font-semibold">Chart-Based</div>
          <div className="text-xs text-gray-500 mt-1">When viewing charts</div>
        </Card>
        <Card className="p-4 bg-green-500/10 border-green-500/20">
          <div className="text-sm text-gray-400 mb-2">Quiz Type 3</div>
          <div className="text-white font-semibold">Prediction</div>
          <div className="text-xs text-gray-500 mt-1">After you predict</div>
        </Card>
      </div>

      <div className="mt-6 p-4 rounded-lg bg-gray-900/30 border border-white/5">
        <div className="text-sm text-gray-300">
          <strong className="text-purple-300">How it works:</strong> Quizzes appear naturally in
          context - never forced, always relevant. Each correct answer reinforces learning and adds
          XP.
        </div>
      </div>
    </Card>
  );
}
