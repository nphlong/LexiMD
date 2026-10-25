// A portrait phone is about 390 points wide, and the keyboard covers half the height.
// Side by side starts when each pane can stay readable, including landscape phones.
export const SPLIT_MIN_WIDTH = 600;

export type PreviewLayout = 'split' | 'toggle';

export function previewLayout(width: number): PreviewLayout {
  return width >= SPLIT_MIN_WIDTH ? 'split' : 'toggle';
}
