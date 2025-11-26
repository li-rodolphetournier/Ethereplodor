import { create } from 'zustand';
import { Quest, QuestStatus } from '@/game/entities/Quest';
import { questSystem } from '@/game/systems/QuestSystem';

interface QuestStore {
  quests: Quest[];
  refreshQuests: () => void;
  startQuest: (id: string) => void;
  claimReward: (id: string) => void;
}

export const useQuestStore = create<QuestStore>((set, get) => ({
  quests: questSystem.getQuests(),

  refreshQuests: () => {
    set({ quests: questSystem.getQuests() });
  },

  startQuest: (id: string) => {
    const success = questSystem.startQuest(id);
    if (success) {
      get().refreshQuests();
    }
  },

  claimReward: (id: string) => {
    const success = questSystem.claimReward(id);
    if (success) {
      get().refreshQuests();
    }
  },
}));

