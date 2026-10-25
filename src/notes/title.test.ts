import { titleFromBody } from './title';

const untitled = 'Untitled';

describe('titleFromBody', () => {
  test('uses the first non-empty line', () => {
    expect(titleFromBody('\n\nShopping\nmilk', untitled)).toBe('Shopping');
  });

  test('drops a leading markdown heading mark', () => {
    expect(titleFromBody('# Milk\nbread', untitled)).toBe('Milk');
    expect(titleFromBody('###  Diagram', untitled)).toBe('Diagram');
  });

  test('uses the untitled label when the body is blank', () => {
    expect(titleFromBody('', untitled)).toBe(untitled);
    expect(titleFromBody('   \n\t', untitled)).toBe(untitled);
    expect(titleFromBody('#   ', untitled)).toBe(untitled);
  });

  test('keeps the title short', () => {
    expect(titleFromBody('a'.repeat(120), untitled)).toHaveLength(80);
  });
});
