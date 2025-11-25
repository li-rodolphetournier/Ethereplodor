Plan Complet pour Développer un Jeu 3D Isométrique Diablo-like/Pokémon sur Navigateur Web

🎮 Vue d'Ensemble du Projet
Création d'un RPG d'action en 3D isométrique combinant :

Gameplay Diablo-like : hack-and-slash, loot, exploration de donjons
Système Pokémon : capture, collection, évolution de créatures
Architecture Web Moderne : exploitant la GPU via WebGL2/WebGPU
Accessibilité : jouable directement dans le navigateur sans installation


🛠️ STACK TECHNIQUE RECOMMANDÉE (2025)
Frontend Core
TechnologieVersionRôleThree.jsr181+ (version actuelle)Rendu 3D via WebGL2/WebGPUReact18.x/19.xUI et architecture composantsReact Three Fiberv8/v9Intégration React ↔ Three.jsVite5+Build tool ultra-rapideTypeScript5+Type safetyTailwind CSS3+Styling UI/HUD
Bibliothèques 3D & Gaming
BibliothèqueFonction@react-three/dreiHelpers R3F (caméras, controls, loaders)@react-three/rapierMoteur physique (WASM, haute performance)@react-three/postprocessingEffets visuels (bloom, depth of field)
State Management & Utilitaires
OutilUsageZustand ou JotaiState management global légerIndexedDB (via Dexie.js)Sauvegarde locale (remplace localStorage)Howler.jsGestion audio spatiale
Backend (Multijoueur - Phase Post-MVP)
TechnologieRôleNode.js + FastifyAPI REST performanteSocket.ioCommunication temps réelPostgreSQL + PrismaBase de données & ORMRedisCache et sessions
⚠️ Considération WebGPU vs WebGL2
Recommandation 2025 :

