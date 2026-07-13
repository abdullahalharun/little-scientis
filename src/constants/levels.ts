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
    title: "Titu's Kitchen",
    emoji: '🌱',
    sceneKey: SceneKeys.intro,
    available: true,
  },
  { id: 'water-cycle', title: 'The Water Cycle', emoji: '🌧️', available: false },
  { id: 'bees', title: 'How Bees Make Honey', emoji: '🐝', available: false },
  { id: 'ants', title: 'Amazing Ants', emoji: '🐜', available: false },
  { id: 'moon', title: 'The Moon & Months', emoji: '🌙', available: false },
  { id: 'seeds', title: 'How Seeds Grow', emoji: '🌰', available: false },
  { id: 'butterfly', title: 'The Butterfly', emoji: '🦋', available: false },
];
