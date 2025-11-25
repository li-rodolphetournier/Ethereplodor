import { usePlayerStore } from '@/stores/playerStore';
import { useInventoryStore } from '@/stores/inventoryStore';

export function HUD() {
  const { health, maxHealth, animationState, position } = usePlayerStore();
  const gold = useInventoryStore((state) => state.gold);

  const healthPercentage = (health / maxHealth) * 100;

  return (
    <div className="fixed top-4 left-4 z-10">
      {/* Barre de vie */}
      <div className="bg-gray-900/90 p-4 rounded-lg border border-gray-700 min-w-[200px]">
        <div className="mb-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-white font-semibold">Vie</span>
            <span className="text-gray-300 text-sm">{health} / {maxHealth}</span>
          </div>
          <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden">
            <div
              className="bg-red-500 h-full transition-all duration-300"
              style={{ width: `${healthPercentage}%` }}
            />
          </div>
        </div>

        {/* État d'animation */}
        <div className="text-gray-400 text-xs mt-2">
          État: <span className="text-white capitalize">{animationState}</span>
        </div>

        {/* Position (debug) */}
        <div className="text-gray-400 text-xs mt-1">
          Pos: ({position.x.toFixed(1)}, {position.y.toFixed(1)}, {position.z.toFixed(1)})
        </div>

        {/* Or */}
        <div className="text-yellow-400 text-sm font-semibold mt-2">
          💰 {gold.toLocaleString()} or
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gray-900/90 p-3 rounded-lg border border-gray-700 mt-2 text-white text-sm">
        <div className="font-semibold mb-1">Contrôles:</div>
        <div className="text-gray-300 space-y-1">
          <div>WASD / Flèches : Déplacement</div>
          <div>Clic gauche : Attaquer</div>
          <div>C : Capturer créature (proche)</div>
          <div>I : Ouvrir inventaire</div>
        </div>
      </div>
    </div>
  );
}

