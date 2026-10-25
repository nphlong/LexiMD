import { parseSettings, resolveAppearance, resolveLanguage } from './settings';

describe('settings', () => {
  test('falls back when the file is empty or unknown', () => {
    expect(parseSettings(null)).toEqual({ appearance: 'system', language: 'system' });
    expect(parseSettings({ appearance: 'nope', language: 'fr' })).toEqual({
      appearance: 'system',
      language: 'system',
    });
    expect(parseSettings({ appearance: 'dark', language: 'vi' })).toEqual({
      appearance: 'dark',
      language: 'vi',
    });
  });

  test('follows the system appearance unless the user overrides it', () => {
    expect(resolveAppearance('system', 'dark')).toBe('dark');
    expect(resolveAppearance('system', null)).toBe('light');
    expect(resolveAppearance('light', 'dark')).toBe('light');
    expect(resolveAppearance('dark', 'light')).toBe('dark');
  });

  test('uses Vietnamese only when the device language is Vietnamese', () => {
    expect(resolveLanguage('system', ['vi'])).toBe('vi');
    expect(resolveLanguage('system', ['vi-VN'])).toBe('vi');
    expect(resolveLanguage('system', ['en-US'])).toBe('en');
    expect(resolveLanguage('system', [])).toBe('en');
    expect(resolveLanguage('en', ['vi-VN'])).toBe('en');
    expect(resolveLanguage('vi', ['en-US'])).toBe('vi');
  });
});
