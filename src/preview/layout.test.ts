import { previewLayout, SPLIT_MIN_WIDTH } from './layout';
import { PREVIEW_UPDATE_MS } from './timing';

describe('previewLayout', () => {
  test('uses a toggle on a portrait phone', () => {
    expect(previewLayout(390)).toBe('toggle');
    expect(previewLayout(SPLIT_MIN_WIDTH - 1)).toBe('toggle');
  });

  test('uses side by side on a landscape phone or a tablet', () => {
    expect(previewLayout(SPLIT_MIN_WIDTH)).toBe('split');
    expect(previewLayout(800)).toBe('split');
  });
});

describe('preview timing', () => {
  test('schedules an update inside a fraction of a second', () => {
    expect(PREVIEW_UPDATE_MS).toBeLessThanOrEqual(300);
  });
});
