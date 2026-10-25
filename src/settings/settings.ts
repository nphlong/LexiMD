export type AppearanceChoice = 'system' | 'light' | 'dark';
export type LanguageChoice = 'system' | 'en' | 'vi';
export type Scheme = 'light' | 'dark';
export type Language = 'en' | 'vi';

export type Settings = {
  appearance: AppearanceChoice;
  language: LanguageChoice;
};

export const DEFAULT_SETTINGS: Settings = {
  appearance: 'system',
  language: 'system',
};

function choice<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === 'string' && allowed.includes(value as T) ? (value as T) : fallback;
}

export function parseSettings(value: unknown): Settings {
  if (!value || typeof value !== 'object') {
    return { ...DEFAULT_SETTINGS };
  }
  const record = value as Partial<Settings>;
  return {
    appearance: choice(record.appearance, ['system', 'light', 'dark'] as const, 'system'),
    language: choice(record.language, ['system', 'en', 'vi'] as const, 'system'),
  };
}

export function resolveAppearance(
  choiceValue: AppearanceChoice,
  system: Scheme | null | undefined,
): Scheme {
  if (choiceValue === 'light' || choiceValue === 'dark') {
    return choiceValue;
  }
  return system === 'dark' ? 'dark' : 'light';
}

export function resolveLanguage(choiceValue: LanguageChoice, languageCodes: string[]): Language {
  if (choiceValue === 'en' || choiceValue === 'vi') {
    return choiceValue;
  }
  const match = languageCodes.some((code) => {
    const tag = code.toLowerCase().replace('_', '-');
    return tag === 'vi' || tag.startsWith('vi-');
  });
  return match ? 'vi' : 'en';
}
