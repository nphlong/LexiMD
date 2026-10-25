import { parseSettings, resolveAppearance } from './settings';

describe('settings', () => {
  test('falls back when the file is empty or unknown', () => {
    expect(parseSettings(null)).toEqual({ appearance: 'system' });
    expect(parseSettings({ appearance: 'nope' })).toEqual({ appearance: 'system' });
    expect(parseSettings({ appearance: 'dark', language: 'vi' })).toEqual({ appearance: 'dark' });
  });

  test('follows the system appearance unless the user overrides it', () => {
    expect(resolveAppearance('system', 'dark')).toBe('dark');
    expect(resolveAppearance('system', null)).toBe('light');
    expect(resolveAppearance('light', 'dark')).toBe('light');
    expect(resolveAppearance('dark', 'light')).toBe('dark');
  });
});
