# 📦 Guide de Workflow Git

Guide pour organiser les sauvegardes Git à chaque modification importante du projet.

## 🎯 Quand faire un commit ?

### ✅ Modifications importantes (COMMIT IMMÉDIAT)

1. **Nouvelle fonctionnalité complète**
   - Système de combat opérationnel
   - Nouveau système (capture, progression, loot)
   - Nouveau composant 3D majeur (Player, Enemy, World)
   - Nouvelle mécanique de gameplay

2. **Correction de bug critique**
   - Crash du jeu
   - Problème de performance majeur
   - Bug de gameplay bloquant

3. **Refactoring significatif**
   - Restructuration d'un module
   - Amélioration d'architecture
   - Optimisation majeure de performance

4. **Ajout de tests**
   - Suite de tests pour un système
   - Tests d'intégration

5. **Changements d'infrastructure**
   - Nouvelle dépendance
   - Configuration build/dev
   - Structure de fichiers

### ⚠️ Modifications mineures (COMMIT GROUPÉ)

- Corrections typographiques
- Formatage de code
- Petites améliorations UI
- Commentaires/documentation mineurs

**Règle**: Grouper 2-3 modifications mineures dans un seul commit.

## 📝 Convention de nommage des commits

Format: `type(scope): description courte`

### Types de commits

- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `refactor`: Refactoring sans changement fonctionnel
- `perf`: Amélioration de performance
- `test`: Ajout/modification de tests
- `docs`: Documentation uniquement
- `style`: Formatage, pas de changement de code
- `chore`: Tâches de maintenance (deps, config)
- `build`: Changements système de build

### Scopes (domaines du projet)

- `player`: Système joueur
- `combat`: Système de combat
- `creature`: Système créatures
- `world`: Monde 3D, environnement
- `ui`: Interface utilisateur
- `physics`: Physique, collisions
- `audio`: Audio, musique
- `store`: State management (Zustand)
- `engine`: Moteur de jeu
- `config`: Configuration

### Exemples de commits

```bash
feat(combat): système de dégâts avec calculs critiques
fix(player): correction collision avec les murs
refactor(creature): extraction logique capture dans CaptureSystem
perf(world): optimisation rendu avec instancing
test(combat): tests unitaires CombatSystem
docs: ajout guide workflow Git
chore(deps): mise à jour @react-three/fiber v8.17.10
build: configuration Vite pour assets 3D
```

## 📋 Checklist avant commit

Avant chaque commit, vérifier:

- [ ] Le code compile sans erreurs (`npm run build`)
- [ ] Pas d'erreurs de lint (`npm run lint`)
- [ ] Les tests passent (si applicable)
- [ ] Le jeu démarre correctement (`npm run dev`)
- [ ] Les fichiers temporaires sont ignorés (`.gitignore`)
- [ ] Le message de commit est clair et descriptif
- [ ] Un seul changement logique par commit

## 🔄 Workflow recommandé

### 1. Vérifier l'état actuel

```bash
git status
git diff
```

### 2. Ajouter les fichiers modifiés

```bash
# Modification spécifique
git add src/components/game/Player.tsx

# Tous les fichiers modifiés
git add .

# Fichiers par pattern
git add src/components/game/*.tsx
```

### 3. Créer le commit

```bash
git commit -m "feat(player): ajout système de mouvement avec physique"
```

### 4. Vérifier le commit

```bash
git log -1
git show
```

## 📊 Structure des messages de commit (optionnel)

Pour les commits complexes, utiliser un message multi-lignes:

```bash
git commit -m "feat(combat): système de combat au tour par tour

- Implémentation CombatSystem avec calculs de dégâts
- Ajout interface CombatUI pour affichage
- Tests unitaires pour scénarios de combat
- Documentation API dans CombatSystem.ts

Closes #12"
```

## 🏷️ Points de sauvegarde majeurs

### Milestones à marquer avec des tags

```bash
# Après chaque sprint/phase complète
git tag -a v0.1.0 -m "Phase 0: Infrastructure de base"
git tag -a v0.2.0 -m "Sprint 1: Core Gameplay"
git tag -a v0.3.0 -m "Sprint 2: Système de Combat"
```

### Branches de fonctionnalité

Pour les grandes fonctionnalités, utiliser des branches:

```bash
# Créer une branche
git checkout -b feat/combat-system

# Développer...
git add .
git commit -m "feat(combat): système de base"

# Fusionner dans main
git checkout main
git merge feat/combat-system
```

## 🚨 Situations spéciales

### Commit partiel (staging)

```bash
# Ajouter seulement certaines lignes d'un fichier
git add -p src/components/game/Player.tsx
```

### Annuler un commit (avant push)

```bash
# Garder les changements
git reset --soft HEAD~1

# Supprimer les changements
git reset --hard HEAD~1
```

### Modifier le dernier commit

```bash
# Ajouter des fichiers oubliés
git add fichier-oublie.ts
git commit --amend --no-edit

# Modifier le message
git commit --amend -m "nouveau message"
```

## 📅 Fréquence recommandée

- **Minimum**: 1 commit par session de travail (2-3h)
- **Idéal**: 1 commit par modification importante
- **Maximum**: Ne pas attendre plus d'une journée

## 🔍 Commandes utiles

```bash
# Voir l'historique
git log --oneline --graph --decorate

# Voir les différences
git diff HEAD~1

# Voir les fichiers modifiés
git status --short

# Voir les stats d'un commit
git show --stat HEAD
```

## 📚 Ressources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Best Practices](https://github.com/git/git/blob/master/Documentation/SubmittingPatches)

