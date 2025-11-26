import { useState, useEffect } from 'react';
import { useCreatureStore } from '@/stores/creatureStore';
import { progressionSystem } from '@/game/systems/ProgressionSystem';
import { showNotification } from './Notification';

export function ProgressionPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { ownedCreatures, activeTeam } = useCreatureStore();

  // Ouvrir/fermer avec la touche P
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'KeyP') {
        setIsOpen((prev) => !prev);
      }
      if (e.code === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen]);

  const handleLevelUp = (creatureId: string) => {
    const creature = ownedCreatures.find((c) => c.id === creatureId);
    if (!creature) return;

    // Award enough XP to level up
    const expNeeded = creature.expToNextLevel - (creature.experience || 0);
    useCreatureStore.getState().levelUpCreature(creatureId, expNeeded + 100);
    showNotification(`${creature.name} a gagné de l'expérience!`, 'success');
  };

  const handleEvolution = (creatureId: string) => {
    const creature = ownedCreatures.find((c) => c.id === creatureId);
    if (!creature || !creature.evolutionId) {
      showNotification('Cette créature ne peut pas évoluer', 'info');
      return;
    }

    const canEvolve = creature.evolutionLevel && creature.level >= creature.evolutionLevel;
    if (canEvolve) {
      // Use the existing evolveCreature method
      const evolved = progressionSystem.evolveCreature(creature);
      if (evolved) {
        showNotification(`${creature.name} a évolué!`, 'success');
        // The creature is already updated by evolveCreature
        useCreatureStore.getState().levelUpCreature(creatureId, 0); // Trigger update
      }
    } else {
      showNotification(`${creature.name} n'est pas prêt à évoluer (niveau ${creature.evolutionLevel || '?'} requis)`, 'info');
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 bg-gray-900/90 p-3 rounded-lg border border-gray-700 text-white hover:bg-gray-800 transition z-10"
      >
        📊 Progression
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border-2 border-amber-800 rounded-lg w-[90vw] max-w-4xl h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-amber-500">Progression des Créatures</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {ownedCreatures.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Aucune créature capturée
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ownedCreatures.map((creature) => {
                const level = creature.level || 1;
                const currentXP = creature.experience || 0;
                const xpNeeded = creature.expToNextLevel || 100;
                const xpProgress = Math.min(100, (currentXP / xpNeeded) * 100);
                const canEvolve = creature.evolutionLevel ? creature.level >= creature.evolutionLevel : false;
                const isInTeam = activeTeam.includes(creature.id);

                return (
                  <div
                    key={creature.id}
                    className={`bg-gray-800 p-4 rounded border-2 ${
                      isInTeam ? 'border-amber-600' : 'border-gray-700'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-white">{creature.name}</h3>
                        {isInTeam && (
                          <span className="text-xs text-amber-500">⭐ Dans l'équipe</span>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-amber-500 font-bold">Niveau {level}</div>
                        <div className="text-xs text-gray-400">
                          XP: {creature.experience || 0}
                        </div>
                      </div>
                    </div>

                    {/* XP Bar */}
                    <div className="mb-3">
                      <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-300"
                          style={{ width: `${xpProgress}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {xpProgress.toFixed(0)}% vers le niveau {level + 1}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                      <div className="text-red-400">⚔️ Attaque: {creature.stats.attack}</div>
                      <div className="text-blue-400">🛡️ Défense: {creature.stats.defense}</div>
                      <div className="text-green-400">❤️ HP: {creature.currentHp}/{creature.stats.maxHp}</div>
                      <div className="text-yellow-400">⚡ Vitesse: {creature.stats.speed}</div>
                    </div>

                    {/* Evolution Info */}
                    {creature.evolutionId && (
                      <div className="mb-3 p-2 bg-gray-900 rounded">
                        <div className="text-xs text-gray-400 mb-1">Évolution:</div>
                        <div className="text-amber-400 font-semibold">
                          → Évolution disponible
                        </div>
                        {canEvolve ? (
                          <div className="text-green-400 text-xs mt-1">✓ Prêt à évoluer</div>
                        ) : (
                          <div className="text-gray-500 text-xs mt-1">
                            Nécessite niveau {creature.evolutionLevel || 10}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleLevelUp(creature.id)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm font-semibold transition"
                      >
                        ⬆️ Level Up (Test)
                      </button>
                      {creature.evolutionId && (
                        <button
                          onClick={() => handleEvolution(creature.id)}
                          disabled={!canEvolve}
                          className={`flex-1 py-2 px-3 rounded text-sm font-semibold transition ${
                            canEvolve
                              ? 'bg-purple-600 hover:bg-purple-700 text-white'
                              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          ✨ Évoluer
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

