# 🚀 Configuration Git - Première utilisation

## ✅ Configuration actuelle

- **Dépôt local**: Initialisé
- **Remote origin**: `https://github.com/li-rodolphetournier/Ethereplodor.git`
- **Branche principale**: `main`

## 📤 Premier push vers GitHub

### 1. Ajouter tous les fichiers au staging

```bash
git add .
```

### 2. Créer le premier commit

```bash
git commit -m "feat: initialisation du projet Diablo-Pokémon 3D"
```

Ou utiliser le script helper :

```powershell
# Windows
.\scripts\git-commit.ps1 -Type feat -Scope config -Description "initialisation du projet Diablo-Pokémon 3D" -SkipChecks

# Linux/Mac
./scripts/git-commit.sh feat config "initialisation du projet Diablo-Pokémon 3D" --skip-checks
```

### 3. Pousser vers GitHub

```bash
git push -u origin main
```

**Note**: Si c'est la première fois, GitHub peut demander une authentification. Vous pouvez :
- Utiliser un Personal Access Token (recommandé)
- Configurer SSH pour une authentification plus simple

## 🔄 Workflow quotidien

### Après chaque modification importante

1. **Vérifier les changements**:
   ```bash
   git status
   git diff
   ```

2. **Ajouter les fichiers**:
   ```bash
   git add .
   # ou pour des fichiers spécifiques
   git add src/components/game/Player.tsx
   ```

3. **Créer un commit** (utiliser le script helper ou manuellement):
   ```bash
   git commit -m "feat(player): description du changement"
   ```

4. **Pousser vers GitHub**:
   ```bash
   git push
   ```

## 🔐 Configuration de l'authentification

### Option 1: Personal Access Token (PAT)

1. Aller sur GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Générer un nouveau token avec les permissions `repo`
3. Utiliser le token comme mot de passe lors du push

### Option 2: SSH (recommandé pour usage fréquent)

1. **Générer une clé SSH** (si pas déjà fait):
   ```bash
   ssh-keygen -t ed25519 -C "votre-email@example.com"
   ```

2. **Ajouter la clé à l'agent SSH**:
   ```bash
   eval "$(ssh-agent -s)"
   ssh-add ~/.ssh/id_ed25519
   ```

3. **Copier la clé publique**:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```

4. **Ajouter sur GitHub**: Settings → SSH and GPG keys → New SSH key

5. **Changer l'URL du remote**:
   ```bash
   git remote set-url origin git@github.com:li-rodolphetournier/Ethereplodor.git
   ```

## 📋 Commandes utiles

```bash
# Voir l'état du dépôt
git status

# Voir les différences
git diff

# Voir l'historique
git log --oneline --graph

# Voir les remotes configurés
git remote -v

# Récupérer les changements distants
git fetch origin

# Fusionner les changements distants
git pull origin main
```

## 🆘 Problèmes courants

### Erreur: "remote origin already exists"
```bash
# Vérifier le remote actuel
git remote -v

# Si besoin, supprimer et réajouter
git remote remove origin
git remote add origin https://github.com/li-rodolphetournier/Ethereplodor.git
```

### Erreur: "failed to push some refs"
```bash
# Récupérer d'abord les changements distants
git pull origin main --rebase

# Puis pousser
git push
```

## 📚 Ressources

- [Guide workflow Git](./GIT_WORKFLOW.md) - Détails sur les conventions de commit
- [GitHub Docs](https://docs.github.com) - Documentation officielle

