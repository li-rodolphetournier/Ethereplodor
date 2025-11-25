import { useState, useEffect } from 'react';
import { useInventoryStore } from '@/stores/inventoryStore';
import { ItemType, ItemRarity } from '@/game/entities/Item';

export function Inventory() {
  const [isOpen, setIsOpen] = useState(false);

  // Ouvrir/fermer avec la touche I
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'KeyI') {
        setIsOpen((prev) => !prev);
      }
      if (e.code === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen]);
  const {
    items,
    gold,
    maxSlots,
    equippedWeapon,
    equippedArmor,
    useItem,
    removeItem,
  } = useInventoryStore();

  const getRarityColor = (rarity: ItemRarity): string => {
    const colors = {
      [ItemRarity.COMMON]: 'text-gray-400',
      [ItemRarity.UNCOMMON]: 'text-green-400',
      [ItemRarity.RARE]: 'text-blue-400',
      [ItemRarity.EPIC]: 'text-purple-400',
      [ItemRarity.LEGENDARY]: 'text-yellow-400',
    };
    return colors[rarity] || colors[ItemRarity.COMMON];
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-gray-900/90 p-3 rounded-lg border border-gray-700 text-white hover:bg-gray-800 transition z-10"
      >
        📦 Inventaire ({items.length}/{maxSlots})
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg w-[90vw] max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Inventaire</h2>
          <div className="flex items-center gap-4">
            <div className="text-yellow-400 font-semibold">
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

        {/* Équipement */}
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">Équipement</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 p-3 rounded">
              <div className="text-sm text-gray-400 mb-1">Arme</div>
              <div className="text-white">
                {equippedWeapon ? (
                  <div>
                    <div className={getRarityColor(equippedWeapon.rarity)}>
                      {equippedWeapon.name}
                    </div>
                    {equippedWeapon.stats?.attack && (
                      <div className="text-xs text-gray-400">
                        +{equippedWeapon.stats.attack} Attaque
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-500">Aucune</span>
                )}
              </div>
            </div>
            <div className="bg-gray-800 p-3 rounded">
              <div className="text-sm text-gray-400 mb-1">Armure</div>
              <div className="text-white">
                {equippedArmor ? (
                  <div>
                    <div className={getRarityColor(equippedArmor.rarity)}>
                      {equippedArmor.name}
                    </div>
                    {equippedArmor.stats?.defense && (
                      <div className="text-xs text-gray-400">
                        +{equippedArmor.stats.defense} Défense
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-500">Aucune</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Items ({items.length}/{maxSlots})</h3>
          {items.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Inventaire vide
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {items.map((invItem, index) => (
                <div
                  key={`${invItem.item.id}-${index}`}
                  className="bg-gray-800 p-2 rounded border border-gray-700 hover:border-gray-600 cursor-pointer relative group"
                  onClick={() => {
                    if (invItem.item.type === ItemType.CONSUMABLE) {
                      useItem(invItem.item.id);
                    } else if (invItem.item.type === ItemType.WEAPON) {
                      useItem(invItem.item.id);
                    } else if (invItem.item.type === ItemType.ARMOR) {
                      useItem(invItem.item.id);
                    }
                  }}
                >
                  <div
                    className="w-full aspect-square rounded mb-1 flex items-center justify-center text-white font-bold text-xs"
                    style={{ backgroundColor: invItem.item.color }}
                  >
                    {invItem.item.name.charAt(0)}
                  </div>
                  <div className="text-xs text-white truncate">{invItem.item.name}</div>
                  {invItem.quantity > 1 && (
                    <div className="absolute top-1 right-1 bg-blue-600 text-white text-xs px-1 rounded">
                      {invItem.quantity}
                    </div>
                  )}
                  <div className={`text-xs ${getRarityColor(invItem.item.rarity)}`}>
                    {invItem.item.rarity}
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-800 border border-gray-700 rounded p-2 text-xs text-white z-10 min-w-[200px]">
                    <div className="font-semibold mb-1">{invItem.item.name}</div>
                    <div className="text-gray-400 mb-1">{invItem.item.description}</div>
                    {invItem.item.stats && (
                      <div className="mt-1">
                        {invItem.item.stats.attack && (
                          <div>Attaque: +{invItem.item.stats.attack}</div>
                        )}
                        {invItem.item.stats.defense && (
                          <div>Défense: +{invItem.item.stats.defense}</div>
                        )}
                        {invItem.item.stats.hp && (
                          <div>HP: +{invItem.item.stats.hp}</div>
                        )}
                      </div>
                    )}
                    <div className="text-yellow-400 mt-1">
                      Valeur: {invItem.item.value} or
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

