import { Creature, CreatureStats } from '../entities/Creature';

export interface LevelUpResult {
  leveledUp: boolean;
  newLevel: number;
  evolved: boolean;
}

export class ProgressionSystem {
  calculateExpRequired(level: number, growthRate: 'slow' | 'medium' | 'fast'): number {
    const multipliers = { slow: 1.25, medium: 1.0, fast: 0.8 };
    const base = 100;
    return Math.floor(base * Math.pow(level, multipliers[growthRate]));
  }

  awardExperience(creature: Creature, expGained: number): LevelUpResult {
    creature.experience += expGained;
    let leveledUp = false;
    let evolved = false;
    let newLevel = creature.level;

    while (creature.experience >= creature.expToNextLevel) {
      creature.experience -= creature.expToNextLevel;
      newLevel++;
      leveledUp = true;

      // Recalculer XP pour prochain niveau
      creature.expToNextLevel = this.calculateExpRequired(newLevel + 1, creature.growthRate);

      // Améliorer stats
      creature.stats = this.calculateStats(creature.baseStats, newLevel);
      creature.currentHp = creature.stats.maxHp; // Restaurer HP au level up

      // Vérifier évolution
      if (creature.evolutionLevel && newLevel >= creature.evolutionLevel) {
        evolved = this.evolveCreature(creature);
      }
    }

    creature.level = newLevel;
    return { leveledUp, newLevel, evolved };
  }

  calculateStats(baseStats: CreatureStats, level: number): CreatureStats {
    const statMultiplier = 1 + (level - 1) * 0.1; // +10% par niveau
    return {
      hp: Math.floor(baseStats.hp * statMultiplier),
      maxHp: Math.floor(baseStats.maxHp * statMultiplier),
      attack: Math.floor(baseStats.attack * statMultiplier),
      defense: Math.floor(baseStats.defense * statMultiplier),
      speed: Math.floor(baseStats.speed * statMultiplier),
      special: Math.floor(baseStats.special * statMultiplier),
    };
  }

  evolveCreature(creature: Creature): boolean {
    if (!creature.evolutionId) return false;

    // Pour l'instant, on simule l'évolution en améliorant les stats
    // Dans une version complète, on chargerait les données d'évolution depuis une DB
    const evolutionBonus = 1.2; // +20% aux stats de base

    creature.baseStats = {
      hp: Math.floor(creature.baseStats.hp * evolutionBonus),
      maxHp: Math.floor(creature.baseStats.maxHp * evolutionBonus),
      attack: Math.floor(creature.baseStats.attack * evolutionBonus),
      defense: Math.floor(creature.baseStats.defense * evolutionBonus),
      speed: Math.floor(creature.baseStats.speed * evolutionBonus),
      special: Math.floor(creature.baseStats.special * evolutionBonus),
    };

    // Recalculer stats actuelles
    creature.stats = this.calculateStats(creature.baseStats, creature.level);
    creature.currentHp = creature.stats.maxHp;

    // Mettre à jour le nom (simulation)
    creature.name = `${creature.name} Evolved`;

    return true;
  }
}

export const progressionSystem = new ProgressionSystem();

