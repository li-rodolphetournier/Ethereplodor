import { create } from 'zustand';
import * as THREE from 'three';
import { usePlayerStore } from './playerStore';

export type LevelType = 'outdoor' | 'indoor';

export interface DoorDefinition {
  id: string;
  position: [number, number, number];
  targetLevelId: string;
  targetSpawn?: [number, number, number];
  triggerDistance?: number;
  prompt?: string;
  showDoorMesh?: boolean;
}

export interface LevelDefinition {
  id: string;
  name: string;
  type: LevelType;
  spawnPoint: [number, number, number];
  doors?: DoorDefinition[];
}

interface LevelState {
  levels: Record<string, LevelDefinition>;
  currentLevel: LevelDefinition;
  isLoading: boolean;
  transitionToLevel: (targetLevelId: string, spawnOverride?: [number, number, number]) => void;
  setLoading: (value: boolean) => void;
}

const LEVEL_DEFINITIONS: Record<string, LevelDefinition> = {
  outdoor: {
    id: 'outdoor',
    name: 'Extérieur - Village',
    type: 'outdoor',
    spawnPoint: [0, 1.2, 0],
    doors: [
      {
        id: 'houseEntrance',
        position: [5.5, 1, 1.6],
        targetLevelId: 'houseInterior',
        targetSpawn: [0, 1, 0],
        triggerDistance: 2.2,
        prompt: 'Entrer dans la maison (E)',
        showDoorMesh: false,
      },
    ],
  },
  houseInterior: {
    id: 'houseInterior',
    name: 'Intérieur - Maison',
    type: 'indoor',
    spawnPoint: [0, 1.2, 0],
    doors: [
      {
        id: 'houseExit',
        position: [0, 1, 2.5],
        targetLevelId: 'outdoor',
        targetSpawn: [3.5, 1, 1.5],
        triggerDistance: 2,
        prompt: 'Sortir (E)',
        showDoorMesh: true,
      },
    ],
  },
};

export const useLevelStore = create<LevelState>((set, get) => ({
  levels: LEVEL_DEFINITIONS,
  currentLevel: LEVEL_DEFINITIONS.outdoor,
  isLoading: false,
  transitionToLevel: (targetLevelId, spawnOverride) => {
    const targetLevel = get().levels[targetLevelId];
    if (!targetLevel) {
      console.warn(`[LevelStore] Level ${targetLevelId} not found`);
      return;
    }

    set({ isLoading: true });

    window.setTimeout(() => {
      const spawn = spawnOverride || targetLevel.spawnPoint;
      const spawnVector = new THREE.Vector3(spawn[0], spawn[1], spawn[2]);
      usePlayerStore.getState().setPosition(spawnVector);

      set({
        currentLevel: targetLevel,
        isLoading: false,
      });
    }, 600);
  },
  setLoading: (value) => set({ isLoading: value }),
}));


