import { useFrame } from '@react-three/fiber';
import { useEffect, useRef, useSyncExternalStore, useMemo } from 'react';
import * as THREE from 'three';
import { useGameStore } from '@/stores/gameStore';
import { usePlayerStore } from '@/stores/playerStore';
import { spawnSystem } from '@/game/systems/SpawnSystem';
import { Enemy } from './Enemy';
import type { EnemyData } from '@/game/entities/Enemy';

// Cache for EnemyManager's enemy array
let cachedEnemyManagerArray: EnemyData[] = [];
let cachedEnemyManagerSize = 0;
let cachedEnemyManagerHash = '';

function getCachedEnemyManagerArray(): EnemyData[] {
  const map = useGameStore.getState().enemies;
  const currentSize = map.size;
  
  // Build content hash based on enemy IDs
  let currentHash = '';
  for (const id of map.keys()) {
    currentHash += `${id};`;
  }
  
  // Only recreate array if content actually changed
  if (currentSize !== cachedEnemyManagerSize || currentHash !== cachedEnemyManagerHash) {
    cachedEnemyManagerSize = currentSize;
    cachedEnemyManagerHash = currentHash;
    cachedEnemyManagerArray = Array.from(map.values());
  }
  
  return cachedEnemyManagerArray;
}

export function EnemyManager() {
  const enemies = useSyncExternalStore(
    useGameStore.subscribe,
    getCachedEnemyManagerArray,
    () => []
  );
  const playerPosition = usePlayerStore((state) => state.position);
  const isInitialized = useRef(false);

  // Initialiser les points de spawn
  useEffect(() => {
    if (!isInitialized.current) {
      spawnSystem.initializeSpawnPoints(new THREE.Vector3(0, 0, 0), 20, 8);
      isInitialized.current = true;
    }
  }, []);

  // Mettre à jour le système de spawn
  useFrame(() => {
    spawnSystem.update(playerPosition);
  });

  return (
    <>
      {enemies.map((enemy) => (
        <Enemy key={enemy.id} enemy={enemy} />
      ))}
    </>
  );
}

