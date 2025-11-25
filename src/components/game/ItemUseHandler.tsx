import { useEffect } from 'react';
import { useInventoryStore } from '@/stores/inventoryStore';
import { usePlayerStore } from '@/stores/playerStore';
import { useCreatureStore } from '@/stores/creatureStore';
import { progressionSystem } from '@/game/systems/ProgressionSystem';

// Gestionnaire global pour l'utilisation d'items
export function ItemUseHandler() {
  const items = useInventoryStore((state) => state.items);
  const heal = usePlayerStore((state) => state.heal);
  const levelUpCreature = useCreatureStore((state) => state.levelUpCreature);
  const getTeamCreatures = useCreatureStore((state) => state.getTeamCreatures);
  const removeItem = useInventoryStore((state) => state.removeItem);

  useEffect(() => {
    // Écouter les changements d'items pour détecter l'utilisation
    // Note: Dans une vraie implémentation, on utiliserait un système d'événements
    // Pour l'instant, on gère via le store directement
  }, [items]);

  // Fonction pour utiliser un item consommable
  const useConsumable = (itemId: string): boolean => {
    const item = items.find((invItem) => invItem.item.id === itemId)?.item;
    if (!item || item.type !== 'consumable') return false;

    if (item.stats?.hp) {
      // Potion de soin
      heal(item.stats.hp);
      removeItem(itemId, 1);
      return true;
    }

    // Parchemin d'XP
    if (item.id === 'scroll_experience') {
      const teamCreatures = getTeamCreatures();
      if (teamCreatures.length > 0) {
        // Donner XP à la première créature de l'équipe
        levelUpCreature(teamCreatures[0].id, 100);
        removeItem(itemId, 1);
        return true;
      }
    }

    return false;
  };

  return null; // Composant invisible, juste pour la logique
}

