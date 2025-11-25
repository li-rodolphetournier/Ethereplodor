# Diablo-Pokémon 3D

Jeu RPG d'action en 3D isométrique combinant gameplay Diablo-like et système de capture/collection Pokémon.

## 🚀 Installation

```bash
npm install
```

## 🛠️ Développement

```bash
npm run dev
```

## 📦 Build

```bash
npm run build
```

## 🎮 Features (en développement)

- [x] Phase 0: Infrastructure de base
- [ ] Sprint 1: Core Gameplay
- [ ] Sprint 2: Système de Combat
- [ ] Sprint 3: Système Créatures
- [ ] Sprint 4: Progression & Loot

## 📐 Architecture

Voir `plan-0.md` pour le plan complet de développement.

## 📦 Workflow Git

- **Configuration**: Voir `GIT_SETUP.md` pour la configuration initiale et le premier push
- **Workflow**: Voir `GIT_WORKFLOW.md` pour le guide complet de sauvegarde Git

**Quick start**: Utiliser le script helper pour créer des commits:

```bash
# Windows (PowerShell)
.\scripts\git-commit.ps1 -Type feat -Scope player -Description "ajout système de mouvement"

# Linux/Mac (Bash)
./scripts/git-commit.sh feat player "ajout système de mouvement"
```

**Remote configuré**: `https://github.com/li-rodolphetournier/Ethereplodor.git`

## 🛠️ Stack Technique

- **Three.js** + **React Three Fiber** - Rendu 3D
- **@react-three/rapier** - Physique
- **Zustand** - State management
- **Dexie.js** - IndexedDB pour sauvegarde
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool

