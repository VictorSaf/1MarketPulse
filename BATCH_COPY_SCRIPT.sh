#!/bin/bash
# 1MarketHood PULSE - Batch Component Copier
# Run this script locally after downloading the project

echo "🚀 Copying all remaining components..."

# List of all components to copy
components=(
  "MicroSimulations"
  "ContextualQuizzes"
  "TimeMachine"
  "AdvancedAnimations"
  "AlertConfigurator"
  "AllComponents"
  "CommunityChallenges"
  "ContextualLearning"
  "CuriosityGaps"
  "CustomIndicators"
  "DailyMorphing"
  "DailyRitualBuilder"
  "DecisionJournal"
  "EasterEggsSystem"
  "EnhancedAchievementStories"
  "HomeScreenMorphing"
  "MentorshipSystem"
  "PersonaContentAdapter"
  "Priority1"
  "Priority23"
  "Priority4"
  "Priority5"
  "ProgressiveRevelation"
  "SocialProofNotifications"
  "SoundDesign"
  "SurpriseSystem"
  "TraderPersonality"
)

count=0
for comp in "${components[@]}"; do
  src="/tmp/sandbox/tmp/sandbox/src/app/components/${comp}.tsx"
  dest="/tmp/sandbox/src/app/components/${comp}.tsx"
  
  if [ -f "$src" ]; then
    cat "$src" > "$dest" 2>/dev/null && {
      echo "✅ $comp.tsx"
      ((count++))
    } || echo "⚠️  Failed: $comp.tsx"
  else
    echo "❌ Not found: $comp.tsx"
  fi
done

echo ""
echo "📊 Copied $count/${#components[@]} components"
echo "🎉 Done!"
