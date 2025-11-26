import { useState, useEffect } from 'react';
import { useInventoryStore } from '@/stores/inventoryStore';
import { shopSystem, ShopItem } from '@/game/systems/ShopSystem';
import { ItemRarity } from '@/game/entities/Item';
import { addNotification } from './Notification';
import { useDraggable } from '@/hooks/useDraggable';

export function Shop() {
  const [isOpen, setIsOpen] = useState(false);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const { gold, addItem, removeGold, items, removeItem } = useInventoryStore();
  const { ref, position, handleMouseDown } = useDraggable({
    initialPosition: { 
      x: (window.innerWidth - Math.min(window.innerWidth * 0.9, 1536)) / 2, 
      y: (window.innerHeight - window.innerHeight * 0.8) / 2 
    },
    bounds: 'window',
  });

  useEffect(() => {
    if (isOpen && shopItems.length === 0) {
      shopSystem.initializeShop();
      setShopItems(shopSystem.getShopItems());
    }
  }, [isOpen, shopItems.length]);

  // Ouvrir/fermer avec la touche B
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'KeyB') {
        setIsOpen((prev) => !prev);
      }
      if (e.code === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen]);

  const getRarityColor = (rarity: ItemRarity): string => {
    const colors = {
      [ItemRarity.COMMON]: 'text-gray-400 border-gray-500',
      [ItemRarity.UNCOMMON]: 'text-green-400 border-green-500',
      [ItemRarity.RARE]: 'text-blue-400 border-blue-500',
      [ItemRarity.EPIC]: 'text-purple-400 border-purple-500',
      [ItemRarity.LEGENDARY]: 'text-yellow-400 border-yellow-500',
    };
    return colors[rarity] || colors[ItemRarity.COMMON];
  };

  const handleBuy = (shopItem: ShopItem, quantity: number = 1) => {
    const result = shopSystem.buyItem(shopItem.item.id, quantity);
    
    if (!result.success) {
      addNotification({
        message: result.message,
        type: 'error',
      });
      return;
    }

    const totalPrice = shopItem.price * quantity;

    if (gold >= totalPrice) {
      removeGold(totalPrice);
      addItem(shopItem.item, quantity);
      shopSystem.reduceStock(shopItem.item.id, quantity);
      setShopItems(shopSystem.getShopItems());
      
      addNotification({
        message: `✅ Acheté: ${quantity}x ${shopItem.item.name}`,
        type: 'success',
      });
    } else {
      addNotification({
        message: `❌ Pas assez d'or (nécessaire: ${totalPrice})`,
        type: 'error',
      });
    }
  };

  const handleSell = (itemId: string, quantity: number = 1) => {
    const invItem = items.find((i) => i.item.id === itemId);
    if (!invItem) return;

    const sellPrice = shopSystem.sellItem(invItem.item, quantity);
    removeItem(itemId, quantity);
    useInventoryStore.getState().addGold(sellPrice);

    addNotification({
      message: `💰 Vendu: ${quantity}x ${invItem.item.name} pour ${sellPrice} or`,
      type: 'info',
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-20 bg-gray-900/90 p-3 rounded-lg border border-gray-700 text-white hover:bg-gray-800 transition z-10"
      >
        🏪 Magasin
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50">
      <div
        ref={ref}
        className="bg-gray-900 border border-gray-700 rounded-lg w-[90vw] max-w-6xl h-[80vh] flex flex-col"
        style={{
          position: 'absolute',
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        {/* Header - draggable */}
        <div
          className="flex justify-between items-center p-4 border-b border-gray-700 cursor-move select-none"
          onMouseDown={handleMouseDown}
        >
          <h2 className="text-2xl font-bold text-white">🏪 Magasin</h2>
          <div className="flex items-center gap-4">
            <div className="text-yellow-400 font-semibold text-lg">
              💰 {gold.toLocaleString()} or
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Achat */}
          <div className="flex-1 overflow-y-auto p-4 border-r border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-3">Acheter</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {shopItems.map((shopItem) => {
                const isAffordable = gold >= shopItem.price;
                const inStock = shopItem.stock === -1 || shopItem.stock > 0;

                return (
                  <div
                    key={shopItem.item.id}
                    className={`bg-gray-800 p-3 rounded border-2 ${getRarityColor(shopItem.item.rarity)} ${
                      !isAffordable || !inStock ? 'opacity-50' : ''
                    }`}
                  >
                    <div
                      className="w-full aspect-square rounded mb-2 flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: shopItem.item.color }}
                    >
                      {shopItem.item.name.charAt(0)}
                    </div>
                    <div className="text-sm text-white font-semibold mb-1">
                      {shopItem.item.name}
                    </div>
                    <div className="text-xs text-gray-400 mb-2">
                      {shopItem.item.description}
                    </div>
                    {shopItem.item.stats && (
                      <div className="text-xs text-gray-300 mb-2">
                        {shopItem.item.stats.attack && (
                          <div>⚔️ +{shopItem.item.stats.attack}</div>
                        )}
                        {shopItem.item.stats.defense && (
                          <div>🛡️ +{shopItem.item.stats.defense}</div>
                        )}
                        {shopItem.item.stats.hp && (
                          <div>❤️ +{shopItem.item.stats.hp}</div>
                        )}
                      </div>
                    )}
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-yellow-400 font-bold">
                        {shopItem.price} or
                      </div>
                      {shopItem.stock !== -1 && (
                        <div className="text-xs text-gray-400">
                          Stock: {shopItem.stock}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleBuy(shopItem, 1)}
                      disabled={!isAffordable || !inStock}
                      className={`w-full py-1 px-2 rounded text-sm font-semibold transition ${
                        isAffordable && inStock
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Acheter
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Vente */}
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Vendre</h3>
            {items.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                Aucun item à vendre
              </div>
            ) : (
              <div className="space-y-2">
                {items.map((invItem) => {
                  const sellPrice = shopSystem.sellItem(invItem.item, 1);

                  return (
                    <div
                      key={invItem.item.id}
                      className="bg-gray-800 p-3 rounded border border-gray-700 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className="w-12 h-12 rounded flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: invItem.item.color }}
                        >
                          {invItem.item.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-semibold">
                            {invItem.item.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            Quantité: {invItem.quantity}
                          </div>
                        </div>
                        <div className="text-yellow-400 font-semibold">
                          {sellPrice} or
                        </div>
                      </div>
                      <button
                        onClick={() => handleSell(invItem.item.id, 1)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-semibold ml-2"
                      >
                        Vendre
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

