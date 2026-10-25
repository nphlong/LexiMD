import { isMarkdownFileName, markdownFileName } from './markdownFile';

describe('markdown files', () => {
  test('builds a safe file name from the title', () => {
    expect(markdownFileName('Milk: list', 'Untitled')).toBe('Milk list.md');
    expect(markdownFileName('   ', 'Untitled')).toBe('Untitled.md');
    expect(markdownFileName('a/b', 'Untitled')).toBe('ab.md');
  });

  test('accepts a markdown name and a picker result with no name', () => {
    expect(isMarkdownFileName('notes.md')).toBe(true);
    expect(isMarkdownFileName('Notes.MARKDOWN')).toBe(true);
    expect(isMarkdownFileName('')).toBe(true);
    expect(isMarkdownFileName('photo.png')).toBe(false);
  });
});
