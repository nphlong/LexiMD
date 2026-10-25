const HEADING = /^#{1,6}(?:\s+|$)/;
const MAX_TITLE = 80;

export function titleFromBody(body: string, untitled: string): string {
  const line = body
    .split(/\r?\n/)
    .map((part) => part.trim())
    .find((part) => part.length > 0);

  if (!line) {
    return untitled;
  }

  const withoutHeading = line.replace(HEADING, '').trim();
  if (!withoutHeading) {
    return untitled;
  }

  return withoutHeading.slice(0, MAX_TITLE);
}
