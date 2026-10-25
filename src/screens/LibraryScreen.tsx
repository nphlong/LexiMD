import { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { importMarkdownFile, MarkdownFileError } from '../files/deviceFiles';
import { notesInView } from '../notes/catalog';
import { Folder, NoteRecord, NoteStore, NoteStoreError } from '../notes/store';
import { usePreferences } from '../preferences/Preferences';
import { previewLayout } from '../preview/layout';
import { Palette } from '../theme/colors';
import { SettingsSheet } from './SettingsSheet';

type Props = {
  store: NoteStore;
  refreshKey: number;
  onOpen: (id: string) => void;
  onCreate: () => void;
};

type LibraryError = 'read' | 'open' | 'type' | 'folder' | 'name' | 'save';

function Choice({
  label,
  selected,
  onPress,
  colors,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  colors: Palette;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.chip, { backgroundColor: selected ? colors.button : colors.chip }]}
    >
      <Text style={[styles.chipText, { color: selected ? colors.buttonText : colors.chipText }]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function LibraryScreen({ store, refreshKey, onOpen, onCreate }: Props) {
  const { messages, colors } = usePreferences();
  const { width } = useWindowDimensions();
  const wide = previewLayout(width) === 'split';
  const [notes, setNotes] = useState<NoteRecord[] | null>(null);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [folderId, setFolderId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<LibraryError | null>(null);
  const [adding, setAdding] = useState(false);
  const [folderDraft, setFolderDraft] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([store.list(), store.listFolders()])
      .then(([records, nextFolders]) => {
        if (!cancelled) {
          setNotes(records);
          setFolders(nextFolders);
          setError(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('read');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey, store]);

  const visible = notes ? notesInView(notes, folderId, query) : [];
  const showSentence = notes !== null && notes.length === 0 && folderId === null && query.trim() === '';

  async function reloadFolders(select: string | null) {
    setFolders(await store.listFolders());
    setFolderId(select);
  }

  async function submitFolder() {
    try {
      const folder = await store.createFolder(folderDraft);
      await reloadFolders(folder.id);
      setFolderDraft('');
      setAdding(false);
      setError(null);
    } catch (caught) {
      if (caught instanceof NoteStoreError && (caught.code === 'folder' || caught.code === 'name')) {
        setError(caught.code);
        return;
      }
      setError('save');
    }
  }

  function removeFolder() {
    if (!folderId) {
      return;
    }
    const id = folderId;
    Alert.alert(messages.deleteFolderTitle, messages.deleteFolderBody, [
      { text: messages.cancel, style: 'cancel' },
      {
        text: messages.deleteFolder,
        style: 'destructive',
        onPress: () => {
          void store
            .removeFolder(id)
            .then(() => reloadFolders(null))
            .then(() => setError(null))
            .catch(() => setError('save'));
        },
      },
    ]);
  }

  async function openFile() {
    try {
      const body = await importMarkdownFile();
      if (body === null) {
        return;
      }
      const note = await store.create(body);
      setError(null);
      onOpen(note.id);
    } catch (caught) {
      if (caught instanceof MarkdownFileError && caught.code === 'type') {
        setError('type');
        return;
      }
      setError('open');
    }
  }

  const errorText =
    error === 'read'
      ? messages.couldNotRead
      : error === 'open'
        ? messages.couldNotOpen
        : error === 'type'
          ? messages.notMarkdown
          : error === 'folder'
            ? messages.folderExists
            : error === 'name'
              ? messages.emptyFolderName
              : error === 'save'
                ? messages.couldNotSave
                : null;

  const folderControls = (
    <View style={wide ? [styles.sidebar, { borderRightColor: colors.line }] : styles.folderBlock}>
      <ScrollView
        contentContainerStyle={wide ? styles.chips : styles.chipsRow}
        horizontal={!wide}
        keyboardShouldPersistTaps="handled"
        style={wide ? styles.sidebarList : undefined}
      >
        <Choice
          colors={colors}
          label={messages.allNotes}
          onPress={() => setFolderId(null)}
          selected={folderId === null}
        />
        {folders.map((folder) => (
          <Choice
            colors={colors}
            key={folder.id}
            label={folder.name}
            onPress={() => setFolderId(folder.id)}
            selected={folderId === folder.id}
          />
        ))}
      </ScrollView>
      {adding ? (
        <View style={styles.folderForm}>
          <TextInput
            autoCapitalize="sentences"
            onChangeText={setFolderDraft}
            onSubmitEditing={() => void submitFolder()}
            placeholder={messages.folderName}
            placeholderTextColor={colors.muted}
            style={[styles.input, { color: colors.text, borderColor: colors.line }]}
            value={folderDraft}
          />
          <Pressable accessibilityRole="button" onPress={() => void submitFolder()}>
            <Text style={[styles.link, { color: colors.text }]}>{messages.addFolder}</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setAdding(false);
              setFolderDraft('');
            }}
          >
            <Text style={[styles.link, { color: colors.muted }]}>{messages.cancel}</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable accessibilityRole="button" onPress={() => setAdding(true)}>
          <Text style={[styles.link, { color: colors.text }]}>{messages.newFolder}</Text>
        </Pressable>
      )}
      {folderId ? (
        <Pressable accessibilityRole="button" onPress={removeFolder}>
          <Text style={[styles.link, { color: colors.danger }]}>{messages.deleteFolder}</Text>
        </Pressable>
      ) : null}
    </View>
  );

  const noteList = showSentence ? (
    <View style={styles.empty}>
      <Text style={[styles.sentence, { color: colors.text }]}>{messages.coreFunction}</Text>
      <Text style={[styles.hint, { color: colors.muted }]}>{messages.onThisPhone}</Text>
    </View>
  ) : (
    <ScrollView keyboardShouldPersistTaps="handled" style={styles.list}>
      {notes && visible.length === 0 ? (
        <Text style={[styles.hint, { color: colors.muted }]}>
          {query.trim() ? messages.noMatches : messages.emptyFolder}
        </Text>
      ) : null}
      {visible.map((note) => (
        <Pressable
          key={note.id}
          onPress={() => onOpen(note.id)}
          style={[styles.row, { borderTopColor: colors.line }]}
        >
          <Text style={[styles.title, { color: colors.text }]}>{note.title}</Text>
          {note.tags.length > 0 ? (
            <Text style={[styles.tags, { color: colors.muted }]}>{note.tags.join(' · ')}</Text>
          ) : null}
          <Text style={[styles.date, { color: colors.muted }]}>{note.updatedAt.slice(0, 10)}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.name, { color: colors.text }]}>{messages.appName}</Text>
        <Pressable accessibilityRole="button" onPress={() => setSettingsOpen(true)}>
          <Text style={[styles.link, { color: colors.text }]}>{messages.settings}</Text>
        </Pressable>
      </View>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={setQuery}
        placeholder={messages.search}
        placeholderTextColor={colors.muted}
        style={[styles.search, { color: colors.text, borderColor: colors.line }]}
        value={query}
      />
      {errorText ? <Text style={[styles.error, { color: colors.danger }]}>{errorText}</Text> : null}
      <View style={wide ? styles.wide : styles.narrow}>
        {folderControls}
        {noteList}
      </View>
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          onPress={() => void openFile()}
          style={[styles.secondary, { borderColor: colors.line }]}
        >
          <Text style={[styles.secondaryText, { color: colors.text }]}>{messages.openFile}</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={onCreate}
          style={[styles.primary, { backgroundColor: colors.button }]}
        >
          <Text style={[styles.primaryText, { color: colors.buttonText }]}>{messages.newNote}</Text>
        </Pressable>
      </View>
      <SettingsSheet onClose={() => setSettingsOpen(false)} visible={settingsOpen} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 8,
  },
  name: {
    fontSize: 28,
    fontWeight: '600',
  },
  search: {
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    fontSize: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  wide: {
    flex: 1,
    flexDirection: 'row',
    gap: 16,
  },
  narrow: {
    flex: 1,
  },
  sidebar: {
    borderRightWidth: StyleSheet.hairlineWidth,
    paddingRight: 12,
    width: 240,
  },
  sidebarList: {
    flex: 1,
  },
  folderBlock: {
    marginBottom: 8,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingBottom: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 8,
  },
  chip: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipText: {
    fontSize: 15,
    fontWeight: '600',
  },
  folderForm: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  link: {
    fontSize: 16,
    fontWeight: '600',
    paddingVertical: 6,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
  },
  sentence: {
    fontSize: 18,
    lineHeight: 26,
    textAlign: 'center',
  },
  hint: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
  row: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: 14,
  },
  title: {
    fontSize: 18,
  },
  tags: {
    fontSize: 14,
    marginTop: 4,
  },
  date: {
    fontSize: 13,
    marginTop: 4,
  },
  error: {
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  secondary: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 14,
  },
  secondaryText: {
    fontSize: 17,
    fontWeight: '600',
  },
  primary: {
    alignItems: 'center',
    borderRadius: 8,
    flex: 1,
    paddingVertical: 14,
  },
  primaryText: {
    fontSize: 17,
    fontWeight: '600',
  },
});
