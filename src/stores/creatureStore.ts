import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Creature } from '@/game/entities/Creature';
import { progressionSystem } from '@/game/systems/ProgressionSystem';

interface CreatureStore {
  ownedCreatures: Creature[];
  activeTeam: string[]; // IDs des créatures actives (max 6)
  selectedCreature: string | null;

  captureCreature: (creature: Creature) => void;
  addToTeam: (creatureId: string) => void;
  removeFromTeam: (creatureId: string) => void;
  selectCreature: (creatureId: string) => void;
  levelUpCreature: (creatureId: string, expGained?: number) => void;
  updateCreature: (id: string, updatedCreature: Creature) => void;
  getCreature: (creatureId: string) => Creature | undefined;
  getTeamCreatures: () => Creature[];
}

export const useCreatureStore = create<CreatureStore>()(
  persist(
    (set, get) => ({
      ownedCreatures: [],
      activeTeam: [],
      selectedCreature: null,

      captureCreature: (creature) =>
        set((state) => {
          const capturedCreature: Creature = {
            ...creature,
            isWild: false,
            originalTrainer: 'Player',
            id: `${creature.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          };
          return {
            ownedCreatures: [...state.ownedCreatures, capturedCreature],
          };
        }),

      addToTeam: (creatureId) =>
        set((state) => {
          if (state.activeTeam.length >= 6) {
            console.warn('Équipe complète (6 créatures max)');
            return state;
          }
          if (state.activeTeam.includes(creatureId)) {
            console.warn('Créature déjà dans l\'équipe');
            return state;
          }
          return { activeTeam: [...state.activeTeam, creatureId] };
        }),

      removeFromTeam: (creatureId) =>
        set((state) => ({
          activeTeam: state.activeTeam.filter((id) => id !== creatureId),
        })),

      selectCreature: (creatureId) => set({ selectedCreature: creatureId }),

      levelUpCreature: (creatureId, expGained = 0) =>
        set((state) => {
          const creatures = state.ownedCreatures.map((c) => {
            if (c.id === creatureId) {
              const result = progressionSystem.awardExperience(c, expGained);
              if (result.leveledUp) {
                console.log(
                  `${c.name} monte au niveau ${result.newLevel}!${result.evolved ? ' Évolution!' : ''}`
                );
              }
              return c;
            }
            return c;
          });
          return { ownedCreatures: creatures };
        }),
      updateCreature: (id, updatedCreature) =>
        set((state) => ({
          ownedCreatures: state.ownedCreatures.map((c) =>
            c.id === id ? updatedCreature : c
          ),
        })),

      getCreature: (creatureId) => {
        return get().ownedCreatures.find((c) => c.id === creatureId);
      },

      getTeamCreatures: () => {
        const state = get();
        return state.activeTeam
          .map((id) => state.ownedCreatures.find((c) => c.id === id))
          .filter((c): c is Creature => c !== undefined);
      },
    }),
    {
      name: 'creature-storage',
    }
  )
);

