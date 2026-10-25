import { renderMarkdown } from './renderMarkdown';

describe('renderMarkdown', () => {
  test('renders a heading and a list', () => {
    const html = renderMarkdown('# Milk\n\n- bread\n- eggs\n');
    expect(html).toContain('<h1>Milk</h1>');
    expect(html).toContain('<li>bread</li>');
    expect(html).toContain('<li>eggs</li>');
  });

  test('keeps a mermaid fence as text for the preview page', () => {
    const html = renderMarkdown('```mermaid\ngraph TD\n  A --> B\n```\n');
    expect(html).toContain('<pre class="leximd-diagram">');
    expect(html).toContain('A --&gt; B');
    expect(html).not.toContain('<script');
  });

  test('escapes raw html', () => {
    const html = renderMarkdown('<script>alert(1)</script>\n');
    expect(html).not.toContain('<script');
    expect(html).toContain('&lt;script&gt;');
  });
});
