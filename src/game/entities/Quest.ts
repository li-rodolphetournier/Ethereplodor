export enum QuestStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  REWARDED = 'rewarded',
}

export enum QuestType {
  KILL_ENEMIES = 'kill_enemies',
  COLLECT_ITEMS = 'collect_items',
  CAPTURE_CREATURES = 'capture_creatures',
  REACH_LEVEL = 'reach_level',
  EXPLORE_AREA = 'explore_area',
}

export interface QuestObjective {
  id: string;
  description: string;
  target: number;
  current: number;
  type: QuestType;
  targetId?: string; // ID de l'ennemi, item, créature, etc.
}

export interface QuestReward {
  gold?: number;
  experience?: number;
  items?: Array<{ id: string; quantity: number }>;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  objectives: QuestObjective[];
  rewards: QuestReward;
  status: QuestStatus;
  level?: number; // Niveau requis
}

