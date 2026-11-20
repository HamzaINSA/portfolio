import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

export const MARKERS = ['[TO CONFIRM', '[SOURCE NEEDED'] as const;
// Fields that are never rendered: markers there do not block publication.
const INTERNAL_FIELDS = new Set(['openQuestions', 'internalNote']);

export interface Issue {
  file: string;
  path: string;
  message: string;
}

export function scan(value: unknown, file: string, path = ''): Issue[] {
  if (typeof value === 'string') {
    return MARKERS.some((m) => value.includes(m))
      ? [{ file, path, message: 'placeholder marker' }]
      : [];
  }
  if (Array.isArray(value))
    return value.flatMap((v, i) => scan(v, file, `${path}[${i}]`));
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) =>
      INTERNAL_FIELDS.has(k) ? [] : scan(v, file, path ? `${path}.${k}` : k),
    );
  }
  return [];
}

export function statusIssue(value: unknown, file: string): Issue[] {
  const status = (value as { status?: unknown } | null)?.status;
  return status === 'to_confirm'
    ? [{ file, path: 'status', message: 'status is to_confirm' }]
    : [];
}

function jsonFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return name === 'schema' ? [] : jsonFiles(p);
    return name.endsWith('.json') && !name.startsWith('_') ? [p] : [];
  });
}

// Full schema validation arrives in M1 (Zod). M0 only covers the publish gate.
function main(): void {
  const strict = process.argv.includes('--strict');
  const issues = jsonFiles('content').flatMap((file) => {
    const data: unknown = JSON.parse(readFileSync(file, 'utf8'));
    return [...statusIssue(data, file), ...scan(data, file)];
  });
  for (const i of issues)
    console.log(
      `${strict ? 'error' : 'warning'}: ${i.file} ${i.path}: ${i.message}`,
    );
  console.log(
    `${issues.length} issue(s)${strict ? '' : ' (non-strict: not failing)'}`,
  );
  if (strict && issues.length > 0) process.exit(1);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
