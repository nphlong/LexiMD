import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

import { copy, Copy } from '../copy';
import { AppearanceChoice, Scheme, Settings, resolveAppearance } from '../settings/settings';
import { SettingsStore } from '../settings/settingsStore';
import { colorsFor, Palette } from '../theme/colors';

export type PreferencesValue = {
  messages: Copy;
  colors: Palette;
  scheme: Scheme;
  appearance: AppearanceChoice;
  setAppearance: (choice: AppearanceChoice) => void;
};

const PreferencesContext = createContext<PreferencesValue | null>(null);

export function PreferencesProvider({
  children,
  settingsStore,
}: {
  children: ReactNode;
  settingsStore: SettingsStore;
}) {
  const systemScheme = useColorScheme();
  const [settings, setSettings] = useState<Settings>({ appearance: 'system' });

  useEffect(() => {
    let cancelled = false;
    settingsStore
      .read()
      .then((stored) => {
        if (!cancelled) {
          setSettings(stored);
        }
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [settingsStore]);

  const scheme = resolveAppearance(
    settings.appearance,
    systemScheme === 'dark' || systemScheme === 'light' ? systemScheme : null,
  );

  function setAppearance(choice: AppearanceChoice) {
    setSettings((current) => {
      const next = { ...current, appearance: choice };
      void settingsStore.save(next).catch(() => undefined);
      return next;
    });
  }

  const value: PreferencesValue = {
    messages: copy,
    colors: colorsFor(scheme),
    scheme,
    appearance: settings.appearance,
    setAppearance,
  };

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences(): PreferencesValue {
  const value = useContext(PreferencesContext);
  if (!value) {
    throw new Error('Preferences are missing.');
  }
  return value;
}
