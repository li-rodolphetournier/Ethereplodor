import * as THREE from 'three';
import { CombatEntity, combatSystem } from '../systems/CombatSystem';

export enum EnemyState {
  IDLE = 'idle',
  PATROL = 'patrol',
  CHASE = 'chase',
  ATTACK = 'attack',
  DEAD = 'dead',
}

export interface EnemyData extends CombatEntity {
  state: EnemyState;
  speed: number;
  detectionRange: number;
  attackRange: number;
  attackCooldown: number;
  lastAttackTime: number;
  patrolTarget?: THREE.Vector3;
  patrolRadius: number;
  spawnPosition: THREE.Vector3;
  level?: number;
}

export class EnemyAI {
  private enemy: EnemyData;
  private player: CombatEntity;

  constructor(enemy: EnemyData, player: CombatEntity) {
    this.enemy = enemy;
    this.player = player;
  }

  updatePlayer(player: CombatEntity): void {
    this.player = player;
  }

  update(delta: number): void {
    if (this.enemy.state === EnemyState.DEAD || this.enemy.hp <= 0) {
      this.enemy.state = EnemyState.DEAD;
      return;
    }

    const distToPlayer = this.enemy.position.distanceTo(this.player.position);
    const currentTime = Date.now();

    switch (this.enemy.state) {
      case EnemyState.IDLE:
        // Transition vers patrol après un court délai
        if (Math.random() < 0.01) {
          this.enemy.state = EnemyState.PATROL;
          this.setRandomPatrolTarget();
        }
        break;

      case EnemyState.PATROL:
        if (distToPlayer < this.enemy.detectionRange) {
          this.enemy.state = EnemyState.CHASE;
        } else if (this.enemy.patrolTarget) {
          this.moveTowards(this.enemy.patrolTarget, this.enemy.speed * 0.5 * delta);
          if (this.enemy.position.distanceTo(this.enemy.patrolTarget) < 0.5) {
            this.setRandomPatrolTarget();
          }
        } else {
          this.setRandomPatrolTarget();
        }
        break;

      case EnemyState.CHASE:
        if (distToPlayer > this.enemy.detectionRange * 1.5) {
          this.enemy.state = EnemyState.PATROL;
          this.setRandomPatrolTarget();
        } else if (distToPlayer < this.enemy.attackRange) {
          this.enemy.state = EnemyState.ATTACK;
        } else {
          this.moveTowards(this.player.position, this.enemy.speed * delta);
        }
        break;

      case EnemyState.ATTACK:
        if (distToPlayer > this.enemy.attackRange) {
          this.enemy.state = EnemyState.CHASE;
        }
        // L'attaque est gérée via getAttackResult() dans le composant
        break;
    }
  }

  private moveTowards(target: THREE.Vector3, speed: number): void {
    const direction = target.clone().sub(this.enemy.position).normalize();
    this.enemy.position.add(direction.multiplyScalar(speed));
  }

  private setRandomPatrolTarget(): void {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * this.enemy.patrolRadius;
    this.enemy.patrolTarget = new THREE.Vector3(
      this.enemy.spawnPosition.x + Math.cos(angle) * distance,
      this.enemy.spawnPosition.y,
      this.enemy.spawnPosition.z + Math.sin(angle) * distance
    );
  }

  private performAttack(): { damage: number; isDead: boolean } {
    if (combatSystem.canAttack(this.enemy, this.player, this.enemy.attackRange)) {
      const damage = combatSystem.calculateDamage(this.enemy, this.player);
      // On ne modifie pas directement le joueur ici, on retourne les dégâts
      const isDead = this.player.hp - damage <= 0;
      this.enemy.lastAttackTime = Date.now();
      return { damage, isDead };
    }
    return { damage: 0, isDead: false };
  }

  getAttackResult(): { damage: number; isDead: boolean } | null {
    if (this.enemy.state === EnemyState.ATTACK && 
        combatSystem.canAttack(this.enemy, this.player, this.enemy.attackRange)) {
      const currentTime = Date.now();
      if (currentTime - this.enemy.lastAttackTime >= this.enemy.attackCooldown) {
        return this.performAttack();
      }
    }
    return null;
  }

  takeDamage(damage: number): boolean {
    return combatSystem.applyDamage(this.enemy, damage);
  }
}

