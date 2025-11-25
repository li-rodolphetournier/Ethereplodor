export enum ItemType {
  WEAPON = 'weapon',
  ARMOR = 'armor',
  CONSUMABLE = 'consumable',
  MATERIAL = 'material',
  QUEST = 'quest',
}

export enum ItemRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
}

export interface ItemStats {
  attack?: number;
  defense?: number;
  speed?: number;
  hp?: number;
  special?: number;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  rarity: ItemRarity;
  stackable: boolean;
  stackSize: number;
  value: number; // Valeur en or
  stats?: ItemStats;
  iconPath?: string;
  color: string; // Couleur selon rareté
}

export interface InventoryItem {
  item: Item;
  quantity: number;
  slot?: number;
}

