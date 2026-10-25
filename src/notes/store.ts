import { titleFromBody } from './title';

export class NoteStoreError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NoteStoreError';
  }
}

export type NoteRecord = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
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
  read(id: string): Promise<Note | null>;
  create(body: string): Promise<Note>;
  save(id: string, body: string): Promise<Note>;
  remove(id: string): Promise<void>;
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
    throw new NoteStoreError('That note is not on this phone.');
  }
}

function isNoteRecord(value: unknown): value is NoteRecord {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const record = value as NoteRecord;
  return (
    isNoteId(record.id) &&
    typeof record.title === 'string' &&
    typeof record.createdAt === 'string' &&
    typeof record.updatedAt === 'string'
  );
}

type StoreOptions = {
  now: () => Date;
  random: () => number;
  untitled: string;
};

export function createNoteStore(io: NoteIo, options: Partial<StoreOptions> = {}): NoteStore {
  const resolved: StoreOptions = {
    now: options.now ?? (() => new Date()),
    random: options.random ?? Math.random,
    untitled: options.untitled ?? 'Untitled',
  };

  async function readIndex(): Promise<NoteRecord[]> {
    const raw = await io.readText(INDEX_FILE);
    if (raw === null) {
      return [];
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new NoteStoreError('Could not read notes on this phone.');
    }
    if (!Array.isArray(parsed) || !parsed.every(isNoteRecord)) {
      throw new NoteStoreError('Could not read notes on this phone.');
    }
    return parsed;
  }

  async function writeIndex(records: NoteRecord[]): Promise<void> {
    await io.writeText(INDEX_FILE, JSON.stringify(records));
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

  return {
    async list() {
      return byRecent(await readIndex());
    },

    async read(id) {
      assertId(id);
      const record = (await readIndex()).find((item) => item.id === id);
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
        title: titleFromBody(body, resolved.untitled),
        createdAt: stamp,
        updatedAt: stamp,
      };
      await io.writeText(noteFile(id), body);
      const records = await readIndex();
      records.push(record);
      await writeIndex(records);
      return { ...record, body };
    },

    async save(id, body) {
      assertId(id);
      const records = await readIndex();
      const index = records.findIndex((record) => record.id === id);
      if (index < 0) {
        throw new NoteStoreError('That note is not on this phone.');
      }
      const next: NoteRecord = {
        ...records[index],
        title: titleFromBody(body, resolved.untitled),
        updatedAt: resolved.now().toISOString(),
      };
      await io.writeText(noteFile(id), body);
      records[index] = next;
      await writeIndex(records);
      return { ...next, body };
    },

    async remove(id) {
      assertId(id);
      const records = await readIndex();
      const next = records.filter((record) => record.id !== id);
      if (next.length === records.length) {
        throw new NoteStoreError('That note is not on this phone.');
      }
      await io.remove(noteFile(id));
      await writeIndex(next);
    },
  };
}
