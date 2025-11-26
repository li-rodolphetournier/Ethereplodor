import { usePlayerStore } from '@/stores/playerStore';
import { useInventoryStore } from '@/stores/inventoryStore';

export function HUD() {
  const { health, maxHealth, animationState, position } = usePlayerStore();
  const gold = useInventoryStore((state) => state.gold);

  const healthPercentage = (health / maxHealth) * 100;

  return (
    <div className="fixed top-4 left-4 z-10">
      {/* Barre de vie - style Diablo */}
      <div className="bg-black/90 p-4 rounded-lg border-2 border-amber-800/50 min-w-[200px] shadow-lg">
        <div className="mb-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-amber-600 font-bold text-sm">Vie</span>
            <span className="text-amber-500 text-sm font-semibold">{health} / {maxHealth}</span>
          </div>
          <div className="w-full bg-gray-900 h-3 rounded-full overflow-hidden border border-amber-900/50">
            <div
              className="bg-gradient-to-r from-red-700 via-red-600 to-red-500 h-full transition-all duration-300 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
              style={{ width: `${healthPercentage}%` }}
            />
          </div>
        </div>

        {/* État d'animation */}
        <div className="text-amber-700 text-xs mt-2">
          État: <span className="text-amber-500 capitalize font-semibold">{animationState}</span>
        </div>

        {/* Position (debug) */}
        <div className="text-gray-600 text-xs mt-1">
          Pos: ({position.x.toFixed(1)}, {position.y.toFixed(1)}, {position.z.toFixed(1)})
        </div>

        {/* Or - style Diablo */}
        <div className="text-amber-500 text-sm font-bold mt-2 flex items-center gap-1">
          <span className="text-lg">💰</span>
          <span>{gold.toLocaleString()} or</span>
        </div>
      </div>

      {/* Instructions - style sombre */}
      <div className="bg-black/90 p-3 rounded-lg border-2 border-amber-800/50 mt-2 text-amber-600 text-sm shadow-lg">
        <div className="font-bold mb-1 text-amber-500">Contrôles:</div>
        <div className="text-amber-700 space-y-1 text-xs">
          <div>WASD / Flèches : Déplacement</div>
          <div>Clic gauche : Attaquer</div>
          <div>C : Capturer créature (proche)</div>
          <div>I : Ouvrir inventaire</div>
          <div>B : Ouvrir magasin</div>
          <div>P : Progression créatures</div>
          <div>Q : Quêtes</div>
          <div>F5 : Sauvegarder</div>
        </div>
      </div>
    </div>
  );
}
