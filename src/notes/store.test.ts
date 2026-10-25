import { createMemoryNoteIo } from './memoryNoteIo';
import { createNoteId, createNoteStore, isNoteId, NoteStoreError } from './store';

const now = new Date('2026-10-25T08:00:00.000Z');
const later = new Date('2026-10-25T09:00:00.000Z');

function storeWithClock(times: Date[]) {
  const io = createMemoryNoteIo();
  let call = 0;
  const store = createNoteStore(io, {
    now: () => times[Math.min(call++, times.length - 1)] ?? now,
    random: () => 0.25,
    untitled: 'Untitled',
  });
  return { io, store };
}

describe('note store', () => {
  test('creates, reads, and lists a note as a markdown file', async () => {
    const { io, store } = storeWithClock([now]);

    const created = await store.create('# Milk\nbread');

    expect(isNoteId(created.id)).toBe(true);
    expect(created.title).toBe('Milk');
    expect(created.body).toBe('# Milk\nbread');
    expect(created.createdAt).toBe(now.toISOString());
    expect(io.files.get(`${created.id}.md`)).toBe('# Milk\nbread');
    expect(await store.read(created.id)).toEqual(created);
    expect(await store.list()).toEqual([
      {
        id: created.id,
        title: 'Milk',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        folderId: null,
        tags: [],
      },
    ]);
  });

  test('reads an older index that has no folders or tags', async () => {
    const { io, store } = storeWithClock([now]);
    const id = createNoteId(now, () => 0.5);
    io.files.set(
      'index.json',
      JSON.stringify([
        {
          id,
          title: 'Old',
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
      ]),
    );

    expect(await store.list()).toEqual([
      {
        id,
        title: 'Old',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        folderId: null,
        tags: [],
      },
    ]);
  });

  test('puts a note in a folder, tags it, and keeps the note when the folder is removed', async () => {
    const { store } = storeWithClock([now, later, later, later]);
    const created = await store.create('Milk');
    const folder = await store.createFolder('  Shop  ');
    await store.setFolder(created.id, folder.id);
    const tagged = await store.setTags(created.id, ['groceries', ' Groceries ', '']);

    expect(tagged.tags).toEqual(['groceries']);
    expect(tagged.folderId).toBe(folder.id);
    expect((await store.listFolders()).map((item) => item.name)).toEqual(['Shop']);

    await store.removeFolder(folder.id);

    expect(await store.listFolders()).toEqual([]);
    expect((await store.read(created.id))?.folderId).toBeNull();
    expect((await store.read(created.id))?.tags).toEqual(['groceries']);
  });

  test('rejects an empty or duplicate folder name', async () => {
    const { store } = storeWithClock([now, later]);
    await expect(store.createFolder('   ')).rejects.toBeInstanceOf(NoteStoreError);
    await store.createFolder('Shop');
    await expect(store.createFolder('shop')).rejects.toBeInstanceOf(NoteStoreError);
  });

  test('edits the body and the title, and keeps the created time', async () => {
    const { store } = storeWithClock([now, later]);
    const created = await store.create('Draft');

    const saved = await store.save(created.id, '## Shopping\nmilk');

    expect(saved.title).toBe('Shopping');
    expect(saved.body).toBe('## Shopping\nmilk');
    expect(saved.createdAt).toBe(now.toISOString());
    expect(saved.updatedAt).toBe(later.toISOString());
  });

  test('lists the most recently updated note first', async () => {
    const { store } = storeWithClock([now, now, later]);
    const first = await store.create('First');
    await store.create('Second');
    await store.save(first.id, 'First, edited');

    const titles = (await store.list()).map((note) => note.title);
    expect(titles).toEqual(['First, edited', 'Second']);
  });

  test('deletes the note file and the index entry', async () => {
    const { io, store } = storeWithClock([now]);
    const created = await store.create('Gone');

    await store.remove(created.id);

    expect(await store.list()).toEqual([]);
    expect(await store.read(created.id)).toBeNull();
    expect(io.files.has(`${created.id}.md`)).toBe(false);
  });

  test('rejects a path outside the notes directory', async () => {
    const { store } = storeWithClock([now]);
    await expect(store.read('../secret')).rejects.toBeInstanceOf(NoteStoreError);
    await expect(store.save('../secret', 'nope')).rejects.toBeInstanceOf(NoteStoreError);
    await expect(store.remove('../secret')).rejects.toBeInstanceOf(NoteStoreError);
  });

  test('refuses to save or delete a missing note', async () => {
    const { store } = storeWithClock([now]);
    const id = createNoteId(now, () => 0.5);
    await expect(store.save(id, 'missing')).rejects.toBeInstanceOf(NoteStoreError);
    await expect(store.remove(id)).rejects.toBeInstanceOf(NoteStoreError);
  });

  test('reads an empty body when the markdown file is missing', async () => {
    const { io, store } = storeWithClock([now]);
    const created = await store.create('Keep the title');
    io.files.delete(`${created.id}.md`);

    const read = await store.read(created.id);
    expect(read?.title).toBe('Keep the title');
    expect(read?.body).toBe('');
  });

  test('throws when the index is not a note list', async () => {
    const { io, store } = storeWithClock([now]);
    io.files.set('index.json', '{');
    await expect(store.list()).rejects.toBeInstanceOf(NoteStoreError);

    io.files.set('index.json', JSON.stringify([{ id: '../x' }]));
    await expect(store.list()).rejects.toBeInstanceOf(NoteStoreError);
  });
});
