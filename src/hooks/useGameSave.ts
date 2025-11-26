import { useEffect } from 'react';
import { usePlayerStore } from '@/stores/playerStore';
import { useCreatureStore } from '@/stores/creatureStore';
import { useInventoryStore } from '@/stores/inventoryStore';
import { db } from '@/utils/database';
import { showNotification } from '@/components/ui/Notification';

export function useGameSave() {
  const playerState = usePlayerStore();
  const creatureState = useCreatureStore();
  const inventoryState = useInventoryStore();

  // Sauvegarder automatiquement toutes les 30 secondes
  useEffect(() => {
    const autoSaveInterval = setInterval(async () => {
      try {
        await saveGame();
      } catch (error) {
        console.error('Erreur lors de la sauvegarde automatique:', error);
      }
    }, 30000); // 30 secondes

    return () => clearInterval(autoSaveInterval);
  }, []);

  const saveGame = async (): Promise<void> => {
    try {
      const saveData = {
        playerData: {
          position: {
            x: playerState.position.x,
            y: playerState.position.y,
            z: playerState.position.z,
          },
          health: playerState.health,
          maxHealth: playerState.maxHealth,
          level: 1, // À implémenter
          experience: 0, // À implémenter
        },
        creatures: creatureState.ownedCreatures,
        inventory: inventoryState.items.map((invItem) => invItem.item),
        gold: inventoryState.gold,
      };

      await db.saveGame(saveData);
      console.log('Jeu sauvegardé');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      showNotification('❌ Erreur lors de la sauvegarde', 'error');
    }
  };

  const loadGame = async (): Promise<boolean> => {
    try {
      const saveData = await db.loadGame();
      if (!saveData) {
        showNotification('Aucune sauvegarde trouvée', 'info');
        return false;
      }

      // Restaurer l'état du joueur
      playerState.setPosition(
        new (await import('three')).Vector3(
          saveData.playerData.position.x,
          saveData.playerData.position.y,
          saveData.playerData.position.z
        )
      );
      playerState.setHealth(saveData.playerData.health);

      // Restaurer les créatures
      // Note: Le store Zustand avec persist devrait déjà gérer cela, mais on force la mise à jour
      saveData.creatures.forEach((creature) => {
        creatureState.captureCreature(creature);
      });

      // Restaurer l'inventaire
      saveData.inventory.forEach((item) => {
        inventoryState.addItem(item, 1);
      });
      inventoryState.addGold(saveData.gold);

      showNotification('✅ Jeu chargé avec succès', 'success');

      return true;
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      showNotification('❌ Erreur lors du chargement', 'error');
      return false;
    }
  };

  return { saveGame, loadGame };
}

