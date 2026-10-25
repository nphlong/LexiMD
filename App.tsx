import { useCallback, useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { CORE_FUNCTION } from './src/copy';
import { createFileNoteIo } from './src/notes/fileNoteIo';
import { createNoteStore, NoteIo, NoteStore } from './src/notes/store';
import { PreferencesProvider, usePreferences } from './src/preferences/Preferences';
import { EditorScreen } from './src/screens/EditorScreen';
import { LibraryScreen } from './src/screens/LibraryScreen';
import { createSettingsStore, SettingsStore } from './src/settings/settingsStore';

export { CORE_FUNCTION };

type Route = { name: 'library' } | { name: 'editor'; id: string };

type Props = {
  store?: NoteStore;
  settingsStore?: SettingsStore;
};

export default function App({ store, settingsStore }: Props) {
  const fileIo = useMemo(() => createFileNoteIo(), []);
  const settings = useMemo(
    () => settingsStore ?? createSettingsStore(fileIo),
    [fileIo, settingsStore],
  );

  return (
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 0, height: 0 },
        insets: { top: 0, left: 0, bottom: 0, right: 0 },
      }}
    >
      <PreferencesProvider settingsStore={settings}>
        <Shell fileIo={fileIo} store={store} />
      </PreferencesProvider>
    </SafeAreaProvider>
  );
}

function Shell({ fileIo, store }: { fileIo: NoteIo; store?: NoteStore }) {
  const { colors, messages, scheme } = usePreferences();
  const [route, setRoute] = useState<Route>({ name: 'library' });
  const [refreshKey, setRefreshKey] = useState(0);
  const untitled = messages.untitled;
  const notes = useMemo(
    () =>
      store ??
      createNoteStore(fileIo, {
        untitled: () => untitled,
      }),
    [fileIo, store, untitled],
  );

  const openLibrary = useCallback(() => {
    setRoute({ name: 'library' });
    setRefreshKey((value) => value + 1);
  }, []);

  async function createNote() {
    const note = await notes.create('');
    setRoute({ name: 'editor', id: note.id });
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      {route.name === 'library' ? (
        <LibraryScreen
          onCreate={() => void createNote()}
          onOpen={(id) => setRoute({ name: 'editor', id })}
          refreshKey={refreshKey}
          store={notes}
        />
      ) : (
        <EditorScreen noteId={route.id} onBack={openLibrary} store={notes} />
      )}
    </View>
  );
}
