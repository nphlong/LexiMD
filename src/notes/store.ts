import { normalizeFolderName, normalizeTags } from './catalog';
import { titleFromBody } from './title';

export class NoteStoreError extends Error {
  readonly code: 'read' | 'missing' | 'unsafe' | 'folder' | 'name';

  constructor(code: NoteStoreError['code']) {
    super(code);
    this.name = 'NoteStoreError';
    this.code = code;
  }
}

export type Folder = {
  id: string;
  name: string;
};

export type NoteRecord = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  folderId: string | null;
  tags: string[];
};

export type Note = NoteRecord & {
  body: string;
};

export type NoteIo = {
  readText(name: string): Promise<string | null>;
  writeText(name: string, text: string): Promise<void>;
  remove(name: string): Promise<void>;
};

export type NoteStore = {
  list(): Promise<NoteRecord[]>;
  listFolders(): Promise<Folder[]>;
  read(id: string): Promise<Note | null>;
  create(body: string): Promise<Note>;
  save(id: string, body: string): Promise<Note>;
  remove(id: string): Promise<void>;
  createFolder(name: string): Promise<Folder>;
  removeFolder(id: string): Promise<void>;
  setFolder(id: string, folderId: string | null): Promise<NoteRecord>;
  setTags(id: string, tags: string[]): Promise<NoteRecord>;
};

const INDEX_FILE = 'index.json';

export function isNoteId(id: string): boolean {
  return /^[a-z0-9]+-[a-z0-9]+$/.test(id);
}

export function createNoteId(now: Date, random: () => number): string {
  const time = now.getTime().toString(36);
  const suffix = Math.floor(random() * 36 ** 6)
    .toString(36)
    .padStart(4, '0');
  return `${time}-${suffix}`;
}

function noteFile(id: string): string {
  return `${id}.md`;
}

function assertId(id: string): void {
  if (!isNoteId(id)) {
    throw new NoteStoreError('unsafe');
  }
}

type StoredNote = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  folderId?: unknown;
  tags?: unknown;
};

function isStoredNote(value: unknown): value is StoredNote {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const record = value as StoredNote;
  return (
    isNoteId(record.id) &&
    typeof record.title === 'string' &&
    typeof record.createdAt === 'string' &&
    typeof record.updatedAt === 'string'
  );
}

function isFolder(value: unknown): value is Folder {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const folder = value as Folder;
  return isNoteId(folder.id) && typeof folder.name === 'string' && folder.name.trim().length > 0;
}

function toNoteRecord(record: StoredNote): NoteRecord {
  const folderId = typeof record.folderId === 'string' && isNoteId(record.folderId) ? record.folderId : null;
  const tags = Array.isArray(record.tags) ? record.tags.filter((tag) => typeof tag === 'string') : [];
  return {
    id: record.id,
    title: record.title,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    folderId,
    tags: normalizeTags(tags),
  };
}

type IndexFile = {
  folders: Folder[];
  notes: NoteRecord[];
};

function parseIndex(parsed: unknown): IndexFile {
  if (Array.isArray(parsed)) {
    if (!parsed.every(isStoredNote)) {
      throw new NoteStoreError('read');
    }
    return { folders: [], notes: parsed.map(toNoteRecord) };
  }
  if (!parsed || typeof parsed !== 'object') {
    throw new NoteStoreError('read');
  }
  const body = parsed as { folders?: unknown; notes?: unknown };
  if (!Array.isArray(body.notes) || !body.notes.every(isStoredNote)) {
    throw new NoteStoreError('read');
  }
  if (body.folders !== undefined && (!Array.isArray(body.folders) || !body.folders.every(isFolder))) {
    throw new NoteStoreError('read');
  }
  return {
    folders: Array.isArray(body.folders) ? body.folders : [],
    notes: body.notes.map(toNoteRecord),
  };
}

type StoreOptions = {
  now: () => Date;
  random: () => number;
  untitled: string | (() => string);
};

function untitledLabel(options: StoreOptions): string {
  return typeof options.untitled === 'function' ? options.untitled() : options.untitled;
}

