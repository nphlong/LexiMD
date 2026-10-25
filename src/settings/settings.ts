export type AppearanceChoice = 'system' | 'light' | 'dark';
export type Scheme = 'light' | 'dark';

export type Settings = {
  appearance: AppearanceChoice;
};

export const DEFAULT_SETTINGS: Settings = {
  appearance: 'system',
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
