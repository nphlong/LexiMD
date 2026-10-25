export type PreviewMessages = {
  diagramError: string;
  previewFailed: string;
};

function embed(value: string): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export function previewShell(messages: PreviewMessages): string {
  const diagramError = embed(messages.diagramError);
  const previewFailed = embed(messages.previewFailed);
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'self' 'unsafe-inline' 'unsafe-eval' file:; style-src 'unsafe-inline'; img-src data: blob:; font-src data:; connect-src 'none'; object-src 'none'; frame-src 'none';">
<style>
  html, body { margin: 0; background: #fff; color: #111; }
  body { font: 18px/1.45 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; padding: 16px 16px 32px; }
  h1 { font-size: 28px; line-height: 1.25; }
  h2 { font-size: 22px; line-height: 1.3; }
  pre, code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 15px; }
  pre { white-space: pre-wrap; }
  pre.leximd-diagram { margin: 16px 0; overflow-x: auto; }
  pre.leximd-diagram svg { max-width: 100%; height: auto; }
  pre.leximd-diagram-error { background: #fff4f4; color: #8a1f1f; padding: 12px; border-radius: 8px; }
  pre.leximd-diagram-error strong, pre.leximd-diagram-error span { display: block; }
  pre.leximd-diagram-error span { margin-top: 6px; font-weight: 400; }
  img { max-width: 100%; }
  a { color: #111; }
</style>
</head>
<body>
<div id="doc"></div>
<script src="mermaid.min.js"></script>
<script>
  const diagramError = ${diagramError};
  const previewFailed = ${previewFailed};
  const cache = new Map();
  let generation = 0;
  let sequence = 0;

  function showError(pre, detail) {
    pre.replaceChildren();
    const title = document.createElement('strong');
    title.textContent = diagramError;
    pre.appendChild(title);
    if (detail) {
      const line = document.createElement('span');
      line.textContent = detail;
      pre.appendChild(line);
    }
    pre.className = 'leximd-diagram-error';
  }

  async function draw(pre, source) {
    const width = document.documentElement.clientWidth || 0;
    const key = width + '\\n' + source;
    const cached = cache.get(key);
    if (cached) {
      if (cached.ok) {
        pre.className = 'leximd-diagram';
        pre.innerHTML = cached.svg;
      } else {
        showError(pre, cached.detail);
      }
      return;
    }
    const id = 'diagram' + (++sequence);
    try {
      const result = await mermaid.render(id, source);
      pre.className = 'leximd-diagram';
      pre.innerHTML = result.svg;
      cache.set(key, { ok: true, svg: result.svg });
    } catch (error) {
      const detail = error && error.message ? String(error.message).split('\\n')[0].slice(0, 280) : '';
      showError(pre, detail);
      cache.set(key, { ok: false, detail });
      const leftover = document.getElementById(id);
      if (leftover) leftover.remove();
    }
    if (cache.size > 40) cache.clear();
  }

  async function drawAll(html) {
    const current = ++generation;
    const doc = document.getElementById('doc');
    if (!doc) return;
    if (typeof mermaid === 'undefined') {
      doc.textContent = previewFailed;
      return;
    }
    doc.innerHTML = html;
    const blocks = Array.from(doc.querySelectorAll('pre.leximd-diagram'));
    for (const pre of blocks) {
      if (current !== generation) return;
      try {
        await draw(pre, pre.textContent || '');
      } catch (error) {
        showError(pre, '');
      }
      if (current !== generation) return;
    }
  }

  window.renderHtml = function (html) {
    drawAll(html).catch(function () {
      const doc = document.getElementById('doc');
      if (doc) doc.textContent = previewFailed;
    });
  };

  try {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      suppressErrorRendering: true,
      theme: 'default',
    });
  } catch (error) {
    const doc = document.getElementById('doc');
    if (doc) doc.textContent = previewFailed;
  }
</script>
</body>
</html>
`;
}
