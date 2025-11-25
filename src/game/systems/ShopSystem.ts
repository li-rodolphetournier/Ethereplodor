import { Item } from '../entities/Item';
import itemsData from '../data/items.json';

export interface ShopItem {
  item: Item;
  stock: number; // -1 = illimité
  price: number; // Prix d'achat (peut différer de item.value)
}

export class ShopSystem {
  private shopItems: Map<string, ShopItem> = new Map();

  initializeShop(): void {
    const allItems = itemsData as Item[];
    
    // Créer des items de magasin avec prix ajustés
    allItems.forEach((item) => {
      const shopItem: ShopItem = {
        item,
        stock: item.type === 'material' ? -1 : Math.floor(Math.random() * 5) + 1, // Matériaux illimités
        price: Math.floor(item.value * 1.5), // Prix d'achat = valeur * 1.5
      };
      this.shopItems.set(item.id, shopItem);
    });
  }

  getShopItems(): ShopItem[] {
    return Array.from(this.shopItems.values());
  }

  getShopItem(itemId: string): ShopItem | undefined {
    return this.shopItems.get(itemId);
  }

  buyItem(itemId: string, quantity: number = 1): { success: boolean; message: string } {
    const shopItem = this.shopItems.get(itemId);
    if (!shopItem) {
      return { success: false, message: 'Item non trouvé' };
    }

    if (shopItem.stock !== -1 && shopItem.stock < quantity) {
      return { success: false, message: 'Stock insuffisant' };
    }

    const totalPrice = shopItem.price * quantity;
    
    // Vérifier l'or sera fait côté store
    return {
      success: true,
      message: `Achat de ${quantity}x ${shopItem.item.name} pour ${totalPrice} or`,
    };
  }

  sellItem(item: Item, quantity: number = 1): number {
    // Prix de vente = 50% de la valeur de l'item
    return Math.floor(item.value * 0.5 * quantity);
  }

  reduceStock(itemId: string, quantity: number): void {
    const shopItem = this.shopItems.get(itemId);
    if (shopItem && shopItem.stock !== -1) {
      shopItem.stock = Math.max(0, shopItem.stock - quantity);
    }
  }
}

export const shopSystem = new ShopSystem();

