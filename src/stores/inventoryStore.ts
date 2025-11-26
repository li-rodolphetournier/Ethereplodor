import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Item, InventoryItem } from '@/game/entities/Item';
import { showNotification } from '@/components/ui/Notification';
import { usePlayerStore } from './playerStore';

interface InventoryState {
  items: InventoryItem[];
  gold: number;
  maxSlots: number;
  equippedWeapon: Item | null;
  equippedArmor: Item | null;

  addItem: (item: Item, quantity?: number) => void;
  removeItem: (itemId: string, quantity?: number) => void;
  hasItem: (itemId: string, quantity?: number) => boolean;
  getItemQuantity: (itemId: string) => number;
  addGold: (amount: number) => void;
  removeGold: (amount: number) => boolean;
  equipWeapon: (item: Item | null) => void;
  equipArmor: (item: Item | null) => void;
  useItem: (itemId: string) => boolean;
  getInventoryItems: () => InventoryItem[];
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      items: [],
      gold: 0,
      maxSlots: 40,
      equippedWeapon: null,
      equippedArmor: null,
      lastUsedItem: null,

      addItem: (item, quantity = 1) =>
        set((state) => {
          const existingItem = state.items.find((invItem) => invItem.item.id === item.id);

          if (existingItem && item.stackable) {
            // Empiler si stackable
            const newItems = state.items.map((invItem) =>
              invItem.item.id === item.id
                ? { ...invItem, quantity: invItem.quantity + quantity }
                : invItem
            );
            return { items: newItems };
          } else {
            // Nouvel item
            if (state.items.length >= state.maxSlots) {
              console.warn('Inventaire plein!');
              return state;
            }
            return {
              items: [...state.items, { item, quantity }],
            };
          }
        }),

      removeItem: (itemId, quantity = 1) =>
        set((state) => {
          const newItems = state.items
            .map((invItem) => {
              if (invItem.item.id === itemId) {
                const newQuantity = invItem.quantity - quantity;
                if (newQuantity <= 0) {
                  return null;
                }
                return { ...invItem, quantity: newQuantity };
              }
              return invItem;
            })
            .filter((item): item is InventoryItem => item !== null);

          return { items: newItems };
        }),

      hasItem: (itemId, quantity = 1) => {
        const item = get().items.find((invItem) => invItem.item.id === itemId);
        return item ? item.quantity >= quantity : false;
      },

      getItemQuantity: (itemId) => {
        const item = get().items.find((invItem) => invItem.item.id === itemId);
        return item ? item.quantity : 0;
      },

      addGold: (amount) =>
        set((state) => ({
          gold: state.gold + amount,
        })),

      removeGold: (amount) =>
        set((state) => {
          if (state.gold >= amount) {
            return { gold: state.gold - amount };
          }
          return state;
        }),

      equipWeapon: (item) =>
        set({
          equippedWeapon: item,
        }),

      equipArmor: (item) =>
        set({
          equippedArmor: item,
        }),

      useItem: (itemId) => {
        const state = get();
        const invItem = state.items.find((i) => i.item.id === itemId);
        if (!invItem) return false;

        const item = invItem.item;
        const playerStore = usePlayerStore.getState();

        if (item.type === 'consumable') {
          let consumed = false;

          if (item.stats?.hp) {
            const missingHp = playerStore.maxHealth - playerStore.health;
            if (missingHp <= 0) {
              showNotification('Vie déjà pleine.', 'info');
              return false;
            }
            const healed = Math.min(item.stats.hp, missingHp);
            playerStore.heal(item.stats.hp);
            consumed = true;
            showNotification(`+${healed} HP`, 'success');
          }

          if (!consumed) {
            showNotification("Impossible d'utiliser cet objet pour l'instant.", 'error');
            return false;
          }

          state.removeItem(itemId, 1);
          set({ lastUsedItem: itemId });
          return true;
        }

        if (item.type === 'weapon') {
          state.equipWeapon(item);
          return true;
        }

        if (item.type === 'armor') {
          state.equipArmor(item);
          return true;
        }

        return false;
      },

      getInventoryItems: () => get().items,
    }),
    {
      name: 'inventory-storage',
    }
  )
);

