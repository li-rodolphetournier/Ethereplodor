import { useState, useEffect } from 'react';
import { useQuestStore } from '@/stores/questStore';
import { QuestStatus } from '@/game/entities/Quest';
import { showNotification } from './Notification';

export function QuestPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { quests, startQuest, claimReward, refreshQuests } = useQuestStore();

  useEffect(() => {
    refreshQuests();
  }, []);

  // Ouvrir/fermer avec la touche Q
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'KeyQ') {
        setIsOpen((prev) => !prev);
      }
      if (e.code === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen]);

  const getStatusColor = (status: QuestStatus): string => {
    switch (status) {
      case QuestStatus.NOT_STARTED:
        return 'text-gray-400';
      case QuestStatus.IN_PROGRESS:
        return 'text-blue-400';
      case QuestStatus.COMPLETED:
        return 'text-green-400';
      case QuestStatus.REWARDED:
        return 'text-gray-500';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusText = (status: QuestStatus): string => {
    switch (status) {
      case QuestStatus.NOT_STARTED:
        return 'Non commencée';
      case QuestStatus.IN_PROGRESS:
        return 'En cours';
      case QuestStatus.COMPLETED:
        return 'Terminée';
      case QuestStatus.REWARDED:
        return 'Récompensée';
      default:
        return 'Inconnu';
    }
  };

  if (!isOpen) {
    const activeQuests = quests.filter((q) => q.status === QuestStatus.IN_PROGRESS);
    const completedQuests = quests.filter((q) => q.status === QuestStatus.COMPLETED);

    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-32 right-4 bg-gray-900/90 p-3 rounded-lg border border-gray-700 text-white hover:bg-gray-800 transition z-10"
      >
        📜 Quêtes
        {activeQuests.length > 0 && (
          <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
            {activeQuests.length}
          </span>
        )}
        {completedQuests.length > 0 && (
          <span className="ml-1 bg-green-600 text-white text-xs px-2 py-0.5 rounded">
            {completedQuests.length} ✓
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border-2 border-amber-800 rounded-lg w-[90vw] max-w-4xl h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-amber-500">Quêtes</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {quests.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Aucune quête disponible
            </div>
          ) : (
            <div className="space-y-4">
              {quests.map((quest) => (
                <div
                  key={quest.id}
                  className={`bg-gray-800 p-4 rounded border-2 ${
                    quest.status === QuestStatus.IN_PROGRESS
                      ? 'border-blue-600'
                      : quest.status === QuestStatus.COMPLETED
                      ? 'border-green-600'
                      : 'border-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-white">{quest.title}</h3>
                      <p className="text-sm text-gray-400 mt-1">{quest.description}</p>
                    </div>
                    <div className={`text-sm font-semibold ${getStatusColor(quest.status)}`}>
                      {getStatusText(quest.status)}
                    </div>
                  </div>

                  {/* Objectifs */}
                  <div className="mb-3 space-y-2">
                    {quest.objectives.map((objective) => (
                      <div key={objective.id} className="bg-gray-900 p-2 rounded">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-300">{objective.description}</span>
                          <span className="text-sm font-semibold text-amber-400">
                            {objective.current} / {objective.target}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden mt-1">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-300"
                            style={{
                              width: `${Math.min(100, (objective.current / objective.target) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Récompenses */}
                  <div className="mb-3 p-2 bg-gray-900 rounded">
                    <div className="text-xs text-gray-400 mb-1">Récompenses:</div>
                    <div className="flex gap-4 text-sm">
                      {quest.rewards.gold && (
                        <div className="text-amber-400">💰 {quest.rewards.gold} or</div>
                      )}
                      {quest.rewards.experience && (
                        <div className="text-blue-400">⭐ {quest.rewards.experience} XP</div>
                      )}
                      {quest.rewards.items && quest.rewards.items.length > 0 && (
                        <div className="text-green-400">
                          📦 {quest.rewards.items.length} item(s)
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {quest.status === QuestStatus.NOT_STARTED && (
                      <button
                        onClick={() => {
                          startQuest(quest.id);
                          showNotification(`Quête commencée: ${quest.title}`, 'info');
                        }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm font-semibold transition"
                      >
                        Commencer
                      </button>
                    )}
                    {quest.status === QuestStatus.COMPLETED && (
                      <button
                        onClick={() => {
                          claimReward(quest.id);
                          showNotification(`Récompenses réclamées pour: ${quest.title}`, 'success');
                        }}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm font-semibold transition"
                      >
                        Réclamer Récompenses
                      </button>
                    )}
                    {quest.status === QuestStatus.IN_PROGRESS && (
                      <div className="flex-1 text-center text-blue-400 text-sm py-2">
                        En cours...
                      </div>
                    )}
                    {quest.status === QuestStatus.REWARDED && (
                      <div className="flex-1 text-center text-gray-500 text-sm py-2">
                        Récompensée ✓
                      </div>
                    )}
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

