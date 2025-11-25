#!/bin/bash
# Script helper pour créer des commits Git selon les conventions du projet
# Usage: ./scripts/git-commit.sh

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color

# Vérifications pré-commit
check_pre_commit() {
    echo -e "${CYAN}🔍 Vérifications pré-commit...${NC}"
    
    # Vérifier que nous sommes dans un repo Git
    if [ ! -d .git ]; then
        echo -e "${RED}❌ Erreur: Pas un dépôt Git${NC}"
        exit 1
    fi
    
    # Vérifier s'il y a des changements
    if [ -z "$(git status --porcelain)" ]; then
        echo -e "${YELLOW}⚠️  Aucun changement à commiter${NC}"
        exit 0
    fi
    
    if [ "$SKIP_CHECKS" != "true" ]; then
        # Vérifier la compilation
        echo -e "${GRAY}  → Vérification compilation...${NC}"
        if ! npm run build > /dev/null 2>&1; then
            echo -e "${RED}❌ Erreur de compilation détectée!${NC}"
            read -p "Continuer quand même? (y/N) " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                exit 1
            fi
        else
            echo -e "${GREEN}  ✓ Compilation OK${NC}"
        fi
        
        # Vérifier le lint
        echo -e "${GRAY}  → Vérification lint...${NC}"
        if ! npm run lint > /dev/null 2>&1; then
            echo -e "${YELLOW}⚠️  Avertissements lint détectés${NC}"
            read -p "Continuer quand même? (y/N) " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                exit 1
            fi
        else
            echo -e "${GREEN}  ✓ Lint OK${NC}"
        fi
    fi
    
    echo -e "${GREEN}✓ Toutes les vérifications passées${NC}\n"
}

# Afficher les fichiers modifiés
show_changed_files() {
    echo -e "${CYAN}📝 Fichiers modifiés:${NC}"
    git status --short | while read -r line; do
        if [[ $line =~ ^A ]]; then
            echo -e "${GREEN}  + ${line:2}${NC}"
        elif [[ $line =~ ^M ]]; then
            echo -e "${YELLOW}  ~ ${line:2}${NC}"
        elif [[ $line =~ ^D ]]; then
            echo -e "${RED}  - ${line:2}${NC}"
        else
            echo -e "${GRAY}  ? $line${NC}"
        fi
    done
    echo
}

# Usage
usage() {
    echo "Usage: $0 TYPE SCOPE DESCRIPTION [OPTIONS]"
    echo ""
    echo "Types: feat, fix, refactor, perf, test, docs, style, chore, build"
    echo "Scopes: player, combat, creature, world, ui, physics, audio, store, engine, config"
    echo ""
    echo "Options:"
    echo "  --skip-checks    Ignorer les vérifications pré-commit"
    echo "  --amend          Modifier le dernier commit"
    echo ""
    echo "Exemple:"
    echo "  $0 feat player 'ajout système de mouvement'"
    exit 1
}

# Parse arguments
if [ $# -lt 3 ]; then
    usage
fi

TYPE=$1
SCOPE=$2
DESCRIPTION=$3
SKIP_CHECKS=false
AMEND=false

shift 3

while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-checks)
            SKIP_CHECKS=true
            shift
            ;;
        --amend)
            AMEND=true
            shift
            ;;
        *)
            echo "Option inconnue: $1"
            usage
            ;;
    esac
done

# Validation du type
VALID_TYPES=("feat" "fix" "refactor" "perf" "test" "docs" "style" "chore" "build")
if [[ ! " ${VALID_TYPES[@]} " =~ " ${TYPE} " ]]; then
    echo -e "${RED}❌ Type invalide: $TYPE${NC}"
    usage
fi

# Main
echo -e "${CYAN}🚀 Création d'un commit Git${NC}"
echo -e "${GRAY}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Vérifications
check_pre_commit

# Afficher les changements
show_changed_files

# Construire le message
COMMIT_MSG="$TYPE($SCOPE): $DESCRIPTION"

echo -e "${CYAN}💬 Message de commit:${NC}"
echo -e "   ${COMMIT_MSG}\n"

# Demander confirmation
read -p "Créer ce commit? (Y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Nn]$ ]]; then
    echo -e "${YELLOW}❌ Commit annulé${NC}"
    exit 0
fi

# Créer le commit
if [ "$AMEND" = true ]; then
    git commit --amend -m "$COMMIT_MSG"
else
    git commit -m "$COMMIT_MSG"
fi

if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}✅ Commit créé avec succès!${NC}"
    echo -e "\n${CYAN}📊 Dernier commit:${NC}"
    git log -1 --oneline
else
    echo -e "\n${RED}❌ Erreur lors de la création du commit${NC}"
    exit 1
fi

