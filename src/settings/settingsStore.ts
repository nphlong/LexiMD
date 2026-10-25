import { NoteIo } from '../notes/store';
import { DEFAULT_SETTINGS, parseSettings, Settings } from './settings';

const SETTINGS_FILE = 'settings.json';

export type SettingsStore = {
  read(): Promise<Settings>;
  save(settings: Settings): Promise<Settings>;
};

export function createSettingsStore(io: NoteIo): SettingsStore {
  return {
    async read() {
      const raw = await io.readText(SETTINGS_FILE);
      if (raw === null) {
        return { ...DEFAULT_SETTINGS };
      }
      try {
        return parseSettings(JSON.parse(raw));
      } catch {
        return { ...DEFAULT_SETTINGS };
      }
    },
    async save(settings) {
      const next = parseSettings(settings);
      await io.writeText(SETTINGS_FILE, JSON.stringify(next));
      return next;
    },
  };
}
