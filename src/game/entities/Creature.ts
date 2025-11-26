import * as THREE from 'three';

export enum CreatureType {
  FIRE = 'fire',
  WATER = 'water',
  GRASS = 'grass',
  ELECTRIC = 'electric',
  GROUND = 'ground',
  FLYING = 'flying',
}

export interface CreatureStats {
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  special: number;
}

export interface Ability {
  id: string;
  name: string;
  type: CreatureType;
  power: number;
  accuracy: number;
  pp: number;
  maxPp: number;
  effect?: string;
}

export interface Creature {
  id: string;
  name: string;
  type: CreatureType;
  secondaryType?: CreatureType;
  level: number;
  stats: CreatureStats;
  baseStats: CreatureStats;
  experience: number;
  expToNextLevel: number;

  // Évolution
  evolutionId?: string;
  evolutionLevel?: number;

  // Apparence
  modelPath: string;
  iconPath: string;
  color: string; // Couleur temporaire pour représentation

  // Combat
  abilities: Ability[];
  currentHp: number;

  // Métadonnées
  captureRate: number;
  growthRate: 'slow' | 'medium' | 'fast';
  isWild: boolean;
  originalTrainer?: string;

  // Position dans le monde 3D (pour les créatures sauvages)
  position?: THREE.Vector3;
}