Développer en WebGL2 (compatibilité universelle)
Ajouter support WebGPU optionnel pour gains de performance (jusqu'à 10x sur scènes complexes)
WebGPU supporté depuis Safari 26 (juin 2025) et Firefox 141 (juillet 2025)
Maintenir fallback WebGL2 pour navigateurs plus anciens

typescript// Détection automatique renderer
const renderer = isWebGPUSupported() 
  ? new THREE.WebGPURenderer() 
  : new THREE.WebGLRenderer()
```

---

## **📐 ARCHITECTURE DU PROJET**
```
diablo-pokemon-3d/
├── public/
│   └── assets/
│       ├── models/          # .glb, .gltf
│       ├── textures/        # .jpg, .png, .webp
│       └── audio/           # .mp3, .ogg
├── src/
│   ├── components/
│   │   ├── game/
│   │   │   ├── World.tsx            # Scène 3D principale
│   │   │   ├── IsometricCamera.tsx  # Caméra iso
│   │   │   ├── Player.tsx           # Personnage joueur
│   │   │   ├── Creature.tsx         # Créatures (alliées/ennemies)
│   │   │   └── Environment.tsx      # Terrain, décors
│   │   ├── ui/
│   │   │   ├── HUD.tsx              # Barre vie, mana, etc.
│   │   │   ├── Inventory.tsx        # Gestion items
│   │   │   ├── CreatureTeam.tsx     # Équipe créatures
│   │   │   └── Menu.tsx             # Menus pause/options
│   │   └── effects/
│   │       ├── Particles.tsx        # Systèmes particules
│   │       └── PostProcessing.tsx   # Effets post-prod
│   ├── engine/
│   │   ├── input/
│   │   │   └── InputManager.ts      # Clavier, souris, touch
│   │   ├── physics/
│   │   │   └── CollisionSystem.ts   # Collisions, triggers
│   │   ├── ai/
│   │   │   ├── PathFinding.ts       # A* algorithm
│   │   │   └── BehaviorTree.ts      # IA ennemis
│   │   └── audio/
│   │       └── AudioManager.ts      # Musique, SFX 3D
│   ├── game/
│   │   ├── entities/
│   │   │   ├── Player.ts            # Logique joueur
│   │   │   ├── Creature.ts          # Classe créature
│   │   │   ├── Enemy.ts             # Ennemis
│   │   │   └── NPC.ts               # Personnages non-joueurs
│   │   ├── systems/
│   │   │   ├── CombatSystem.ts      # Calculs combat
│   │   │   ├── CaptureSystem.ts     # Mécanisme capture
│   │   │   ├── InventorySystem.ts   # Gestion inventaire
│   │   │   ├── LootSystem.ts        # Drops aléatoires
│   │   │   └── ProgressionSystem.ts # XP, levels
│   │   ├── world/
│   │   │   ├── WorldGenerator.ts    # Génération procédurale
│   │   │   ├── BiomeManager.ts      # Biomes différents
│   │   │   └── ChunkLoader.ts       # Streaming terrain
│   │   └── data/
│   │       ├── creatures.json       # DB créatures
│   │       ├── items.json           # DB items/équipement
│   │       └── abilities.json       # Compétences
│   ├── stores/
│   │   ├── gameStore.ts             # État jeu global
│   │   ├── playerStore.ts           # État joueur
│   │   └── uiStore.ts               # État interface
│   ├── utils/
│   │   ├── mathUtils.ts             # Maths custom
│   │   ├── performance.ts           # Profiling
│   │   └── database.ts              # IndexedDB wrapper
│   ├── workers/
│   │   └── pathfinding.worker.ts    # Calculs lourds
│   ├── App.tsx
│   └── main.tsx
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json

🚀 PLAN DE DÉVELOPPEMENT - MVP (6 MOIS)
⚙️ PHASE 0 : Foundation (Semaines 1-2)
Objectif : Infrastructure technique solide
Tâches :

Setup projet

bash# Initialisation
npm create vite@latest diablo-pokemon-3d -- --template react-ts
cd diablo-pokemon-3d

# Dépendances core
npm install three @types/three
npm install @react-three/fiber @react-three/drei @react-three/rapier
npm install zustand dexie dexie-react-hooks

# Dev tools
npm install -D tailwindcss postcss autoprefixer
npm install -D @types/three
npx tailwindcss init -p

Configuration Vite optimisée

typescript// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  worker: {
    format: 'es' // Pour Web Workers
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three'],
          'react-vendor': ['react', 'react-dom'],
          'r3f': ['@react-three/fiber', '@react-three/drei']
        }
      }
    }
  }
})

Scène 3D de base

typescript// src/components/game/World.tsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sky, Environment } from '@react-three/drei'
import { Physics } from '@react-three/rapier'

export function World() {
  return (
    <Canvas
      shadows
      gl={{ 
        antialias: true,
        powerPreference: 'high-performance'
      }}
      camera={{ position: [10, 10, 10], fov: 50 }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 20, 5]} 
        intensity={1} 
        castShadow 
      />
      
      <Physics gravity={[0, -9.81, 0]}>
        {/* Contenu jeu ici */}
      </Physics>
      
      <Sky sunPosition={[100, 20, 100]} />
      <Environment preset="sunset" />
      <OrbitControls />
    </Canvas>
  )
}

Caméra isométrique fixe

typescript// src/components/game/IsometricCamera.tsx
import { useThree, useFrame } from '@react-three/fiber'
import { useEffect } from 'react'
import * as THREE from 'three'

interface IsoCameraProps {
  target: THREE.Vector3
  distance?: number
}

export function IsometricCamera({ target, distance = 15 }: IsoCameraProps) {
  const { camera } = useThree()
  
  // Configuration caméra orthographique isométrique
  useEffect(() => {
    if (camera instanceof THREE.OrthographicCamera) {
      const aspect = window.innerWidth / window.innerHeight
      const frustumSize = 10
      camera.left = -frustumSize * aspect / 2
      camera.right = frustumSize * aspect / 2
      camera.top = frustumSize / 2
      camera.bottom = -frustumSize / 2
      camera.updateProjectionMatrix()
    }
  }, [camera])
  
  // Suit le joueur
  useFrame(() => {
    const offset = new THREE.Vector3(1, 1, 1).normalize().multiplyScalar(distance)
    camera.position.copy(target).add(offset)
    camera.lookAt(target)
  })
  
  return null
}
✅ Livrables Phase 0 :

