import { useCreatureStore } from '@/stores/creatureStore';
import { Creature } from '@/game/entities/Creature';
import { useDraggable } from '@/hooks/useDraggable';

export function CreatureTeamPanel() {
  const {
    activeTeam,
    ownedCreatures,
    selectCreature,
    selectedCreature,
    addToTeam,
    removeFromTeam,
  } = useCreatureStore();
  
  const { ref, position, handleMouseDown } = useDraggable({
    initialPosition: { x: window.innerWidth - 320, y: 16 },
    bounds: 'window',
  });

  const teamCreatures = activeTeam
    .map((id) => ownedCreatures.find((c) => c.id === id))
    .filter((c): c is Creature => c !== undefined);

  const availableCreatures = ownedCreatures.filter(
    (c) => !activeTeam.includes(c.id)
  );

  return (
    <div
      ref={ref}
      className="fixed z-20 max-h-[80vh] overflow-y-auto cursor-move select-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="bg-gray-900/90 p-4 rounded-lg border border-gray-700 min-w-[280px]">
        <h2 className="text-xl font-bold mb-3 text-white">Équipe Active</h2>

        <div className="space-y-2 mb-4">
          {teamCreatures.map((creature) => (
            <div
              key={creature.id}
              onClick={() => selectCreature(creature.id)}
              className={`flex items-center gap-3 p-2 rounded cursor-pointer transition ${
                selectedCreature === creature.id
                  ? 'bg-blue-600/50 border-2 border-blue-400'
                  : 'bg-gray-800 hover:bg-gray-700 border-2 border-transparent'
              }`}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: creature.color }}
              >
                {creature.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white">{creature.name}</div>
                <div className="text-sm text-gray-400">Lv. {creature.level}</div>
                <div className="w-full bg-gray-700 h-1 rounded mt-1">
                  <div
                    className="bg-green-500 h-full rounded transition-all"
                    style={{
                      width: `${(creature.currentHp / creature.stats.maxHp) * 100}%`,
                    }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  HP: {Math.ceil(creature.currentHp)}/{creature.stats.maxHp}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromTeam(creature.id);
                }}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {teamCreatures.length < 6 && (
          <div className="text-center text-gray-500 text-sm mb-3">
            {6 - teamCreatures.length} emplacement(s) libre(s)
          </div>
        )}

        {availableCreatures.length > 0 && (
          <div className="border-t border-gray-700 pt-3 mt-3">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">
              Créatures disponibles
            </h3>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {availableCreatures.map((creature) => (
                <div
                  key={creature.id}
                  className="flex items-center gap-2 p-2 bg-gray-800 rounded hover:bg-gray-700 cursor-pointer"
                  onClick={() => addToTeam(creature.id)}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: creature.color }}
                  >
                    {creature.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-white">{creature.name}</div>
                    <div className="text-xs text-gray-400">Lv. {creature.level}</div>
                  </div>
                  <button className="text-green-400 text-sm">+</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {ownedCreatures.length === 0 && (
          <div className="text-center text-gray-500 text-sm py-4">
            Aucune créature capturée
            <br />
            <span className="text-xs">Approchez-vous d'une créature sauvage et appuyez sur C pour capturer</span>
          </div>
        )}
      </div>
    </div>
  );
}

