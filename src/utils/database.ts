import Dexie, { Table } from 'dexie';
import { Creature } from '@/game/entities/Creature';
import { Item } from '@/game/entities/Item';

export interface SaveData {
  id: string;
  playerData: {
    position: { x: number; y: number; z: number };
    health: number;
    maxHealth: number;
    level: number;
    experience: number;
  };
  creatures: Creature[];
  inventory: Item[];
  gold: number;
  timestamp: number;
}

class GameDatabase extends Dexie {
  saves!: Table<SaveData>;

  constructor() {
    super('DiabloPokemonGame');
    this.version(1).stores({
      saves: 'id, timestamp',
    });
  }

  async saveGame(data: Omit<SaveData, 'id' | 'timestamp'>): Promise<string> {
    const saveData: SaveData = {
      ...data,
      id: 'current',
      timestamp: Date.now(),
    };
    await this.saves.put(saveData);
    return saveData.id;
  }

  async loadGame(): Promise<SaveData | undefined> {
    return this.saves.get('current');
  }

  async deleteGame(): Promise<void> {
    await this.saves.delete('current');
  }

  async getAllSaves(): Promise<SaveData[]> {
    return this.saves.orderBy('timestamp').reverse().toArray();
  }
}

export const db = new GameDatabase();