Projet buildable et déployable
Scène 3D avec éclairage et physique
60 FPS stable sur desktop mid-range
Hot Module Replacement fonctionnel


🎯 SPRINT 1 : Core Gameplay (Semaines 3-4)
Features :

Contrôles Joueur

Déplacement WASD + clic souris
Animations : idle, walk, run, attack
Collision avec terrain/obstacles


Input Manager

typescript// src/engine/input/InputManager.ts
class InputManager {
  private keys: Set<string> = new Set()
  private mousePos: THREE.Vector2 = new THREE.Vector2()
  
  init() {
    window.addEventListener('keydown', (e) => this.keys.add(e.code))
    window.addEventListener('keyup', (e) => this.keys.delete(e.code))
    window.addEventListener('mousemove', (e) => {
      this.mousePos.x = (e.clientX / window.innerWidth) * 2 - 1
      this.mousePos.y = -(e.clientY / window.innerHeight) * 2 + 1
    })
  }
  
  isPressed(key: string): boolean {
    return this.keys.has(key)
  }
  
  getMovementVector(): THREE.Vector3 {
    const dir = new THREE.Vector3()
    if (this.isPressed('KeyW')) dir.z -= 1
    if (this.isPressed('KeyS')) dir.z += 1
    if (this.isPressed('KeyA')) dir.x -= 1
    if (this.isPressed('KeyD')) dir.x += 1
    return dir.normalize()
  }
}

export const inputManager = new InputManager()

Personnage Joueur

typescript// src/components/game/Player.tsx
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, CapsuleCollider } from '@react-three/rapier'
import { useGLTF } from '@react-three/drei'
import { inputManager } from '@/engine/input/InputManager'

export function Player() {
  const playerRef = useRef<any>(null)
  const { scene, animations } = useGLTF('/assets/models/character.glb')
  
  useFrame((state, delta) => {
    if (!playerRef.current) return
    
    const movement = inputManager.getMovementVector()
    const speed = 5
    
    // Appliquer mouvement via physique
    playerRef.current.setLinvel({
      x: movement.x * speed,
      y: playerRef.current.linvel().y,
      z: movement.z * speed
    })
    
    // Rotation vers direction
    if (movement.length() > 0) {
      const angle = Math.atan2(movement.x, movement.z)
      playerRef.current.setRotation({ 
        x: 0, 
        y: -angle, 
        z: 0, 
        w: 1 
      })
    }
  })
  
  return (
    <RigidBody ref={playerRef} colliders={false} lockRotations>
      <CapsuleCollider args={[0.5, 0.5]} />
      <primitive object={scene} scale={1} />
    </RigidBody>
  )
}
✅ Livrables Sprint 1 :

Personnage contrôlable fluide
Caméra qui suit le joueur
Collisions fonctionnelles
Performance maintenue 60 FPS


⚔️ SPRINT 2 : Système de Combat (Semaines 5-6)
Features :

Système de Combat de Base

typescript// src/game/systems/CombatSystem.ts
interface CombatEntity {
  id: string
  hp: number
  maxHp: number
  attack: number
  defense: number
  position: THREE.Vector3
}

export class CombatSystem {
  calculateDamage(attacker: CombatEntity, defender: CombatEntity): number {
    const baseDamage = attacker.attack
    const reduction = defender.defense * 0.5
    const finalDamage = Math.max(1, baseDamage - reduction)
    
    // Variance aléatoire ±10%
    const variance = 0.9 + Math.random() * 0.2
    return Math.floor(finalDamage * variance)
  }
  
  applyDamage(entity: CombatEntity, damage: number) {
    entity.hp = Math.max(0, entity.hp - damage)
    return entity.hp <= 0 // retourne true si mort
  }
  
  isInRange(attacker: CombatEntity, target: CombatEntity, range: number): boolean {
    return attacker.position.distanceTo(target.position) <= range
  }
}

IA Ennemis - State Machine Simple

