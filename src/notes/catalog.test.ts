import { normalizeFolderName, normalizeTags, noteMatchesQuery, notesInView } from './catalog';

describe('folders and tags', () => {
  test('trims a folder name and limits its length', () => {
    expect(normalizeFolderName('  Work   notes  ')).toBe('Work notes');
    expect(normalizeFolderName('a'.repeat(80))).toHaveLength(40);
    expect(normalizeFolderName('   ')).toBe('');
  });

  test('keeps unique tags and drops blanks', () => {
    expect(normalizeTags([' Milk ', 'milk', '', 'Bread'])).toEqual(['Milk', 'Bread']);
    expect(normalizeTags(Array.from({ length: 20 }, (_, index) => `t${index}`))).toHaveLength(12);
  });
});

describe('search', () => {
  const notes = [
    { title: 'Milk', tags: ['shop'], folderId: 'folder-1', body: 'secret bread' },
    { title: 'Diagram', tags: ['mermaid'], folderId: null, body: 'milk' },
  ];

  test('matches a title or a tag, and ignores the body', () => {
    expect(noteMatchesQuery(notes[0], 'mil')).toBe(true);
    expect(noteMatchesQuery(notes[0], 'SHOP')).toBe(true);
    expect(noteMatchesQuery(notes[1], 'bread')).toBe(false);
    expect(noteMatchesQuery(notes[1], '   ')).toBe(true);
  });

  test('can limit the match to one folder', () => {
    expect(notesInView(notes, 'folder-1', 'mil').map((note) => note.title)).toEqual(['Milk']);
    expect(notesInView(notes, null, 'm').map((note) => note.title)).toEqual(['Milk', 'Diagram']);
  });
});
