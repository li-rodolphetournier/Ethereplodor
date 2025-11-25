import { Creature } from '../entities/Creature';

export type BallType = 'basic' | 'super' | 'ultra';

export interface CaptureResult {
  success: boolean;
  shakes: number;
  chance: number;
}

export class CaptureSystem {
  calculateCaptureChance(
    wildCreature: Creature,
    ballType: BallType = 'basic'
  ): number {
    const hpRatio = wildCreature.currentHp / wildCreature.stats.maxHp;
    const levelModifier = Math.max(1, wildCreature.level / 10);

    const ballModifier = {
      basic: 1.0,
      super: 1.5,
      ultra: 2.0,
    }[ballType];

    // Formule inspirée Pokémon
    const captureRate = wildCreature.captureRate;
    const baseChance =
      ((3 * wildCreature.stats.maxHp - 2 * wildCreature.currentHp) *
        captureRate *
        ballModifier) /
      (3 * wildCreature.stats.maxHp);

    // Ajustement selon le niveau
    const adjustedChance = baseChance / levelModifier;

    return Math.min(1, Math.max(0, adjustedChance));
  }

  attemptCapture(wildCreature: Creature, ballType: BallType = 'basic'): CaptureResult {
    const chance = this.calculateCaptureChance(wildCreature, ballType);
    const shakes = Math.floor(chance * 4);
    const success = Math.random() < chance;

    return { success, shakes, chance };
  }
}

export const captureSystem = new CaptureSystem();

