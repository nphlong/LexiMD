import { Directory, File, Paths } from 'expo-file-system';

import { NoteIo } from './store';

const NOTES_DIRECTORY = 'notes';

function notesDirectory(): Directory {
  const directory = new Directory(Paths.document, NOTES_DIRECTORY);
  if (!directory.exists) {
    directory.create();
  }
  return directory;
}

export function createFileNoteIo(): NoteIo {
  return {
    async readText(name) {
      const file = new File(notesDirectory(), name);
      if (!file.exists) {
        return null;
      }
      return file.text();
    },
    async writeText(name, text) {
      const file = new File(notesDirectory(), name);
      await file.write(text);
    },
    async remove(name) {
      const file = new File(notesDirectory(), name);
      if (file.exists) {
        file.delete();
      }
    },
  };
}
