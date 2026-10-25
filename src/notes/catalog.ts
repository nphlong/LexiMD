export const MAX_FOLDER_NAME = 40;
export const MAX_TAG = 24;
export const MAX_TAGS = 12;

export function normalizeFolderName(name: string): string {
  return name.trim().replace(/\s+/g, ' ').slice(0, MAX_FOLDER_NAME);
}

export function normalizeTags(tags: string[]): string[] {
  const seen = new Set<string>();
  const next: string[] = [];
  for (const tag of tags) {
    const cleaned = tag.trim().replace(/\s+/g, ' ').slice(0, MAX_TAG);
    const key = cleaned.toLowerCase();
    if (!cleaned || seen.has(key)) {
      continue;
    }
    seen.add(key);
    next.push(cleaned);
    if (next.length === MAX_TAGS) {
      break;
    }
  }
  return next;
}

export function noteMatchesQuery(note: { title: string; tags: string[] }, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return true;
  }
  if (note.title.toLowerCase().includes(needle)) {
    return true;
  }
  return note.tags.some((tag) => tag.toLowerCase().includes(needle));
}

export function notesInView<T extends { title: string; tags: string[]; folderId: string | null }>(
  notes: T[],
  folderId: string | null,
  query: string,
): T[] {
  return notes.filter((note) => {
    const inFolder = folderId === null || note.folderId === folderId;
    return inFolder && noteMatchesQuery(note, query);
  });
}
