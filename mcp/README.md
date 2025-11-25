# Configuration MCP (Model Context Protocol)

Ce dossier contient la configuration des serveurs MCP pour Cursor.

## Serveurs MCP configurés

### Context7 MCP Server

Context7 fournit une documentation en temps réel pour améliorer les suggestions de code IA.

**Fonctionnalités :**
- Documentation à jour pour Python, React, et autres bibliothèques
- Réduit les hallucinations et suggestions obsolètes
- Support multi-outils (VS Code, Cursor, etc.)

## Installation

### Méthode 1 : Configuration automatique (Recommandée)

1. Ouvrez Cursor
2. Allez dans `Fichier > Paramètres > Extensions > Cursor`
3. Cliquez sur **"Ajouter un nouveau serveur MCP global"**
4. Utilisez les valeurs suivantes :
   - **Nom** : `context7`
   - **Commande** : `npx`
   - **Arguments** : `-y @upstash/context7-mcp@latest`

### Méthode 2 : Configuration manuelle

Copiez le contenu de `mcp.json` dans votre fichier de configuration Cursor :

**Windows :**
```
%APPDATA%\Cursor\User\globalStorage\saoudiqashmiri.mcp\mcp.json
```

**macOS :**
```
~/Library/Application Support/Cursor/User/globalStorage/saoudiqashmiri.mcp/mcp.json
```

**Linux :**
```
~/.config/Cursor/User/globalStorage/saoudiqashmiri.mcp/mcp.json
```

### Méthode 3 : Runtimes alternatifs

#### Bun
```json
{
  "command": "bunx",
  "args": ["-y", "@upstash/context7-mcp@latest"]
}
```

#### Deno
```json
{
  "command": "deno",
  "args": ["run", "--allow-net", "npm:@upstash/context7-mcp"]
}
```

## Vérification

Après installation, redémarrez Cursor. Le serveur MCP devrait être actif automatiquement.

## Dépannage

### Erreur "Module not found"
```bash
npm update @upstash/context7-mcp
npx clear-npx-cache
```

### Délais d'attente dépassés
Augmentez le timeout dans la configuration :
```json
{
  "timeout": 120
}
```

## Ressources

- [Documentation Context7](https://onedollarvps.com/fr/blogs/how-to-run-and-use-context7-mcp-server.html)
- [Documentation MCP](https://modelcontextprotocol.io)

