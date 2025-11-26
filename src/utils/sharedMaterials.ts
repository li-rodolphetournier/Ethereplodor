import * as THREE from 'three';

// Matériaux partagés pour éviter de dépasser la limite de textures WebGL
// Ces matériaux sont réutilisés dans toute la scène

export const sharedMaterials = {
  // Sol
  ground: new THREE.MeshStandardMaterial({
    color: '#2a2a1a',
    roughness: 0.98,
    metalness: 0.02,
    emissive: '#1a1a0a',
    emissiveIntensity: 0.05,
  }),

  // Rivière
  water: new THREE.MeshStandardMaterial({
    color: '#4a7fa8',
    roughness: 0.1,
    metalness: 0.3,
    transparent: true,
    opacity: 0.8,
    emissive: '#2a4f6a',
    emissiveIntensity: 0.3,
  }),

  // Herbe
  grass: new THREE.MeshStandardMaterial({
    color: '#4a7c3a',
    roughness: 0.9,
    metalness: 0.1,
  }),

  // Roches
  rock: new THREE.MeshStandardMaterial({
    color: '#6b6b6b',
    roughness: 0.95,
    metalness: 0.1,
  }),

  // Arbres - feuillage
  treeFoliage: new THREE.MeshStandardMaterial({
    color: '#3a7a2a',
    roughness: 0.9,
    metalness: 0.1,
  }),

  // Arbres - tronc
  treeTrunk: new THREE.MeshStandardMaterial({
    color: '#6b4a2a',
    roughness: 0.9,
    metalness: 0.1,
  }),

  // Pierres tombales
  tombstone: new THREE.MeshStandardMaterial({
    color: '#2d2d2d',
    roughness: 0.9,
    metalness: 0.1,
  }),

  // Pierres décoratives
  stone: new THREE.MeshStandardMaterial({
    color: '#6b6b6b',
    roughness: 0.95,
  }),

  // Joueur - armure
  playerArmor: new THREE.MeshStandardMaterial({
    color: '#4a3728',
    metalness: 0.2,
    roughness: 0.85,
    emissive: '#1a1a1a',
    emissiveIntensity: 0.05,
  }),

  // Joueur - peau
  playerSkin: new THREE.MeshStandardMaterial({
    color: '#8b7355',
    roughness: 0.8,
  }),

  // Joueur - casque
  playerHelmet: new THREE.MeshStandardMaterial({
    color: '#2d2d2d',
    metalness: 0.3,
    roughness: 0.7,
  }),

  // Joueur - arme
  playerWeapon: new THREE.MeshStandardMaterial({
    color: '#8b4513',
    metalness: 0.6,
    roughness: 0.4,
    emissive: '#1a1a1a',
    emissiveIntensity: 0.1,
  }),

  // Joueur - lame
  weaponBlade: new THREE.MeshStandardMaterial({
    color: '#c0c0c0',
    metalness: 0.9,
    roughness: 0.2,
  }),

  // Porte - cadre
  doorFrame: new THREE.MeshStandardMaterial({
    color: '#4a3728',
    roughness: 0.9,
    metalness: 0.1,
  }),

  // Porte - panneau
  doorPanel: new THREE.MeshStandardMaterial({
    color: '#6b4a2a',
    roughness: 0.9,
    metalness: 0.1,
    emissive: '#3a2a1a',
    emissiveIntensity: 0.2,
  }),

  // Porte - poignée
  doorHandle: new THREE.MeshStandardMaterial({
    color: '#8b7355',
    metalness: 0.8,
    roughness: 0.2,
  }),

  // Torche - bois
  torchWood: new THREE.MeshStandardMaterial({
    color: '#4a3728',
    roughness: 0.9,
    metalness: 0.1,
  }),

  // Torche - métal
  torchMetal: new THREE.MeshStandardMaterial({
    color: '#6b6b6b',
    metalness: 0.7,
    roughness: 0.3,
  }),

  // Ennemi - base
  enemyBase: new THREE.MeshStandardMaterial({
    color: '#8b0000',
    roughness: 0.9,
    metalness: 0.1,
  }),

  // Créature - base
  creatureBase: new THREE.MeshStandardMaterial({
    color: '#4a7c3a',
    roughness: 0.9,
    metalness: 0.1,
  }),

  // Loot
  loot: new THREE.MeshStandardMaterial({
    color: '#ffd700',
    metalness: 0.8,
    roughness: 0.2,
    emissive: '#ffaa00',
    emissiveIntensity: 0.5,
  }),

  // Aura/ring
  aura: new THREE.MeshBasicMaterial({
    color: '#4a3728',
    transparent: true,
    opacity: 0.2,
    side: THREE.DoubleSide,
  }),
};

// Fonction pour obtenir un matériau de roche avec une couleur variée
export function getRockMaterial(color: string = '#6b6b6b'): THREE.MeshStandardMaterial {
  // Réutiliser le matériau de base et changer seulement la couleur
  const material = sharedMaterials.rock.clone();
  material.color.set(color);
  return material;
}

// Fonction pour obtenir un matériau de pierre avec une couleur variée
export function getStoneMaterial(color: string = '#6b6b6b'): THREE.MeshStandardMaterial {
  const material = sharedMaterials.stone.clone();
  material.color.set(color);
  return material;
}

// Fonction pour obtenir un matériau de fleur avec une couleur variée
export function getFlowerMaterial(color: string): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.5,
  });
}

