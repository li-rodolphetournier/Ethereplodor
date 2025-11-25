import * as THREE from 'three';

export interface CombatEntity {
  id: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  position: THREE.Vector3;
}

export class CombatSystem {
  calculateDamage(attacker: CombatEntity, defender: CombatEntity): number {
    const baseDamage = attacker.attack;
    const reduction = defender.defense * 0.5;
    const finalDamage = Math.max(1, baseDamage - reduction);

    // Variance aléatoire ±10%
    const variance = 0.9 + Math.random() * 0.2;
    return Math.floor(finalDamage * variance);
  }

  applyDamage(entity: CombatEntity, damage: number): boolean {
    entity.hp = Math.max(0, entity.hp - damage);
    return entity.hp <= 0; // retourne true si mort
  }

  isInRange(attacker: CombatEntity, target: CombatEntity, range: number): boolean {
    return attacker.position.distanceTo(target.position) <= range;
  }

  canAttack(attacker: CombatEntity, target: CombatEntity, range: number): boolean {
    return this.isInRange(attacker, target, range) && target.hp > 0;
  }
}

export const combatSystem = new CombatSystem();