typescript// src/game/entities/Enemy.ts
enum EnemyState {
  IDLE = 'idle',
  PATROL = 'patrol',
  CHASE = 'chase',
  ATTACK = 'attack',
  DEAD = 'dead'
}

export class EnemyAI {
  state: EnemyState = EnemyState.PATROL
  detectionRange = 8
  attackRange = 2
  
  update(enemy: CombatEntity, player: CombatEntity, delta: number) {
    const distToPlayer = enemy.position.distanceTo(player.position)
    
    switch (this.state) {
      case EnemyState.PATROL:
        if (distToPlayer < this.detectionRange) {
          this.state = EnemyState.CHASE
        }
        break
        
      case EnemyState.CHASE:
        if (distToPlayer > this.detectionRange * 1.5) {
          this.state = EnemyState.PATROL
        } else if (distToPlayer < this.attackRange) {
          this.state = EnemyState.ATTACK
        } else {
          this.moveTowards(enemy, player.position, 3 * delta)
        }
        break
        
      case EnemyState.ATTACK:
        if (distToPlayer > this.attackRange) {
          this.state = EnemyState.CHASE
        } else {
          this.performAttack(enemy, player)
        }
        break
    }
  }
  
  moveTowards(enemy: CombatEntity, target: THREE.Vector3, speed: number) {
    const direction = target.clone().sub(enemy.position).normalize()
    enemy.position.add(direction.multiplyScalar(speed))
  }
  
  performAttack(enemy: CombatEntity, player: CombatEntity) {
    // Cooldown, animation, dégâts...
  }
}

UI Combat - Barres de Vie

typescript// src/components/ui/HealthBar.tsx
import { Html } from '@react-three/drei'

interface HealthBarProps {
  current: number
  max: number
  position: [number, number, number]
}

export function HealthBar({ current, max, position }: HealthBarProps) {
  const percentage = (current / max) * 100
  
  return (
    <Html position={position} center>
      <div className="bg-gray-800 w-24 h-2 rounded-full overflow-hidden border border-gray-600">
        <div 
          className="bg-red-500 h-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </Html>
  )
}

Système de Spawn Ennemis

typescript// src/game/systems/SpawnSystem.ts
export class SpawnSystem {
  private spawnPoints: THREE.Vector3[] = []
  private maxEnemies = 20
  private currentEnemies = 0
  
  addSpawnPoint(position: THREE.Vector3) {
    this.spawnPoints.push(position)
  }
  
  update(playerPosition: THREE.Vector3) {
    if (this.currentEnemies < this.maxEnemies) {
      // Spawn loin du joueur
      const validSpawns = this.spawnPoints.filter(point => 
        point.distanceTo(playerPosition) > 15
      )
      
      if (validSpawns.length > 0 && Math.random() < 0.02) {
        const spawnPos = validSpawns[Math.floor(Math.random() * validSpawns.length)]
        this.spawnEnemy(spawnPos)
      }
    }
  }
  
  spawnEnemy(position: THREE.Vector3) {
    // Logique création ennemi
    this.currentEnemies++
  }
}
✅ Livrables Sprint 2 :

Combat fonctionnel corps-à-corps
3 types d'ennemis avec IA différente
Système de spawn dynamique
Effets visuels (dégâts, mort)
60 FPS avec 20+ ennemis simultanés


🐉 SPRINT 3 : Système Créatures (Semaines 7-8)
Features Principales :

Structure Données Créatures

typescript// src/game/entities/Creature.ts
export enum CreatureType {
  FIRE = 'fire',
  WATER = 'water',
  GRASS = 'grass',
  ELECTRIC = 'electric',
  GROUND = 'ground',
  FLYING = 'flying'
}

export interface CreatureStats {
  hp: number
  maxHp: number
  attack: number
  defense: number
  speed: number
  special: number
}

export interface Creature {
  id: string
  name: string
  type: CreatureType
  secondaryType?: CreatureType
  level: number
  stats: CreatureStats
  baseStats: CreatureStats
  experience: number
  expToNextLevel: number
  
  // Évolution
  evolutionId?: string
  evolutionLevel?: number
  
