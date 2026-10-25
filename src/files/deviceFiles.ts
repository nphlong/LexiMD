import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { isMarkdownFileName, markdownFileName } from './markdownFile';

export class MarkdownFileError extends Error {
  readonly code: 'type' | 'read' | 'share' | 'unavailable';

  constructor(code: MarkdownFileError['code']) {
    super(code);
    this.name = 'MarkdownFileError';
    this.code = code;
  }
}

export async function importMarkdownFile(): Promise<string | null> {
  const picked = await File.pickFileAsync({ mimeTypes: ['*/*'] });
  if (picked.canceled || !picked.result) {
    return null;
  }
  const file = picked.result;
  if (!isMarkdownFileName(file.name ?? '')) {
    throw new MarkdownFileError('type');
  }
  try {
    return await file.text();
  } catch {
    throw new MarkdownFileError('read');
  }
}

function dismissed(error: unknown): boolean {
  const message = error instanceof Error ? error.message.toLowerCase() : '';
  return message.includes('cancel') || message.includes('dismiss');
}

export async function shareMarkdownFile(title: string, body: string, untitled: string): Promise<void> {
  if (!(await Sharing.isAvailableAsync())) {
    throw new MarkdownFileError('unavailable');
  }
  const file = new File(Paths.cache, markdownFileName(title, untitled));
  if (file.exists) {
    file.delete();
  }
  await file.write(body);
  try {
    await Sharing.shareAsync(file.uri);
  } catch (error) {
    if (dismissed(error)) {
      return;
    }
    throw new MarkdownFileError('share');
  }
}
