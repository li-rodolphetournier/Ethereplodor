# Script d'installation MCP pour Windows PowerShell
# Ce script configure Context7 MCP Server pour Cursor

Write-Host "🚀 Installation de Context7 MCP Server..." -ForegroundColor Cyan

$cursorConfigPath = "$env:APPDATA\Cursor\User\globalStorage\saoudiqashmiri.mcp\mcp.json"
$configDir = Split-Path -Parent $cursorConfigPath

# Créer le répertoire si nécessaire
if (-not (Test-Path $configDir)) {
    Write-Host "📁 Création du répertoire de configuration..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $configDir -Force | Out-Null
}

# Configuration MCP
$mcpConfig = @{
    mcpServers = @{
        context7 = @{
            command = "npx"
            args = @("-y", "@upstash/context7-mcp@latest")
        }
    }
} | ConvertTo-Json -Depth 10

# Sauvegarder la configuration
Write-Host "💾 Écriture de la configuration dans $cursorConfigPath..." -ForegroundColor Yellow
$mcpConfig | Out-File -FilePath $cursorConfigPath -Encoding UTF8

Write-Host "✅ Configuration MCP installée avec succès!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Prochaines étapes:" -ForegroundColor Cyan
Write-Host "   1. Redémarrez Cursor" -ForegroundColor White
Write-Host "   2. Le serveur MCP devrait être actif automatiquement" -ForegroundColor White
Write-Host ""
Write-Host "🔍 Pour vérifier, ouvrez les paramètres Cursor > Extensions > MCP" -ForegroundColor Cyan

