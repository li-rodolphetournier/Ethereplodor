import { create } from 'zustand';
import { EnemyData } from '@/game/entities/Enemy';

interface GameState {
  enemies: Map<string, EnemyData>;
  isPaused: boolean;
  gameTime: number;

  addEnemy: (enemy: EnemyData) => void;
  removeEnemy: (id: string) => void;
  updateEnemy: (id: string, updates: Partial<EnemyData>) => void;
  setPaused: (paused: boolean) => void;
  updateGameTime: (delta: number) => void;
  clearEnemies: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  enemies: new Map(),
  isPaused: false,
  gameTime: 0,

  addEnemy: (enemy) => set((state) => {
    const newEnemies = new Map(state.enemies);
    newEnemies.set(enemy.id, enemy);
    return { enemies: newEnemies };
  }),

  removeEnemy: (id) => set((state) => {
    const newEnemies = new Map(state.enemies);
    newEnemies.delete(id);
    return { enemies: newEnemies };
  }),

  updateEnemy: (id, updates) => set((state) => {
    const enemy = state.enemies.get(id);
    if (!enemy) return state;

    const newEnemies = new Map(state.enemies);
    newEnemies.set(id, { ...enemy, ...updates });
    return { enemies: newEnemies };
  }),

  setPaused: (paused) => set({ isPaused: paused }),

  updateGameTime: (delta) => set((state) => ({
    gameTime: state.gameTime + delta,
  })),

  clearEnemies: () => set({ enemies: new Map() }),
}));

