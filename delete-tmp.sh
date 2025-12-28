#!/bin/bash

# Script pentru ștergerea /tmp/sandbox/
# Rulează acest script doar dacă vrei să ștergi /tmp/ pentru a elibera spațiu

echo "1MarketPulse - Delete /tmp/ Directory"
echo "=============================================="
echo ""
echo "⚠️  ATENȚIE: Acest script va șterge complet directorul /tmp/"
echo ""
echo "ℹ️  Ce se va întâmpla:"
echo "   ✅ Aplicația va funcționa normal (folosește /src/)"
echo "   ✅ Git va ignora oricum /tmp/ (prin .gitignore)"
echo "   ✅ Vei elibera ~500MB spațiu"
echo ""
echo "❓ Continui? (y/N)"
read -r response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo ""
    echo "🗑️  Șterg /tmp/..."
    
    if [ -d "tmp" ]; then
        rm -rf tmp/
        echo "✅ /tmp/ a fost șters cu succes!"
        echo ""
        echo "📊 Verificare:"
        echo "   - Aplicația: npm run dev (ar trebui să funcționeze)"
        echo "   - Git: git status (ar trebui fără /tmp/)"
    else
        echo "ℹ️  Directorul /tmp/ nu există sau a fost deja șters"
    fi
else
    echo ""
    echo "❌ Operațiune anulată"
    echo "ℹ️  /tmp/ rămâne, dar Git îl va ignora oricum"
fi

echo ""
echo "✅ Done!"
