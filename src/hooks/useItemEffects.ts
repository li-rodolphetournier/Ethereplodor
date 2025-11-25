import { useEffect } from 'react';
import { useInventoryStore } from '@/stores/inventoryStore';
import { usePlayerStore } from '@/stores/playerStore';
import { useCreatureStore } from '@/stores/creatureStore';
import { progressionSystem } from '@/game/systems/ProgressionSystem';
import { addNotification } from '@/components/ui/Notification';

export function useItemEffects() {
  const lastUsedItem = useInventoryStore((state) => state.lastUsedItem);
  const items = useInventoryStore((state) => state.items);
  const heal = usePlayerStore((state) => state.heal);
  const levelUpCreature = useCreatureStore((state) => state.levelUpCreature);
  const getTeamCreatures = useCreatureStore((state) => state.getTeamCreatures);

  useEffect(() => {
    if (!lastUsedItem) return;

    const item = items.find((invItem) => invItem.item.id === lastUsedItem)?.item;
    if (!item || item.type !== 'consumable') return;

    // Appliquer les effets selon le type d'item
    if (item.stats?.hp) {
      // Potion de soin
      heal(item.stats.hp);
      addNotification({
        message: `💚 Soigné de ${item.stats.hp} HP`,
        type: 'success',
      });
    }

    if (item.id === 'scroll_experience') {
      // Parchemin d'XP
      const teamCreatures = getTeamCreatures();
      if (teamCreatures.length > 0) {
        const creature = teamCreatures[0];
        const result = progressionSystem.awardExperience(creature, 100);
        levelUpCreature(creature.id, 100);
        if (result.leveledUp) {
          addNotification({
            message: `⭐ ${creature.name} monte au niveau ${result.newLevel}!`,
            type: 'success',
          });
        } else {
          addNotification({
            message: `⭐ ${creature.name} a gagné 100 XP!`,
            type: 'info',
          });
        }
      } else {
        addNotification({
          message: 'Aucune créature dans l\'équipe',
          type: 'error',
        });
      }
    }

    // Réinitialiser lastUsedItem après traitement
    useInventoryStore.setState({ lastUsedItem: null });
  }, [lastUsedItem, items, heal, levelUpCreature, getTeamCreatures]);
}

