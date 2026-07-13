import { SceneKeys } from './scenes';

/**
 * The series registry. Adding a future mini-game = add an entry here with its
 * entry scene key and set `available: true`; HomeScene renders the map from
 * this list automatically.
 */
export interface LevelDef {
  id: string;
  title: string;
  emoji: string;
  /** Entry scene of the level; undefined while still locked/in production. */
  sceneKey?: string;
  available: boolean;
}

export const LEVELS: LevelDef[] = [
  {
    id: 'photosynthesis',
    title: 'টিটুর রান্নাঘর',
    emoji: '🌱',
    sceneKey: SceneKeys.intro,
    available: true,
  },
  { id: 'water-cycle', title: 'পানির চক্র', emoji: '🌧️', available: false },
  { id: 'bees', title: 'মৌমাছির মধু', emoji: '🐝', available: false },
  { id: 'ants', title: 'পিঁপড়ার রাজ্য', emoji: '🐜', available: false },
  { id: 'moon', title: 'চাঁদ ও মাসগুলো', emoji: '🌙', available: false },
  { id: 'seeds', title: 'বীজ থেকে চারা', emoji: '🌰', available: false },
  { id: 'butterfly', title: 'প্রজাপতির গল্প', emoji: '🦋', available: false },
];
