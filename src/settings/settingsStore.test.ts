import { createMemoryNoteIo } from '../notes/memoryNoteIo';
import { createSettingsStore } from './settingsStore';

describe('settings store', () => {
  test('uses the system appearance when the file is missing or unreadable', async () => {
    const io = createMemoryNoteIo();
    const store = createSettingsStore(io);

    expect(await store.read()).toEqual({ appearance: 'system' });

    io.files.set('settings.json', '{');
    expect(await store.read()).toEqual({ appearance: 'system' });
  });

  test('saves an appearance and ignores a stored language', async () => {
    const io = createMemoryNoteIo();
    const store = createSettingsStore(io);

    expect(await store.save({ appearance: 'dark' })).toEqual({ appearance: 'dark' });
    io.files.set('settings.json', JSON.stringify({ appearance: 'light', language: 'vi' }));
    expect(await store.read()).toEqual({ appearance: 'light' });
  });
});