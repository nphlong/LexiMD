import { NoteIo } from './store';

export function createMemoryNoteIo(): NoteIo & { files: Map<string, string> } {
  const files = new Map<string, string>();
  return {
    files,
    async readText(name) {
      return files.has(name) ? (files.get(name) as string) : null;
    },
    async writeText(name, text) {
      files.set(name, text);
    },
    async remove(name) {
      files.delete(name);
    },
  };
}
