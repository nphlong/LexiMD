export function markdownFileName(title: string, untitled: string): string {
  const cleaned = (title.trim() || untitled)
    .replace(/[\\/:*?"<>|\u0000-\u001f]/g, '')
    .trim()
    .slice(0, 80);
  return `${cleaned || 'note'}.md`;
}

export function isMarkdownFileName(name: string): boolean {
  if (!name.trim()) {
    return true;
  }
  return /\.(md|markdown)$/i.test(name.trim());
}
