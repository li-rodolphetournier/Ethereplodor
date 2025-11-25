#!/bin/bash
# Script d'installation MCP pour Linux/macOS
# Ce script configure Context7 MCP Server pour Cursor

echo "🚀 Installation de Context7 MCP Server..."

# Déterminer le chemin de configuration selon l'OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    CURSOR_CONFIG_DIR="$HOME/Library/Application Support/Cursor/User/globalStorage/saoudiqashmiri.mcp"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    CURSOR_CONFIG_DIR="$HOME/.config/Cursor/User/globalStorage/saoudiqashmiri.mcp"
else
    echo "❌ OS non supporté: $OSTYPE"
    exit 1
fi

CURSOR_CONFIG_FILE="$CURSOR_CONFIG_DIR/mcp.json"

# Créer le répertoire si nécessaire
if [ ! -d "$CURSOR_CONFIG_DIR" ]; then
    echo "📁 Création du répertoire de configuration..."
    mkdir -p "$CURSOR_CONFIG_DIR"
fi

# Configuration MCP
cat > "$CURSOR_CONFIG_FILE" << 'EOF'
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
EOF

echo "✅ Configuration MCP installée avec succès!"
echo ""
echo "📝 Prochaines étapes:"
echo "   1. Redémarrez Cursor"
echo "   2. Le serveur MCP devrait être actif automatiquement"
echo ""
echo "🔍 Pour vérifier, ouvrez les paramètres Cursor > Extensions > MCP"

