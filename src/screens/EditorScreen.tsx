import { useEffect, useRef, useState } from 'react';
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

import { MarkdownFileError, shareMarkdownFile } from '../files/deviceFiles';
import { normalizeTags } from '../notes/catalog';
import { Folder, NoteStore } from '../notes/store';
import { titleFromBody } from '../notes/title';
import { usePreferences } from '../preferences/Preferences';
import { previewLayout } from '../preview/layout';
import { PreviewPane } from '../preview/PreviewPane';
import { Palette } from '../theme/colors';

type Props = {
  store: NoteStore;
  noteId: string;
  onBack: () => void;
};

type EditorError = 'read' | 'save' | 'share' | 'unavailable';

function Chip({
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

export function EditorScreen({ store, noteId, onBack }: Props) {
  const { messages, colors, scheme } = usePreferences();
  const [body, setBody] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [folders, setFolders] = useState<Folder[]>([]);
  const [folderId, setFolderId] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagDraft, setTagDraft] = useState('');
  const [error, setError] = useState<EditorError | null>(null);
  const [mode, setMode] = useState<'write' | 'preview'>('write');
  const pending = useRef<Promise<void>>(Promise.resolve());
  const { width } = useWindowDimensions();
  const layout = previewLayout(width);
  const showEditor = layout === 'split' || mode === 'write';
  const showPreview = layout === 'split' || mode === 'preview';
  const showMeta = layout === 'split' || mode === 'write';

  useEffect(() => {
    let cancelled = false;
    Promise.all([store.read(noteId), store.listFolders()])
      .then(([note, nextFolders]) => {
        if (cancelled) {
          return;
        }
        if (!note) {
          onBack();
          return;
        }
        setBody(note.body);
        setTitle(note.title);
        setFolderId(note.folderId);
        setTags(note.tags);
        setFolders(nextFolders);
      })
      .catch(() => {
        if (!cancelled) {
          setError('read');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [noteId, onBack, store]);

  function enqueue(task: () => Promise<void>) {
    pending.current = pending.current
      .catch(() => undefined)
      .then(task)
      .catch(() => {
        setError('save');
      });
  }

  function onChangeText(next: string) {
    setBody(next);
    setTitle(titleFromBody(next, messages.untitled));
    setError(null);
    enqueue(async () => {
      await store.save(noteId, next);
    });
  }

  function chooseFolder(next: string | null) {
    setFolderId(next);
    setError(null);
    enqueue(async () => {
      await store.setFolder(noteId, next);
    });
  }

  function commitTags(next: string[]) {
    setTags(next);
    setError(null);
    enqueue(async () => {
      await store.setTags(noteId, next);
    });
  }

  function addTag() {
    const next = normalizeTags([...tags, tagDraft]);
    setTagDraft('');
    if (next.join('\n') === tags.join('\n')) {
      return;
    }
    commitTags(next);
  }

  async function goBack() {
    await pending.current;
    onBack();
  }

  function onDelete() {
    Alert.alert(messages.deleteTitle, messages.deleteBody, [
      { text: messages.cancel, style: 'cancel' },
      {
        text: messages.deleteNote,
        style: 'destructive',
        onPress: () => {
          void store
            .remove(noteId)
            .then(onBack)
            .catch(() => setError('save'));
        },
      },
    ]);
  }

  async function onShare() {
    if (body === null) {
      return;
    }
    await pending.current;
    try {
      await shareMarkdownFile(title || messages.untitled, body, messages.untitled);
      setError(null);
    } catch (caught) {
      if (caught instanceof MarkdownFileError && caught.code === 'unavailable') {
        setError('unavailable');
        return;
      }
      setError('share');
    }
  }

  const errorText =
    error === 'read'
      ? messages.couldNotRead
      : error === 'save'
        ? messages.couldNotSave
        : error === 'unavailable'
          ? messages.shareUnavailable
          : error === 'share'
            ? messages.couldNotShare
            : null;

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={styles.bar}>
        <Pressable accessibilityRole="button" onPress={() => void goBack()}>
          <Text style={[styles.action, { color: colors.text }]}>{messages.back}</Text>
        </Pressable>
        <Text numberOfLines={1} style={[styles.title, { color: colors.text }]}>
          {title}
        </Text>
        <Pressable accessibilityRole="button" onPress={onDelete}>
          <Text style={[styles.delete, { color: colors.danger }]}>{messages.deleteNote}</Text>
        </Pressable>
      </View>
      <Pressable accessibilityRole="button" onPress={() => void onShare()} style={styles.share}>
        <Text style={[styles.action, { color: colors.text }]}>{messages.share}</Text>
      </Pressable>
      {errorText ? <Text style={[styles.error, { color: colors.danger }]}>{errorText}</Text> : null}
      {layout === 'toggle' ? (
        <View style={styles.switcher}>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: mode === 'write' }}
            onPress={() => setMode('write')}
            style={[styles.switch, { backgroundColor: mode === 'write' ? colors.button : colors.chip }]}
          >
            <Text style={{ color: mode === 'write' ? colors.buttonText : colors.chipText, fontWeight: '600' }}>
              {messages.write}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: mode === 'preview' }}
            onPress={() => setMode('preview')}
            style={[styles.switch, { backgroundColor: mode === 'preview' ? colors.button : colors.chip }]}
          >
            <Text
              style={{ color: mode === 'preview' ? colors.buttonText : colors.chipText, fontWeight: '600' }}
            >
              {messages.preview}
            </Text>
          </Pressable>
        </View>
      ) : null}
      {body === null ? null : (
        <View style={styles.column}>
          {showMeta ? (
            <ScrollView
              contentContainerStyle={styles.meta}
              keyboardShouldPersistTaps="handled"
              style={styles.metaScroll}
            >
              <View style={styles.chips}>
                <Chip
                  colors={colors}
                  label={messages.noFolder}
                  onPress={() => chooseFolder(null)}
                  selected={folderId === null}
                />
                {folders.map((folder) => (
                  <Chip
                    colors={colors}
                    key={folder.id}
                    label={folder.name}
                    onPress={() => chooseFolder(folder.id)}
                    selected={folderId === folder.id}
                  />
                ))}
              </View>
              <Text style={[styles.metaLabel, { color: colors.muted }]}>{messages.tags}</Text>
              <View style={styles.chips}>
                {tags.map((tag) => (
                  <Chip
                    colors={colors}
                    key={tag}
                    label={`${tag} ×`}
                    onPress={() => commitTags(tags.filter((item) => item !== tag))}
                    selected={false}
                  />
                ))}
              </View>
              <View style={styles.tagRow}>
                <TextInput
                  autoCapitalize="none"
                  onChangeText={setTagDraft}
                  onSubmitEditing={addTag}
                  placeholder={messages.tagPlaceholder}
                  placeholderTextColor={colors.muted}
                  style={[styles.tagInput, { color: colors.text, borderColor: colors.line }]}
                  value={tagDraft}
                />
                <Pressable accessibilityRole="button" onPress={addTag}>
                  <Text style={[styles.action, { color: colors.text }]}>{messages.addTag}</Text>
                </Pressable>
              </View>
            </ScrollView>
          ) : null}
          <View style={[styles.body, layout === 'split' && styles.split]}>
            {showEditor ? (
              <TextInput
                autoFocus
                multiline
                onChangeText={onChangeText}
                placeholder={messages.writeNote}
                placeholderTextColor={colors.muted}
                style={[
                  styles.input,
                  { color: colors.text },
                  layout === 'split' && { borderRightColor: colors.line, borderRightWidth: StyleSheet.hairlineWidth },
                ]}
                value={body}
              />
            ) : null}
            <View
              accessibilityElementsHidden={!showPreview}
              pointerEvents={showPreview ? 'auto' : 'none'}
              style={showPreview ? styles.preview : styles.previewHidden}
            >
              <PreviewPane
                backgroundColor={colors.background}
                diagramError={messages.diagramError}
                markdown={body}
                previewFailed={messages.previewFailed}
                textColor={colors.danger}
                theme={scheme}
              />
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  bar: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  share: {
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  action: {
    fontSize: 17,
  },
  delete: {
    fontSize: 17,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  error: {
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  switcher: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  switch: {
    alignItems: 'center',
    borderRadius: 8,
    flex: 1,
    paddingVertical: 8,
  },
  column: {
    flex: 1,
  },
  metaScroll: {
    flexGrow: 0,
    maxHeight: 180,
  },
  meta: {
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  metaLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
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
  tagRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  tagInput: {
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  body: {
    flex: 1,
    position: 'relative',
  },
  split: {
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    fontSize: 18,
    lineHeight: 26,
    paddingBottom: 24,
    paddingHorizontal: 16,
    textAlignVertical: 'top',
  },
  preview: {
    flex: 1,
  },
  previewHidden: {
    bottom: 0,
    left: 0,
    opacity: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
