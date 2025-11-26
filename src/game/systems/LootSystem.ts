import * as THREE from 'three';
import { Item, ItemRarity } from '../entities/Item';
import itemsData from '../data/items.json';

function generateId(): string {
  return `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export interface LootDrop {
  item: Item;
  position: THREE.Vector3;
  id: string;
  pickupRange: number;
}

export class LootSystem {
  private lootDrops: Map<string, LootDrop> = new Map();

  generateLoot(
    position: THREE.Vector3,
    enemyLevel: number = 1,
    rarityBonus: number = 0
  ): LootDrop[] {
    const drops: LootDrop[] = [];
    const dropChance = 0.3 + rarityBonus; // 30% de base + bonus

    // Toujours dropper de l'or
    if (Math.random() < 0.8) {
      const goldAmount = Math.floor(Math.random() * (enemyLevel * 5) + enemyLevel * 2);
      for (let i = 0; i < goldAmount; i++) {
        const goldItem = this.getItemById('gold_coin');
        if (goldItem) {
          drops.push(this.createLootDrop(goldItem, position));
        }
      }
    }

    // Drop d'item selon la rareté (nouveau système)
    const rarityChances = this.getRarityChances(enemyLevel);
    const itemCount = 1 + Math.floor(Math.random() * 3); // 1-3 items

    for (let i = 0; i < itemCount; i++) {
      if (Math.random() < dropChance) {
        const rarity = this.rollRarity(rarityChances);
        const item = this.generateItemOfRarity(rarity, enemyLevel);
        if (item) {
          drops.push(this.createLootDrop(item, position));
        }
      }
    }

    return drops;
  }

  private getRarityChances(enemyLevel: number): Record<ItemRarity, number> {
    const baseLegendary = 0.01;
    const levelBonus = enemyLevel * 0.001;
    return {
      [ItemRarity.COMMON]: 0.60,
      [ItemRarity.UNCOMMON]: 0.25,
      [ItemRarity.RARE]: 0.10,
      [ItemRarity.EPIC]: 0.04,
      [ItemRarity.LEGENDARY]: Math.min(0.1, baseLegendary + levelBonus),
    };
  }

  private rollRarity(chances: Record<ItemRarity, number>): ItemRarity {
    const roll = Math.random();
    let cumulative = 0;

    for (const [rarity, chance] of Object.entries(chances)) {
      cumulative += chance;
      if (roll <= cumulative) return rarity as ItemRarity;
    }

    return ItemRarity.COMMON;
  }

  private generateItemOfRarity(rarity: ItemRarity, level: number): Item | null {
    const allItems = itemsData as Item[];
    
    // Filtrer par rareté
    const rarityItems = allItems.filter((item) => item.rarity === rarity);
    
    if (rarityItems.length === 0) {
      // Fallback sur common si pas d'items de cette rareté
      const commonItems = allItems.filter((item) => item.rarity === ItemRarity.COMMON);
      if (commonItems.length === 0) return null;
      const baseItem = commonItems[Math.floor(Math.random() * commonItems.length)] as Item;
      return this.scaleItemStats(baseItem, rarity, level);
    }

    const baseItem = rarityItems[Math.floor(Math.random() * rarityItems.length)] as Item;
    return this.scaleItemStats(baseItem, rarity, level);
  }

  private scaleItemStats(baseItem: Item, rarity: ItemRarity, level: number): Item {
    const statMultipliers = {
      [ItemRarity.COMMON]: 1.0,
      [ItemRarity.UNCOMMON]: 1.3,
      [ItemRarity.RARE]: 1.6,
      [ItemRarity.EPIC]: 2.0,
      [ItemRarity.LEGENDARY]: 2.5,
    };

    const multiplier = statMultipliers[rarity];
    const levelMultiplier = 1 + (level - 1) * 0.1;

    const scaledItem: Item = {
      ...baseItem,
      id: generateId(),
      value: Math.floor(baseItem.value * multiplier * levelMultiplier),
    };

    // Améliorer les stats si présentes
    if (scaledItem.stats) {
      scaledItem.stats = {
        attack: scaledItem.stats.attack ? Math.floor((scaledItem.stats.attack || 0) * multiplier * levelMultiplier) : undefined,
        defense: scaledItem.stats.defense ? Math.floor((scaledItem.stats.defense || 0) * multiplier * levelMultiplier) : undefined,
        hp: scaledItem.stats.hp ? Math.floor((scaledItem.stats.hp || 0) * multiplier * levelMultiplier) : undefined,
        speed: scaledItem.stats.speed ? Math.floor((scaledItem.stats.speed || 0) * multiplier * levelMultiplier) : undefined,
        special: scaledItem.stats.special ? Math.floor((scaledItem.stats.special || 0) * multiplier * levelMultiplier) : undefined,
      };
    }

    return scaledItem;
  }

  private generateRandomItem(level: number): Item | null {
    const allItems = itemsData as Item[];
    
    // Filtrer selon le niveau
    const availableItems = allItems.filter((item) => {
      const itemLevel = this.getItemLevel(item);
      return itemLevel <= level + 2; // Items jusqu'à 2 niveaux au-dessus
    });

    if (availableItems.length === 0) return null;

    // Probabilités selon rareté
    const rarityWeights = {
      [ItemRarity.COMMON]: 0.6,
      [ItemRarity.UNCOMMON]: 0.25,
      [ItemRarity.RARE]: 0.12,
      [ItemRarity.EPIC]: 0.03,
      [ItemRarity.LEGENDARY]: 0.0, // Pas de légendaire pour l'instant
    };

    const rand = Math.random();
    let selectedRarity: ItemRarity = ItemRarity.COMMON;
    let cumulative = 0;

    for (const [rarity, weight] of Object.entries(rarityWeights)) {
      cumulative += weight;
      if (rand <= cumulative) {
        selectedRarity = rarity as ItemRarity;
        break;
      }
    }

    // Filtrer par rareté
    const rarityItems = availableItems.filter((item) => item.rarity === selectedRarity);
    if (rarityItems.length === 0) {
      // Fallback sur common si pas d'items de cette rareté
      const commonItems = availableItems.filter((item) => item.rarity === ItemRarity.COMMON);
      if (commonItems.length === 0) return null;
      return commonItems[Math.floor(Math.random() * commonItems.length)] as Item;
    }

    return rarityItems[Math.floor(Math.random() * rarityItems.length)] as Item;
  }

  private getItemLevel(item: Item): number {
    // Déterminer le niveau approximatif selon la valeur
    if (item.value < 50) return 1;
    if (item.value < 150) return 5;
    if (item.value < 500) return 10;
    return 15;
  }

  private createLootDrop(item: Item, position: THREE.Vector3): LootDrop {
    const id = `loot_${item.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Légère variation de position
    const offset = new THREE.Vector3(
      (Math.random() - 0.5) * 2,
      0,
      (Math.random() - 0.5) * 2
    );

    return {
      item,
      position: position.clone().add(offset),
      id,
      pickupRange: 1.5,
    };
  }

  addLootDrop(drop: LootDrop): void {
    this.lootDrops.set(drop.id, drop);
  }

  addLootDrops(drops: LootDrop[]): void {
    drops.forEach((drop) => this.addLootDrop(drop));
  }

  removeLootDrop(id: string): void {
    this.lootDrops.delete(id);
  }

  getLootDrops(): LootDrop[] {
    return Array.from(this.lootDrops.values());
  }

  getItemById(id: string): Item | null {
    const items = itemsData as Item[];
    const item = items.find((i) => i.id === id);
    return item ? (item as Item) : null;
  }
}

export const lootSystem = new LootSystem();

