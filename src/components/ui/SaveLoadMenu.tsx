import { useState } from 'react';
import { useGameSave } from '@/hooks/useGameSave';
import { showNotification } from './Notification';

export function SaveLoadMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { saveGame, loadGame } = useGameSave();

  const handleSave = async () => {
    await saveGame();
    showNotification('💾 Jeu sauvegardé avec succès', 'success');
    setIsOpen(false);
  };

  const handleLoad = async () => {
    const success = await loadGame();
    if (success) {
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 bg-gray-900/90 p-3 rounded-lg border border-gray-700 text-white hover:bg-gray-800 transition z-10"
      >
        💾 Sauvegarde
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border-2 border-amber-800 rounded-lg w-[400px] p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-amber-500">Sauvegarde</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleSave}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded transition"
          >
            💾 Sauvegarder
          </button>

          <button
            onClick={handleLoad}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition"
          >
            📂 Charger
          </button>

          <div className="text-xs text-gray-400 mt-4 p-3 bg-gray-800 rounded">
            <div className="font-semibold text-amber-500 mb-2">Info:</div>
            <div>• Sauvegarde automatique toutes les 30 secondes</div>
            <div>• Appuyez sur F5 pour sauvegarder manuellement</div>
            <div>• Les données sont stockées localement</div>
          </div>
        </div>
      </div>
    </div>
  );
}

