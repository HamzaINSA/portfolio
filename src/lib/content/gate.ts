// Publish gate (decision D7). Pure functions: no Astro, no file access, easy to test.

export const MARKERS = ['[TO CONFIRM', '[SOURCE NEEDED'] as const;

// Fields that are never rendered: markers there do not block publication.
const INTERNAL_FIELDS = new Set(['openQuestions', 'internalNote']);

export interface Issue {
  file: string;
  path: string;
  message: string;
}

/** Finds placeholder markers in every field that can be rendered. */
export function scanMarkers(value: unknown, file: string, path = ''): Issue[] {
  if (typeof value === 'string') {
    return MARKERS.some((m) => value.includes(m))
      ? [{ file, path, message: 'placeholder marker' }]
      : [];
  }
  if (Array.isArray(value)) return value.flatMap((v, i) => scanMarkers(v, file, `${path}[${i}]`));
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) =>
      INTERNAL_FIELDS.has(k) ? [] : scanMarkers(v, file, path ? `${path}.${k}` : k),
    );
  }
  return [];
}

export function statusIssue(value: unknown, file: string): Issue[] {
  const status = (value as { status?: unknown } | null)?.status;
  return status === 'to_confirm' ? [{ file, path: 'status', message: 'status is to_confirm' }] : [];
}

/** An item is published only if it is verified and carries no placeholder marker. */
export function isPublishable(item: unknown): boolean {
  return statusIssue(item, '').length === 0 && scanMarkers(item, '').length === 0;
}

export function publishedOnly<T>(items: readonly T[]): T[] {
  return items.filter(isPublishable);
}

/** Public fields the site cannot go live without (strict mode only). */
export function requiredPublicIssues(profile: unknown, file: string): Issue[] {
  const p = profile as { contact?: { email?: unknown } } | null;
  const issues: Issue[] = [];
  if (!p?.contact?.email) issues.push({ file, path: 'contact.email', message: 'required public field is empty' });
  return issues;
}
