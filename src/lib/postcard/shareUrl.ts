/**
 * Encode/decode shareable postcard URLs.
 *
 * URL format: ?postcard=<base64 of "Name.US,FR,JP">
 * The "." separator is safe because names are alphanumeric+spaces
 * and country codes are alpha-2.
 */

export function encodePostcardUrl(name: string, beenTo: string[]): string {
  const payload = `${name}.${beenTo.join(',')}`;
  const encoded = btoa(payload);
  return `${window.location.origin}${window.location.pathname}?postcard=${encoded}`;
}

export function decodePostcardUrl(
  url: string,
): { name: string; beenTo: string[] } | null {
  try {
    const parsed = new URL(url);
    const param = parsed.searchParams.get('postcard');
    if (!param) return null;

    const decoded = atob(param);
    const dotIndex = decoded.indexOf('.');
    if (dotIndex === -1) return null;

    const name = decoded.slice(0, dotIndex);
    const codesStr = decoded.slice(dotIndex + 1);

    if (!name) return null;

    const codes = codesStr
      .split(',')
      .map((c) => c.trim())
      .filter((c) => /^[A-Z]{2}$/i.test(c))
      .map((c) => c.toUpperCase());

    if (codes.length === 0) return null;

    return { name, beenTo: codes };
  } catch {
    return null;
  }
}
