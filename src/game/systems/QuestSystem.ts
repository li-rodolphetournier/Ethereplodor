import { Quest, QuestStatus, QuestType, QuestObjective } from '../entities/Quest';
import { useGameStore } from '@/stores/gameStore';
import { useInventoryStore } from '@/stores/inventoryStore';
import { useCreatureStore } from '@/stores/creatureStore';
import { showNotification } from '@/components/ui/Notification';

export class QuestSystem {
  private quests: Map<string, Quest> = new Map();

  constructor() {
    this.initializeQuests();
  }

  private initializeQuests() {
    // Quête 1: Tuer des ennemis
    const quest1: Quest = {
      id: 'quest_kill_5_enemies',
      title: 'Chasseur de Monstres',
      description: 'Tuez 5 ennemis pour prouver votre valeur',
      objectives: [
        {
          id: 'kill_enemies',
          description: 'Tuer 5 ennemis',
          target: 5,
          current: 0,
          type: QuestType.KILL_ENEMIES,
        },
      ],
      rewards: {
        gold: 100,
        experience: 50,
        items: [{ id: 'potion_health', quantity: 2 }],
      },
      status: QuestStatus.NOT_STARTED,
    };

    // Quête 2: Capturer des créatures
    const quest2: Quest = {
      id: 'quest_capture_3_creatures',
      title: 'Maître des Créatures',
      description: 'Capturez 3 créatures sauvages',
      objectives: [
        {
          id: 'capture_creatures',
          description: 'Capturer 3 créatures',
          target: 3,
          current: 0,
          type: QuestType.CAPTURE_CREATURES,
        },
      ],
      rewards: {
        gold: 200,
        experience: 100,
        items: [{ id: 'ball_super', quantity: 3 }],
      },
      status: QuestStatus.NOT_STARTED,
    };

    // Quête 3: Collecter des items
    const quest3: Quest = {
      id: 'quest_collect_gems',
      title: 'Collectionneur de Gemmes',
      description: 'Collectez 10 gemmes communes',
      objectives: [
        {
          id: 'collect_gems',
          description: 'Collecter 10 gemmes communes',
          target: 10,
          current: 0,
          type: QuestType.COLLECT_ITEMS,
          targetId: 'gem_common',
        },
      ],
      rewards: {
        gold: 150,
        experience: 75,
        items: [{ id: 'gem_rare', quantity: 1 }],
      },
      status: QuestStatus.NOT_STARTED,
    };

    this.quests.set(quest1.id, quest1);
    this.quests.set(quest2.id, quest2);
    this.quests.set(quest3.id, quest3);
  }

  getQuests(): Quest[] {
    return Array.from(this.quests.values());
  }

  getQuest(id: string): Quest | undefined {
    return this.quests.get(id);
  }

  startQuest(id: string): boolean {
    const quest = this.quests.get(id);
    if (!quest || quest.status !== QuestStatus.NOT_STARTED) {
      return false;
    }

    quest.status = QuestStatus.IN_PROGRESS;
    showNotification(`Quête commencée: ${quest.title}`, 'info');
    return true;
  }

  updateQuestProgress(type: QuestType, targetId?: string, amount: number = 1): void {
    this.quests.forEach((quest) => {
      if (quest.status !== QuestStatus.IN_PROGRESS) return;

      quest.objectives.forEach((objective) => {
        if (objective.type === type) {
          if (!targetId || objective.targetId === targetId) {
            objective.current = Math.min(objective.current + amount, objective.target);
            this.checkQuestCompletion(quest);
          }
        }
      });
    });
  }

  private checkQuestCompletion(quest: Quest): void {
    const allCompleted = quest.objectives.every(
      (obj) => obj.current >= obj.target
    );

    if (allCompleted && quest.status === QuestStatus.IN_PROGRESS) {
      quest.status = QuestStatus.COMPLETED;
      showNotification(`Quête terminée: ${quest.title}`, 'success');
    }
  }

  claimReward(questId: string): boolean {
    const quest = this.quests.get(questId);
    if (!quest || quest.status !== QuestStatus.COMPLETED) {
      return false;
    }

    // Donner les récompenses
    const inventory = useInventoryStore.getState();
    const creatureStore = useCreatureStore.getState();

    if (quest.rewards.gold) {
      inventory.addGold(quest.rewards.gold);
    }

    if (quest.rewards.items) {
      quest.rewards.items.forEach((item) => {
        const itemData = inventory.items.find((invItem) => invItem.item.id === item.id);
        if (itemData) {
          inventory.addItem(itemData.item, item.quantity);
        }
      });
    }

    quest.status = QuestStatus.REWARDED;
    showNotification(`Récompenses réclamées pour: ${quest.title}`, 'success');
    return true;
  }

  // Méthodes pour mettre à jour la progression depuis les événements du jeu
  onEnemyKilled(): void {
    this.updateQuestProgress(QuestType.KILL_ENEMIES);
  }

  onCreatureCaptured(): void {
    this.updateQuestProgress(QuestType.CAPTURE_CREATURES);
  }

  onItemCollected(itemId: string): void {
    this.updateQuestProgress(QuestType.COLLECT_ITEMS, itemId);
  }
}

export const questSystem = new QuestSystem();

