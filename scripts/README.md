# 📜 Scripts Helper

Scripts utilitaires pour faciliter le développement.

## 🚀 Scripts Git

### `git-commit.ps1` / `git-commit.sh`

Script helper pour créer des commits Git selon les conventions du projet.

#### Usage PowerShell (Windows)

```powershell
.\scripts\git-commit.ps1 -Type feat -Scope player -Description "ajout système de mouvement"
```

#### Usage Bash (Linux/Mac)

```bash
./scripts/git-commit.sh feat player "ajout système de mouvement"
```

#### Paramètres

- **Type** (requis): `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `style`, `chore`, `build`
- **Scope** (requis): `player`, `combat`, `creature`, `world`, `ui`, `physics`, `audio`, `store`, `engine`, `config`
- **Description** (requis): Description courte du changement

#### Options

- `--skip-checks` / `-SkipChecks`: Ignorer les vérifications pré-commit (compilation, lint)
- `--amend` / `-Amend`: Modifier le dernier commit au lieu d'en créer un nouveau

#### Exemples

```bash
# Nouvelle fonctionnalité
./scripts/git-commit.sh feat combat "système de dégâts avec critiques"

# Correction de bug
./scripts/git-commit.sh fix player "correction collision avec murs"

# Refactoring
./scripts/git-commit.sh refactor creature "extraction logique capture"

# Avec skip checks
./scripts/git-commit.sh feat ui "nouveau HUD" --skip-checks

# Modifier dernier commit
./scripts/git-commit.sh feat player "amélioration mouvement" --amend
```

#### Fonctionnalités

- ✅ Vérifications automatiques (compilation, lint)
- ✅ Affichage des fichiers modifiés avec couleurs
- ✅ Confirmation avant commit
- ✅ Format de message conforme aux conventions
- ✅ Support Windows (PowerShell) et Unix (Bash)

