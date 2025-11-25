import * as THREE from 'three';
import { Creature, CreatureType } from '../entities/Creature';
import creaturesData from '../data/creatures.json';

interface CreatureTemplate {
  id: string;
  name: string;
  type: string;
  baseStats: {
    hp: number;
    maxHp: number;
    attack: number;
    defense: number;
    speed: number;
    special: number;
  };
  captureRate: number;
  growthRate: 'slow' | 'medium' | 'fast';
  evolutionId?: string;
  evolutionLevel?: number;
  color: string;
  abilities: Array<{
    id: string;
    name: string;
    type: string;
    power: number;
    accuracy: number;
    pp: number;
    maxPp: number;
  }>;
}

export class WildCreatureSpawn {
  private spawnPoints: THREE.Vector3[] = [];
  private maxWildCreatures = 5;
  private spawnCooldown = 5000; // 5 secondes
  private lastSpawnTime = 0;
  private wildCreatures: Map<string, Creature> = new Map();

  addSpawnPoint(position: THREE.Vector3): void {
    this.spawnPoints.push(position);
  }

  initializeSpawnPoints(center: THREE.Vector3, radius: number, count: number): void {
    this.spawnPoints = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const distance = radius + Math.random() * 5;
      const position = new THREE.Vector3(
        center.x + Math.cos(angle) * distance,
        center.y,
        center.z + Math.sin(angle) * distance
      );
      this.addSpawnPoint(position);
    }
  }

  update(playerPosition: THREE.Vector3): void {
    const currentEnemies = this.wildCreatures.size;

    if (currentEnemies >= this.maxWildCreatures) return;

    const currentTime = Date.now();
    if (currentTime - this.lastSpawnTime < this.spawnCooldown) return;

    // Spawn loin du joueur
    const validSpawns = this.spawnPoints.filter(
      (point) => point.distanceTo(playerPosition) > 10
    );

    if (validSpawns.length > 0 && Math.random() < 0.4) {
      const spawnPoint = validSpawns[Math.floor(Math.random() * validSpawns.length)];
      this.spawnWildCreature(spawnPoint);
      this.lastSpawnTime = currentTime;
    }
  }

  private spawnWildCreature(position: THREE.Vector3): void {
    // Sélectionner une créature aléatoire
    const templates = creaturesData as CreatureTemplate[];
    const template = templates[Math.floor(Math.random() * templates.length)];

    // Niveau aléatoire entre 1 et 10
    const level = Math.floor(Math.random() * 10) + 1;

    // Calculer les stats selon le niveau
    const stats = this.calculateStats(template.baseStats, level);

    // Créer la créature
    const creature: Creature = {
      id: `wild_${template.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: template.name,
      type: template.type as CreatureType,
      level,
      baseStats: { ...template.baseStats },
      stats,
      experience: 0,
      expToNextLevel: 100 * Math.pow(level, template.growthRate === 'slow' ? 1.25 : template.growthRate === 'fast' ? 0.8 : 1.0),
      currentHp: stats.maxHp,
      captureRate: template.captureRate,
      growthRate: template.growthRate,
      isWild: true,
      modelPath: '',
      iconPath: '',
      color: template.color,
      abilities: template.abilities.map((a) => ({
        ...a,
        type: a.type as CreatureType,
      })),
      evolutionId: template.evolutionId,
      evolutionLevel: template.evolutionLevel,
      position: position.clone(),
    };

    this.wildCreatures.set(creature.id, creature);
  }

  private calculateStats(baseStats: Creature['baseStats'], level: number): Creature['stats'] {
    const statMultiplier = 1 + (level - 1) * 0.1;
    return {
      hp: Math.floor(baseStats.hp * statMultiplier),
      maxHp: Math.floor(baseStats.maxHp * statMultiplier),
      attack: Math.floor(baseStats.attack * statMultiplier),
      defense: Math.floor(baseStats.defense * statMultiplier),
      speed: Math.floor(baseStats.speed * statMultiplier),
      special: Math.floor(baseStats.special * statMultiplier),
    };
  }

  getWildCreatures(): Creature[] {
    return Array.from(this.wildCreatures.values());
  }

  removeWildCreature(id: string): void {
    this.wildCreatures.delete(id);
  }

  getWildCreature(id: string): Creature | undefined {
    return this.wildCreatures.get(id);
  }
}

export const wildCreatureSpawn = new WildCreatureSpawn();

