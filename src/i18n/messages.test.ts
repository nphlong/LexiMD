import { en, CORE_FUNCTION } from './en';
import { vi } from './vi';

const shared = new Set(['appName', 'english', 'vietnamese']);

describe('interface languages', () => {
  test('keeps the English core sentence and translates every other string', () => {
    expect(CORE_FUNCTION).toBe(
      'Turn a rough note into clean markdown and see it rendered, diagrams included.',
    );
    expect(Object.keys(vi).sort()).toEqual(Object.keys(en).sort());
    for (const key of Object.keys(en) as (keyof typeof en)[]) {
      expect(vi[key].trim().length).toBeGreaterThan(0);
      if (!shared.has(key)) {
        expect(vi[key]).not.toBe(en[key]);
      }
    }
  });
});
