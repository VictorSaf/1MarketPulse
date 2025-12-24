#!/bin/bash

# Copy all missing components from tmp to src
# Run this from project root

echo "🚀 Copying missing components..."
echo ""

# Components to copy (the ones not already in src/)
COMPONENTS=(
  "AdvancedAnimations.tsx"
  "AlertConfigurator.tsx"
  "AllComponents.tsx"
  "CommunityChallenges.tsx"
  "ContextualLearning.tsx"
  "ContextualQuizzes.tsx"
  "CuriosityGaps.tsx"
  "CustomIndicators.tsx"
  "DailyMorphing.tsx"
  "DailyRitualBuilder.tsx"
  "EasterEggsSystem.tsx"
  "EnhancedAchievementStories.tsx"
  "FluidOnboarding.tsx"
  "HomeScreenMorphing.tsx"
  "Leaderboards.tsx"
  "MentorshipSystem.tsx"
  "MicroSimulations.tsx"
  "PaperTrading.tsx"
  "PatternPlayground.tsx"
  "PersonaContentAdapter.tsx"
  "Priority1.tsx"
  "Priority23.tsx"
  "Priority4.tsx"
  "Priority5.tsx"
  "ProgressiveRevelation.tsx"
  "SmartWatchlist.tsx"
  "SocialProofNotifications.tsx"
  "SoundDesign.tsx"
  "SurpriseSystem.tsx"
  "TimeMachine.tsx"
  "TraderPersonality.tsx"
  "WeeklyEvolution.tsx"
  "WhatIfSimulator.tsx"
)

SOURCE="/tmp/sandbox/tmp/sandbox/src/app/components"
DEST="/tmp/sandbox/src/app/components"

COPIED=0
for comp in "${COMPONENTS[@]}"; do
  if [ -f "$SOURCE/$comp" ]; then
    cp "$SOURCE/$comp" "$DEST/"
    echo "✅ Copied: $comp"
    COPIED=$((COPIED + 1))
  else
    echo "⚠️  Not found: $comp"
  fi
done

echo ""
echo "✨ Done! Copied $COPIED components"
echo ""
echo "📊 Total components now:"
find "$DEST" -maxdepth 1 -name "*.tsx" -type f | wc -l

echo ""
echo "🎉 All components copied! Ready to commit."
