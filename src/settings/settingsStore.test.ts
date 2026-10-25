import { createMemoryNoteIo } from '../notes/memoryNoteIo';
import { createSettingsStore } from './settingsStore';

describe('settings store', () => {
  test('uses system defaults when the file is missing or unreadable', async () => {
    const io = createMemoryNoteIo();
    const store = createSettingsStore(io);

    expect(await store.read()).toEqual({ appearance: 'system', language: 'system' });

    io.files.set('settings.json', '{');
    expect(await store.read()).toEqual({ appearance: 'system', language: 'system' });
  });

  test('saves an appearance and a language', async () => {
    const io = createMemoryNoteIo();
    const store = createSettingsStore(io);

    expect(await store.save({ appearance: 'dark', language: 'vi' })).toEqual({
      appearance: 'dark',
      language: 'vi',
    });
    expect(await store.read()).toEqual({ appearance: 'dark', language: 'vi' });
  });
});
