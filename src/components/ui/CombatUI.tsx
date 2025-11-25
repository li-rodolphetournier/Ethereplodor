import { useMemo, useSyncExternalStore } from 'react';
import { usePlayerStore } from '@/stores/playerStore';
import { useGameStore } from '@/stores/gameStore';
import type { EnemyData } from '@/game/entities/Enemy';

// Cache the snapshot to avoid creating new arrays on every call
let cachedEnemiesArray: EnemyData[] = [];
let cachedMapSize = 0;
let cachedContentHash = '';

function getCachedEnemiesArray(): EnemyData[] {
  const map = useGameStore.getState().enemies;
  const currentSize = map.size;
  
  // Build content hash
  let currentHash = '';
  for (const [id, enemy] of map.entries()) {
    currentHash += `${id}:${enemy.hp};`;
  }
  
  // Only recreate array if content actually changed
  if (currentSize !== cachedMapSize || currentHash !== cachedContentHash) {
    cachedMapSize = currentSize;
    cachedContentHash = currentHash;
    cachedEnemiesArray = Array.from(map.values());
  }
  
  return cachedEnemiesArray;
}

export function CombatUI() {
  const playerHealth = usePlayerStore((state) => state.health);
  const playerMaxHealth = usePlayerStore((state) => state.maxHealth);
  
  // Use useSyncExternalStore with cached snapshot
  const enemies = useSyncExternalStore(
    useGameStore.subscribe,
    getCachedEnemiesArray,
    () => [] // server snapshot
  );
  
  const aliveEnemies = useMemo(() => {
    return enemies.filter((e) => e.hp > 0);
  }, [enemies]);

  return (
    <div className="fixed bottom-4 left-4 z-10">
      <div className="bg-gray-900/90 p-4 rounded-lg border border-gray-700">
        <div className="text-white font-semibold mb-2">Combat Info</div>
        <div className="text-gray-300 text-sm space-y-1">
          <div>Ennemis actifs: {aliveEnemies.length}</div>
          <div>Ennemis total: {enemies.length}</div>
          {playerHealth <= 0 && (
            <div className="text-red-500 font-bold mt-2">VOUS ÊTES MORT!</div>
          )}
        </div>
      </div>
    </div>
  );
}

