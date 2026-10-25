import { useCallback, useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { copy } from './src/copy';
import { createFileNoteIo } from './src/notes/fileNoteIo';
import { createNoteStore, NoteStore } from './src/notes/store';
import { EditorScreen } from './src/screens/EditorScreen';
import { LibraryScreen } from './src/screens/LibraryScreen';

export const CORE_FUNCTION = copy.coreFunction;

type Route = { name: 'library' } | { name: 'editor'; id: string };

type Props = {
  store?: NoteStore;
};

export default function App({ store }: Props) {
  const notes = useMemo(() => store ?? createNoteStore(createFileNoteIo()), [store]);
  const [route, setRoute] = useState<Route>({ name: 'library' });
  const [refreshKey, setRefreshKey] = useState(0);

  const openLibrary = useCallback(() => {
    setRoute({ name: 'library' });
    setRefreshKey((value) => value + 1);
  }, []);

  async function createNote() {
    const note = await notes.create('');
    setRoute({ name: 'editor', id: note.id });
  }

  return (
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 0, height: 0 },
        insets: { top: 0, left: 0, bottom: 0, right: 0 },
      }}
    >
      <StatusBar style="dark" />
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
    </SafeAreaProvider>
  );
}
