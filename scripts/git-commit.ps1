# Script helper pour créer des commits Git selon les conventions du projet
# Usage: .\scripts\git-commit.ps1

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('feat', 'fix', 'refactor', 'perf', 'test', 'docs', 'style', 'chore', 'build')]
    [string]$Type,
    
    [Parameter(Mandatory=$true)]
    [string]$Scope,
    
    [Parameter(Mandatory=$true)]
    [string]$Description,
    
    [switch]$SkipChecks,
    [switch]$Amend
)

# Couleurs pour la console
function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

# Vérifications pré-commit
function Invoke-PreCommitChecks {
    Write-ColorOutput "`n🔍 Vérifications pré-commit..." "Cyan"
    
    # Vérifier que nous sommes dans un repo Git
    if (-not (Test-Path .git)) {
        Write-ColorOutput "❌ Erreur: Pas un dépôt Git" "Red"
        exit 1
    }
    
    # Vérifier s'il y a des changements
    $status = git status --porcelain
    if ([string]::IsNullOrWhiteSpace($status)) {
        Write-ColorOutput "⚠️  Aucun changement à commiter" "Yellow"
        exit 0
    }
    
    if (-not $SkipChecks) {
        # Vérifier la compilation
        Write-ColorOutput "  → Vérification compilation..." "Gray"
        $buildResult = npm run build 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-ColorOutput "❌ Erreur de compilation détectée!" "Red"
            Write-ColorOutput $buildResult "Red"
            $continue = Read-Host "Continuer quand même? (y/N)"
            if ($continue -ne "y") {
                exit 1
            }
        } else {
            Write-ColorOutput "  ✓ Compilation OK" "Green"
        }
        
        # Vérifier le lint
        Write-ColorOutput "  → Vérification lint..." "Gray"
        $lintResult = npm run lint 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-ColorOutput "⚠️  Avertissements lint détectés" "Yellow"
            Write-ColorOutput $lintResult "Yellow"
            $continue = Read-Host "Continuer quand même? (y/N)"
            if ($continue -ne "y") {
                exit 1
            }
        } else {
            Write-ColorOutput "  ✓ Lint OK" "Green"
        }
    }
    
    Write-ColorOutput "✓ Toutes les vérifications passées`n" "Green"
}

# Afficher les fichiers modifiés
function Show-ChangedFiles {
    Write-ColorOutput "📝 Fichiers modifiés:" "Cyan"
    git status --short | ForEach-Object {
        $line = $_
        if ($line -match "^A ") {
            Write-ColorOutput "  + $($line.Substring(2))" "Green"
        } elseif ($line -match "^M ") {
            Write-ColorOutput "  ~ $($line.Substring(2))" "Yellow"
        } elseif ($line -match "^D ") {
            Write-ColorOutput "  - $($line.Substring(2))" "Red"
        } else {
            Write-ColorOutput "  ? $line" "Gray"
        }
    }
    Write-Host ""
}

# Créer le message de commit
function Get-CommitMessage {
    param([string]$Type, [string]$Scope, [string]$Description)
    return "$Type($Scope): $Description"
}

# Main
Write-ColorOutput "🚀 Création d'un commit Git" "Cyan"
Write-ColorOutput "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" "Gray"

# Vérifications
Invoke-PreCommitChecks

# Afficher les changements
Show-ChangedFiles

# Construire le message
$commitMessage = Get-CommitMessage -Type $Type -Scope $Scope -Description $Description

Write-ColorOutput "💬 Message de commit:" "Cyan"
Write-ColorOutput "   $commitMessage`n" "White"

# Demander confirmation
$confirm = Read-Host "Créer ce commit? (Y/n)"
if ($confirm -eq "n" -or $confirm -eq "N") {
    Write-ColorOutput "❌ Commit annulé" "Yellow"
    exit 0
}

# Créer le commit
if ($Amend) {
    git commit --amend -m $commitMessage
} else {
    git commit -m $commitMessage
}

if ($LASTEXITCODE -eq 0) {
    Write-ColorOutput "`n✅ Commit créé avec succès!" "Green"
    Write-ColorOutput "`n📊 Dernier commit:" "Cyan"
    git log -1 --oneline
} else {
    Write-ColorOutput "`n❌ Erreur lors de la création du commit" "Red"
    exit 1
}

