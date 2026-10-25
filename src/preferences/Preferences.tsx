import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { getLocales } from 'expo-localization';

import { en } from '../i18n/en';
import { Messages } from '../i18n/messages';
import { vi } from '../i18n/vi';
import {
  AppearanceChoice,
  Language,
  LanguageChoice,
  Scheme,
  Settings,
  resolveAppearance,
  resolveLanguage,
} from '../settings/settings';
import { SettingsStore } from '../settings/settingsStore';
import { colorsFor, Palette } from '../theme/colors';

const tables: Record<Language, Messages> = { en, vi };

export type PreferencesValue = {
  messages: Messages;
  colors: Palette;
  scheme: Scheme;
  appearance: AppearanceChoice;
  language: LanguageChoice;
  setAppearance: (choice: AppearanceChoice) => void;
  setLanguage: (choice: LanguageChoice) => void;
};

const PreferencesContext = createContext<PreferencesValue | null>(null);

function deviceLanguageCodes(): string[] {
  return getLocales().flatMap((locale) =>
    [locale.languageCode, locale.languageTag].filter((code): code is string => Boolean(code)),
  );
}

export function PreferencesProvider({
  children,
  settingsStore,
}: {
  children: ReactNode;
  settingsStore: SettingsStore;
}) {
  const systemScheme = useColorScheme();
  const [settings, setSettings] = useState<Settings>({ appearance: 'system', language: 'system' });

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
  const language = resolveLanguage(settings.language, deviceLanguageCodes());

  function setAppearance(choice: AppearanceChoice) {
    setSettings((current) => {
      const next = { ...current, appearance: choice };
      void settingsStore.save(next).catch(() => undefined);
      return next;
    });
  }

  function setLanguage(choice: LanguageChoice) {
    setSettings((current) => {
      const next = { ...current, language: choice };
      void settingsStore.save(next).catch(() => undefined);
      return next;
    });
  }

  const value: PreferencesValue = {
    messages: tables[language],
    colors: colorsFor(scheme),
    scheme,
    appearance: settings.appearance,
    language: settings.language,
    setAppearance,
    setLanguage,
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
