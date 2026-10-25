import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { copy } from '../copy';
import { NoteRecord, NoteStore } from '../notes/store';

type Props = {
  store: NoteStore;
  refreshKey: number;
  onOpen: (id: string) => void;
  onCreate: () => void;
};

export function LibraryScreen({ store, refreshKey, onOpen, onCreate }: Props) {
  const [notes, setNotes] = useState<NoteRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    store
      .list()
      .then((records) => {
        if (!cancelled) {
          setNotes(records);
          setError(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(copy.couldNotRead);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [store, refreshKey]);

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.name}>{copy.appName}</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {notes && notes.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.sentence}>{copy.coreFunction}</Text>
          <Text style={styles.hint}>{copy.onThisPhone}</Text>
        </View>
      ) : (
        <ScrollView style={styles.list}>
          {notes?.map((note) => (
            <Pressable key={note.id} onPress={() => onOpen(note.id)} style={styles.row}>
              <Text style={styles.title}>{note.title}</Text>
              <Text style={styles.date}>{note.updatedAt.slice(0, 10)}</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
      <Pressable accessibilityRole="button" onPress={onCreate} style={styles.primary}>
        <Text style={styles.primaryText}>{copy.newNote}</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  name: {
    color: '#111',
    fontSize: 28,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 16,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
  },
  sentence: {
    color: '#111',
    fontSize: 18,
    lineHeight: 26,
    textAlign: 'center',
  },
  hint: {
    color: '#444',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 12,
  },
  list: {
    flex: 1,
  },
  row: {
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ddd',
  },
  title: {
    color: '#111',
    fontSize: 18,
  },
  date: {
    color: '#666',
    fontSize: 13,
    marginTop: 4,
  },
  error: {
    color: '#8a1f1f',
    marginBottom: 12,
  },
  primary: {
    backgroundColor: '#111',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});