export function createNoteStore(io: NoteIo, options: Partial<StoreOptions> = {}): NoteStore {
  const resolved: StoreOptions = {
    now: options.now ?? (() => new Date()),
    random: options.random ?? Math.random,
    untitled: options.untitled ?? 'Untitled',
  };

  async function readIndex(): Promise<IndexFile> {
    const raw = await io.readText(INDEX_FILE);
    if (raw === null) {
      return { folders: [], notes: [] };
    }
    try {
      return parseIndex(JSON.parse(raw));
    } catch (error) {
      if (error instanceof NoteStoreError) {
        throw error;
      }
      throw new NoteStoreError('read');
    }
  }

  async function writeIndex(index: IndexFile): Promise<void> {
    await io.writeText(INDEX_FILE, JSON.stringify(index));
  }

  function byRecent(records: NoteRecord[]): NoteRecord[] {
    return [...records].sort((a, b) => {
      if (a.updatedAt !== b.updatedAt) {
        return a.updatedAt < b.updatedAt ? 1 : -1;
      }
      if (a.id === b.id) {
        return 0;
      }
      return a.id < b.id ? -1 : 1;
    });
  }

  function byName(folders: Folder[]): Folder[] {
    return [...folders].sort((a, b) => a.name.localeCompare(b.name) || (a.id < b.id ? -1 : 1));
  }

  return {
    async list() {
      return byRecent((await readIndex()).notes);
    },

    async listFolders() {
      return byName((await readIndex()).folders);
    },

    async read(id) {
      assertId(id);
      const record = (await readIndex()).notes.find((item) => item.id === id);
      if (!record) {
        return null;
      }
      const body = await io.readText(noteFile(id));
      return { ...record, body: body ?? '' };
    },

    async create(body) {
      const now = resolved.now();
      const stamp = now.toISOString();
      const id = createNoteId(now, resolved.random);
      const record: NoteRecord = {
        id,
        title: titleFromBody(body, untitledLabel(resolved)),
        createdAt: stamp,
        updatedAt: stamp,
        folderId: null,
        tags: [],
      };
      await io.writeText(noteFile(id), body);
      const index = await readIndex();
      index.notes.push(record);
      await writeIndex(index);
      return { ...record, body };
    },

    async save(id, body) {
      assertId(id);
      const index = await readIndex();
      const at = index.notes.findIndex((record) => record.id === id);
      if (at < 0) {
        throw new NoteStoreError('missing');
      }
      const next: NoteRecord = {
        ...index.notes[at],
        title: titleFromBody(body, untitledLabel(resolved)),
        updatedAt: resolved.now().toISOString(),
      };
      await io.writeText(noteFile(id), body);
      index.notes[at] = next;
      await writeIndex(index);
      return { ...next, body };
    },

    async remove(id) {
      assertId(id);
      const index = await readIndex();
      const notes = index.notes.filter((record) => record.id !== id);
      if (notes.length === index.notes.length) {
        throw new NoteStoreError('missing');
      }
      await io.remove(noteFile(id));
      index.notes = notes;
      await writeIndex(index);
    },

    async createFolder(name) {
      const folderName = normalizeFolderName(name);
      if (!folderName) {
        throw new NoteStoreError('name');
      }
      const index = await readIndex();
      const duplicate = index.folders.some((folder) => folder.name.toLowerCase() === folderName.toLowerCase());
      if (duplicate) {
        throw new NoteStoreError('folder');
      }
      const folder: Folder = {
        id: createNoteId(resolved.now(), resolved.random),
        name: folderName,
      };
      index.folders.push(folder);
      await writeIndex(index);
      return folder;
    },

    async removeFolder(id) {
      assertId(id);
      const index = await readIndex();
      const folders = index.folders.filter((folder) => folder.id !== id);
      if (folders.length === index.folders.length) {
        throw new NoteStoreError('missing');
      }
      index.folders = folders;
      index.notes = index.notes.map((note) => (note.folderId === id ? { ...note, folderId: null } : note));
      await writeIndex(index);
    },

    async setFolder(id, folderId) {
      assertId(id);
      if (folderId !== null) {
        assertId(folderId);
      }
      const index = await readIndex();
      const at = index.notes.findIndex((record) => record.id === id);
      if (at < 0) {
        throw new NoteStoreError('missing');
      }
      if (folderId !== null && !index.folders.some((folder) => folder.id === folderId)) {
        throw new NoteStoreError('missing');
      }
      const next: NoteRecord = {
        ...index.notes[at],
        folderId,
        updatedAt: resolved.now().toISOString(),
      };
      index.notes[at] = next;
      await writeIndex(index);
      return next;
    },

    async setTags(id, tags) {
      assertId(id);
      const index = await readIndex();
      const at = index.notes.findIndex((record) => record.id === id);
      if (at < 0) {
        throw new NoteStoreError('missing');
      }
      const next: NoteRecord = {
        ...index.notes[at],
        tags: normalizeTags(tags),
        updatedAt: resolved.now().toISOString(),
      };
      index.notes[at] = next;
      await writeIndex(index);
      return next;
    },
  };
}
