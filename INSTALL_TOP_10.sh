#!/bin/bash

# 1MarketPulse - Top 10 Priority Components Installer
# Run this from /tmp/sandbox directory

echo "🚀 Installing Top 10 Priority Components..."
echo ""

# Component list
components=(
  "PatternPlayground"
  "WhatIfSimulator"
  "SmartWatchlist"
  "Leaderboards"
  "WeeklyEvolution"
  "FluidOnboarding"
  "MicroSimulations"
  "ContextualQuizzes"
  "TimeMachine"
)

# Check if source directory exists
if [ ! -d "tmp/sandbox/src/app/components" ]; then
  echo "❌ Error: Source directory not found!"
  echo "Make sure you're in /tmp/sandbox"
  exit 1
fi

# Create destination if needed
mkdir -p src/app/components

# Copy each component
success=0
for component in "${components[@]}"; do
  src="tmp/sandbox/src/app/components/${component}.tsx"
  dest="src/app/components/${component}.tsx"
  
  if [ -f "$src" ]; then
    cat "$src" > "$dest"
    echo "✅ Copied: ${component}.tsx"
    ((success++))
  else
    echo "⚠️  Not found: ${component}.tsx"
  fi
done

echo ""
echo "📊 Results:"
echo "  - Successful: $success/${#components[@]}"
echo "  - Already had: PaperTrading.tsx ✅"
echo ""
echo "🎉 Installation complete!"
echo ""
echo "Next steps:"
echo "1. Check src/app/components/ for new files"
echo "2. Run: npm install"
echo "3. Run: npm run dev"
echo "4. Push to GitHub: git add . && git commit -m '✨ Added Top 10 features' && git push"
