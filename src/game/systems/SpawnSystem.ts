import * as THREE from 'three';
import { EnemyData, EnemyState } from '../entities/Enemy';
import { useGameStore } from '@/stores/gameStore';

export interface SpawnPoint {
  position: THREE.Vector3;
  enemyType: 'basic' | 'fast' | 'tank';
}

export class SpawnSystem {
  private spawnPoints: SpawnPoint[] = [];
  private maxEnemies = 20;
  private spawnCooldown = 3000; // 3 secondes
  private lastSpawnTime = 0;

  addSpawnPoint(spawnPoint: SpawnPoint): void {
    this.spawnPoints.push(spawnPoint);
  }

  update(playerPosition: THREE.Vector3): void {
    const gameStore = useGameStore.getState();
    const currentEnemies = gameStore.enemies.size;

    if (currentEnemies >= this.maxEnemies) return;

    const currentTime = Date.now();
    if (currentTime - this.lastSpawnTime < this.spawnCooldown) return;

    // Spawn loin du joueur
    const validSpawns = this.spawnPoints.filter((point) =>
      point.position.distanceTo(playerPosition) > 15
    );

    if (validSpawns.length > 0 && Math.random() < 0.3) {
      const spawnPoint = validSpawns[Math.floor(Math.random() * validSpawns.length)];
      this.spawnEnemy(spawnPoint);
      this.lastSpawnTime = currentTime;
    }
  }

  private spawnEnemy(spawnPoint: SpawnPoint): void {
    const enemyId = `enemy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const baseStats = {
      basic: { hp: 50, maxHp: 50, attack: 10, defense: 5, speed: 2 },
      fast: { hp: 30, maxHp: 30, attack: 8, defense: 3, speed: 4 },
      tank: { hp: 100, maxHp: 100, attack: 15, defense: 10, speed: 1.5 },
    };

    const stats = baseStats[spawnPoint.enemyType];

    const level = Math.floor(Math.random() * 5) + 1; // Niveau 1-5

    const enemy: EnemyData = {
      id: enemyId,
      hp: stats.hp,
      maxHp: stats.maxHp,
      attack: stats.attack,
      defense: stats.defense,
      position: spawnPoint.position.clone(),
      state: EnemyState.PATROL,
      speed: stats.speed,
      detectionRange: 8,
      attackRange: 2,
      attackCooldown: 1500, // 1.5 secondes
      lastAttackTime: 0,
      patrolRadius: 5,
      spawnPosition: spawnPoint.position.clone(),
      level, // Ajouter le niveau
    };

    useGameStore.getState().addEnemy(enemy);
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

      const enemyType: 'basic' | 'fast' | 'tank' = 
        Math.random() < 0.6 ? 'basic' : 
        Math.random() < 0.8 ? 'fast' : 'tank';

      this.addSpawnPoint({ position, enemyType });
    }
  }
}

export const spawnSystem = new SpawnSystem();

