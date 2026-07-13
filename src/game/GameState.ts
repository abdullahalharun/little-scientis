/**
 * Tiny persistent game state — level progress and sound preference.
 * Kept deliberately simple; each future level just records its id here.
 */
const STORAGE_KEY = 'little-muslim-scientist';

interface SavedState {
  completedLevels: string[];
  soundOn: boolean;
}

function load(): SavedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<SavedState>;
      return {
        completedLevels: Array.isArray(parsed.completedLevels)
          ? parsed.completedLevels
          : [],
        soundOn: parsed.soundOn !== false,
      };
    }
  } catch {
    // Private-mode / quota errors: fall through to defaults.
  }
  return { completedLevels: [], soundOn: true };
}

class GameStateStore {
  private state: SavedState = load();

  get soundOn(): boolean {
    return this.state.soundOn;
  }

  set soundOn(value: boolean) {
    this.state.soundOn = value;
    this.save();
  }

  isLevelComplete(id: string): boolean {
    return this.state.completedLevels.includes(id);
  }

  markLevelComplete(id: string): void {
    if (!this.isLevelComplete(id)) {
      this.state.completedLevels.push(id);
      this.save();
    }
  }

  private save(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // Best-effort persistence only.
    }
  }
}

export const GameState = new GameStateStore();
