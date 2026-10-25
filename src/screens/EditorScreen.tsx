import { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { copy } from '../copy';
import { NoteStore } from '../notes/store';
import { titleFromBody } from '../notes/title';
import { previewLayout } from '../preview/layout';
import { PreviewPane } from '../preview/PreviewPane';

type Props = {
  store: NoteStore;
  noteId: string;
  onBack: () => void;
};

export function EditorScreen({ store, noteId, onBack }: Props) {
  const [body, setBody] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'write' | 'preview'>('write');
  const pending = useRef<Promise<void>>(Promise.resolve());
  const { width } = useWindowDimensions();
  const layout = previewLayout(width);
  const showEditor = layout === 'split' || mode === 'write';
  const showPreview = layout === 'split' || mode === 'preview';

  useEffect(() => {
    let cancelled = false;
    store
      .read(noteId)
      .then((note) => {
        if (cancelled) {
          return;
        }
        if (!note) {
          onBack();
          return;
        }
        setBody(note.body);
        setTitle(note.title);
      })
      .catch(() => {
        if (!cancelled) {
          setError(copy.couldNotRead);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [noteId, onBack, store]);

  function onChangeText(next: string) {
    setBody(next);
    setTitle(titleFromBody(next, copy.untitled));
    setError(null);
    pending.current = pending.current
      .catch(() => undefined)
      .then(async () => {
        await store.save(noteId, next);
      })
      .catch(() => {
        setError(copy.couldNotSave);
      });
  }

  async function goBack() {
    await pending.current;
    onBack();
  }

  function onDelete() {
    Alert.alert(copy.deleteTitle, copy.deleteBody, [
      { text: copy.cancel, style: 'cancel' },
      {
        text: copy.deleteNote,
        style: 'destructive',
        onPress: () => {
          void store
            .remove(noteId)
            .then(onBack)
            .catch(() => setError(copy.couldNotSave));
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.bar}>
        <Pressable accessibilityRole="button" onPress={() => void goBack()}>
          <Text style={styles.action}>{copy.back}</Text>
        </Pressable>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        <Pressable accessibilityRole="button" onPress={onDelete}>
          <Text style={styles.delete}>{copy.deleteNote}</Text>
        </Pressable>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {layout === 'toggle' ? (
        <View style={styles.switcher}>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: mode === 'write' }}
            onPress={() => setMode('write')}
            style={[styles.switch, mode === 'write' && styles.switchOn]}
          >
            <Text style={[styles.switchText, mode === 'write' && styles.switchTextOn]}>{copy.write}</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: mode === 'preview' }}
            onPress={() => setMode('preview')}
            style={[styles.switch, mode === 'preview' && styles.switchOn]}
          >
            <Text style={[styles.switchText, mode === 'preview' && styles.switchTextOn]}>
              {copy.preview}
            </Text>
          </Pressable>
        </View>
      ) : null}
      {body === null ? null : (
        <View style={[styles.body, layout === 'split' && styles.split]}>
          {showEditor ? (
            <TextInput
              autoFocus
              multiline
              onChangeText={onChangeText}
              placeholder={copy.writeNote}
              style={[styles.input, layout === 'split' && styles.inputSplit]}
              value={body}
            />
          ) : null}
          <View
            accessibilityElementsHidden={!showPreview}
            pointerEvents={showPreview ? 'auto' : 'none'}
            style={showPreview ? styles.preview : styles.previewHidden}
          >
            <PreviewPane markdown={body} />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  action: {
    color: '#111',
    fontSize: 17,
  },
  delete: {
    color: '#8a1f1f',
    fontSize: 17,
  },
  title: {
    flex: 1,
    color: '#111',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  error: {
    color: '#8a1f1f',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  switcher: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  switch: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  switchOn: {
    backgroundColor: '#111',
  },
  switchText: {
    color: '#111',
    fontSize: 15,
    fontWeight: '600',
  },
  switchTextOn: {
    color: '#fff',
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
    color: '#111',
    fontSize: 18,
    lineHeight: 26,
    paddingHorizontal: 16,
    paddingBottom: 24,
    textAlignVertical: 'top',
  },
  inputSplit: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: '#ddd',
  },
  preview: {
    flex: 1,
    backgroundColor: '#fff',
  },
  previewHidden: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
  },
});