  // Apparence
  modelPath: string
  iconPath: string
  
  // Combat
  abilities: Ability[]
  currentHp: number
  
  // Métadonnées
  captureRate: number
  growthRate: 'slow' | 'medium' | 'fast'
  isWild: boolean
  originalTrainer?: string
}

export interface Ability {
  id: string
  name: string
  type: CreatureType
  power: number
  accuracy: number
  pp: number
  maxPp: number
  effect?: string
}

Système de Capture

typescript// src/game/systems/CaptureSystem.ts
export class CaptureSystem {
  calculateCaptureChance(
    wildCreature: Creature,
    ballType: 'basic' | 'super' | 'ultra' = 'basic'
  ): number {
    const hpRatio = wildCreature.currentHp / wildCreature.stats.maxHp
    const levelModifier = Math.max(1, wildCreature.level / 10)
    
    const ballModifier = {
      basic: 1.0,
      super: 1.5,
      ultra: 2.0
    }[ballType]
    
    // Formule inspirée Pokémon
    const captureRate = wildCreature.captureRate
    const baseChance = ((3 * wildCreature.stats.maxHp - 2 * wildCreature.currentHp) * captureRate * ballModifier) 
      / (3 * wildCreature.stats.maxHp)
    
    return Math.min(1, Math.max(0, baseChance))
  }
  
  attemptCapture(wildCreature: Creature, ballType: 'basic' | 'super' | 'ultra'): {
    success: boolean
    shakes: number
  } {
    const chance = this.calculateCaptureChance(wildCreature, ballType)
    const shakes = Math.floor(chance * 4)
    const success = Math.random() < chance
    
    return { success, shakes }
  }
}

Gestion Équipe Créatures

typescript// src/stores/creatureStore.ts
import create from 'zustand'
import { persist } from 'zustand/middleware'

interface CreatureStore {
  ownedCreatures: Creature[]
  activeTeam: string[] // IDs des créatures actives (max 6)
  selectedCreature: string | null
  
  captureCreature: (creature: Creature) => void
  addToTeam: (creatureId: string) => void
  removeFromTeam: (creatureId: string) => void
  selectCreature: (creatureId: string) => void
  levelUpCreature: (creatureId: string) => void
}

export const useCreatureStore = create<CreatureStore>()(
  persist(
    (set, get) => ({
      ownedCreatures: [],
      activeTeam: [],
      selectedCreature: null,
      
      captureCreature: (creature) => set((state) => ({
        ownedCreatures: [...state.ownedCreatures, { ...creature, isWild: false }]
      })),
      
      addToTeam: (creatureId) => set((state) => {
        if (state.activeTeam.length >= 6) {
          console.warn('Équipe complète (6 créatures max)')
          return state
        }
        return { activeTeam: [...state.activeTeam, creatureId] }
      }),
      
      removeFromTeam: (creatureId) => set((state) => ({
        activeTeam: state.activeTeam.filter(id => id !== creatureId)
      })),
      
      selectCreature: (creatureId) => set({ selectedCreature: creatureId }),
      
      levelUpCreature: (creatureId) => set((state) => {
        const creatures = state.ownedCreatures.map(c => {
          if (c.id === creatureId) {
            const newLevel = c.level + 1
            // Recalculer stats basées sur level
            return {
              ...c,
              level: newLevel,
              stats: calculateStats(c.baseStats, newLevel)
            }
          }
          return c
        })
        return { ownedCreatures: creatures }
      })
    }),
    { name: 'creature-storage' }
  )
)

UI Gestion Créatures

typescript// src/components/ui/CreatureTeam.tsx
import { useCreatureStore } from '@/stores/creatureStore'

