import { previewShell } from './previewShell';

// The bundled library is a generated file on disk. Node's fs is enough to read it.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const readFile = (require('fs') as { readFileSync(path: string, encoding: string): string })
  .readFileSync;

const messages = {
  diagramError: 'This diagram has a syntax error.',
  previewFailed: 'The preview could not open.',
};

describe('previewShell', () => {
  test('loads mermaid from a local file and blocks network requests', () => {
    const html = previewShell(messages);

    expect(html).toContain('src="mermaid.min.js"');
    expect(html).toContain("connect-src 'none'");
    expect(html).toContain('suppressErrorRendering: true');
    expect(html).toContain(messages.diagramError);
    expect(html).toContain('window.renderHtml');
    expect(html).not.toMatch(/https?:\/\//);
    expect(html).not.toContain('cdn.');
  });
});

describe('bundled mermaid', () => {
  test('is the local library, with no package CDN', () => {
    const library = readFile('assets/preview/mermaid.min.mermaidjs', 'utf8');
    expect(library).toContain('globalThis["mermaid"]');
    expect(library).not.toContain('cdn.jsdelivr.net');
    expect(library).not.toContain('unpkg.com');
    expect(library).not.toContain('mermaid.ink');
  });
});
