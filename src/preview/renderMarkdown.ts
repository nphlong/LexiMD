import MarkdownIt from 'markdown-it';

const markdown = new MarkdownIt({
  html: false,
  linkify: false,
  typographer: false,
});

const renderFence = markdown.renderer.rules.fence;
markdown.renderer.rules.fence = (tokens, idx, options, env, self) => {
  const token = tokens[idx];
  const info = token.info.trim();
  const lang = info.length === 0 ? '' : info.split(/\s+/, 1)[0].toLowerCase();
  if (lang === 'mermaid') {
    return `<pre class="leximd-diagram">${markdown.utils.escapeHtml(token.content)}</pre>\n`;
  }
  if (renderFence) {
    return renderFence(tokens, idx, options, env, self);
  }
  return self.renderToken(tokens, idx, options);
};

export function renderMarkdown(source: string): string {
  return markdown.render(source);
}
