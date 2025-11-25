import { create } from 'zustand';
import * as THREE from 'three';

interface PlayerState {
  position: THREE.Vector3;
  rotation: number;
  health: number;
  maxHealth: number;
  speed: number;
  isMoving: boolean;
  animationState: 'idle' | 'walk' | 'run' | 'attack';
  
  setPosition: (position: THREE.Vector3) => void;
  setRotation: (rotation: number) => void;
  setHealth: (health: number) => void;
  setIsMoving: (isMoving: boolean) => void;
  setAnimationState: (state: 'idle' | 'walk' | 'run' | 'attack') => void;
  takeDamage: (amount: number) => void;
  heal: (amount: number) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  position: new THREE.Vector3(0, 0, 0),
  rotation: 0,
  health: 100,
  maxHealth: 100,
  speed: 5,
  isMoving: false,
  animationState: 'idle',

  setPosition: (position) => set({ position }),
  setRotation: (rotation) => set({ rotation }),
  setHealth: (health) => set({ health: Math.max(0, Math.min(health, 100)) }),
  setIsMoving: (isMoving) => set({ isMoving }),
  setAnimationState: (animationState) => set({ animationState }),
  takeDamage: (amount) => set((state) => ({ 
    health: Math.max(0, state.health - amount) 
  })),
  heal: (amount) => set((state) => ({ 
    health: Math.min(state.maxHealth, state.health + amount) 
  })),
}));