export function CreatureTeamPanel() {
  const { activeTeam, ownedCreatures, selectCreature } = useCreatureStore()
  
  const teamCreatures = activeTeam
    .map(id => ownedCreatures.find(c => c.id === id))
    .filter(Boolean) as Creature[]
  
  return (
    <div className="fixed right-4 top-4 bg-gray-900/90 p-4 rounded-lg border border-gray-700">
      <h2 className="text-xl font-bold mb-3 text-white">Équipe Active</h2>
      
      <div className="space-y-2">
        {teamCreatures.map((creature) => (
          <div 
            key={creature.id}
            onClick={() => selectCreature(creature.id)}
            className="flex items-center gap-3 p-2 bg-gray-800 rounded cursor-pointer hover:bg-gray-700 transition"
          >
            <img 
              src={creature.iconPath} 
              alt={creature.name}
              className="w-12 h-12"
            />
            <div className="flex-1">
              <div className="font-semibold text-white">{creature.name}</div>
              <div className="text-sm text-gray-400">Lv. {creature.level}</div>
              <div className="w-full bg-gray-700 h-1 rounded mt-1">
                <div 
                  className="bg-green-500 h-full rounded"
                  style={{ width: `${(creature.currentHp / creature.stats.maxHp) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {teamCreatures.length < 6 && (
        <div className="text-center text-gray-500 text-sm mt-2">
          {6 - teamCreatures.length} emplacement(s) libre(s)
        </div>
      )}
    </div>
  )
}
✅ Livrables Sprint 3 :

10 créatures capturables différentes
Système de capture fonctionnel avec probabilités
Gestion équipe de 6 créatures max
Créatures combattent aux côtés du joueur
UI complète de gestion


📈 SPRINT 4 : Progression & Loot (Semaines 9-10)
Features :

Système d'Expérience

typescript// src/game/systems/ProgressionSystem.ts
export class ProgressionSystem {
  calculateExpRequired(level: number, growthRate: 'slow' | 'medium' | 'fast'): number {
    const multipliers = { slow: 1.25, medium: 1.0, fast: 0.8 }
    const base = 100
    return Math.floor(base * Math.pow(level, multipliers[growthRate]))
  }
  
  awardExperience(creature: Creature, expGained: number): {
    leveledUp: boolean
    newLevel: number
  } {
    creature.experience += expGained
    let leveledUp = false
    let newLevel = creature.level
    
    while (creature.experience >= creature.expToNextLevel) {
      creature.experience -= creature.expToNextLevel
      newLevel++
      leveledUp = true
      
      // Recalculer XP pour prochain niveau
      creature.expToNextLevel = this.calculateExpRequired(newLevel + 1, creature.growthRate)
      
      // Améliorer stats
      creature.stats = this.calculateStats(creature.baseStats, newLevel)
      
      // Vérifier évolution
      if (creature.evolutionLevel && newLevel >= creature.evolutionLevel) {
        this.evolveCreature(creature)
      }
    }
    
    creature.level = newLevel
    return { leveledUp, newLevel }
  }
  
  calculateStats(baseStats: CreatureStats, level: number): CreatureStats {
    const statMultiplier = 1 + (level - 1) * 0.1 // +10% par niveau
    return {
      hp: Math.floor(baseStats.hp * statMultiplier),
      maxHp: Math.floor(baseStats.maxHp * statMultiplier),
      attack: Math.floor(baseStats.attack * statMultiplier),
      defense: Math.floor(baseStats.defense * statMultiplier),
      speed: Math.floor(baseStats.speed * statMultiplier),
      special: Math.floor(baseStats.special * statMultiplier)
    }
  }
  
  evolveCreature(creature: Creature) {
    if (!creature.evolutionId) return
    
    // Charger données évolution
    const evolutionData = loadCreatureData(creature.evolutionId)
    
    // Conserver level et XP, changer modèle et stats de base
    creature.name = evolutionData.name
    creature.baseStats = evolutionData.baseStats
    creature.modelPath = evolutionData.modelPath
    creature.evolutionId = evolutionData.evolutionId
    creature.evolutionLevel = evolutionData.evolutionLevel
    
    // Recalculer stats actuelles
    creature.stats = this.calculateStats(creature.baseStats, creature.level)
  }
}

Système de Loot

typescript// src/game/systems/LootSystem.ts
exportRetryThis response paused because Claude reached its max length for a message. Hit continue to nudge Claude along.ContinueClaude can make mistakes. Please double-check responses.