# PowerShell script pentru ștergerea /tmp/sandbox/
# Rulează acest script doar dacă vrei să ștergi /tmp/ pentru a elibera spațiu

Write-Host "🗑️  1MarketHood PULSE - Delete /tmp/ Directory" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  ATENȚIE: Acest script va șterge complet directorul /tmp/" -ForegroundColor Yellow
Write-Host ""
Write-Host "ℹ️  Ce se va întâmpla:" -ForegroundColor White
Write-Host "   ✅ Aplicația va funcționa normal (folosește /src/)" -ForegroundColor Green
Write-Host "   ✅ Git va ignora oricum /tmp/ (prin .gitignore)" -ForegroundColor Green
Write-Host "   ✅ Vei elibera ~500MB spațiu" -ForegroundColor Green
Write-Host ""

$response = Read-Host "❓ Continui? (y/N)"

if ($response -eq 'y' -or $response -eq 'Y') {
    Write-Host ""
    Write-Host "🗑️  Șterg /tmp/..." -ForegroundColor Yellow
    
    if (Test-Path -Path ".\tmp") {
        Remove-Item -Recurse -Force -Path ".\tmp"
        Write-Host "✅ /tmp/ a fost șters cu succes!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📊 Verificare:" -ForegroundColor Cyan
        Write-Host "   - Aplicația: npm run dev (ar trebui să funcționeze)" -ForegroundColor White
        Write-Host "   - Git: git status (ar trebui fără /tmp/)" -ForegroundColor White
    } else {
        Write-Host "ℹ️  Directorul /tmp/ nu există sau a fost deja șters" -ForegroundColor Yellow
    }
} else {
    Write-Host ""
    Write-Host "❌ Operațiune anulată" -ForegroundColor Red
    Write-Host "ℹ️  /tmp/ rămâne, dar Git îl va ignora oricum" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Done!" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
