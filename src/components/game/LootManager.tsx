import { useFrame } from '@react-three/fiber';
import { useEffect } from 'react';
import * as THREE from 'three';
import { lootSystem } from '@/game/systems/LootSystem';
import { LootDrop } from './LootDrop';
import { usePlayerStore } from '@/stores/playerStore';
import { useInventoryStore } from '@/stores/inventoryStore';
import { useGameStore } from '@/stores/gameStore';
import { showNotification } from '@/components/ui/Notification';
import { questSystem } from '@/game/systems/QuestSystem';
import { useQuestStore } from '@/stores/questStore';

export function LootManager() {
  const playerPosition = usePlayerStore((state) => state.position);
  const addItem = useInventoryStore((state) => state.addItem);
  const addGold = useInventoryStore((state) => state.addGold);
  const removeLootDrop = (id: string) => {
    lootSystem.removeLootDrop(id);
  };

  // Vérifier le ramassage de loot
  useFrame(() => {
    const lootDrops = lootSystem.getLootDrops();
    const playerPos = playerPosition;

    lootDrops.forEach((drop) => {
      const distance = playerPos.distanceTo(drop.position);

      if (distance < drop.pickupRange) {
        // Ramasser l'item
        if (drop.item.id === 'gold_coin') {
          addGold(drop.item.value);
        } else {
          addItem(drop.item, 1);
          // Mettre à jour la progression des quêtes
          questSystem.onItemCollected(drop.item.id);
          useQuestStore.getState().refreshQuests();
        }
        removeLootDrop(drop.id);
      }
    });
  });

  // Écouter les événements de mort d'ennemis pour générer du loot
  useEffect(() => {
    const checkEnemyDeaths = () => {
      const enemies = Array.from(useGameStore.getState().enemies.values());
      const gameStore = useGameStore.getState();
      
      enemies.forEach((enemy) => {
        if (enemy.hp <= 0 && enemy.state !== 'dead') {
          const enemyLevel = enemy.level || 1;
          
          // Générer du loot à la position de l'ennemi
          const loot = lootSystem.generateLoot(
            enemy.position,
            enemyLevel,
            0
          );
          lootSystem.addLootDrops(loot);
          
          // Ajouter de l'or directement
          const goldAmount = Math.floor(Math.random() * enemyLevel * 5 + enemyLevel * 2);
          addGold(goldAmount);
          
          // Marquer l'ennemi comme mort pour éviter les doubles drops
          gameStore.updateEnemy(enemy.id, { state: 'dead' as any });
        }
      });
    };

    const interval = setInterval(checkEnemyDeaths, 500);
    return () => clearInterval(interval);
  }, [addItem, addGold]);

  const lootDrops = lootSystem.getLootDrops();

  return (
    <>
      {lootDrops.map((drop) => (
        <LootDrop key={drop.id} drop={drop} onPickup={removeLootDrop} />
      ))}
    </>
  );
}

