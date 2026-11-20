import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import {
  requiredPublicIssues,
  scanMarkers,
  statusIssue,
  type Issue,
} from '../src/lib/content/gate';

function jsonFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return name === 'schema' ? [] : jsonFiles(p);
    return name.endsWith('.json') && !name.startsWith('_') ? [p] : [];
  });
}

// Schema validation runs through the Astro collections (build) and the unit tests.
// This script covers the publish gate. Strict mode: --strict flag or CONTENT_STRICT=1.
function main(): void {
  const strict =
    process.argv.includes('--strict') || process.env['CONTENT_STRICT'] === '1';
  const issues: Issue[] = jsonFiles('content').flatMap((file) => {
    const data: unknown = JSON.parse(readFileSync(file, 'utf8'));
    const own = [...statusIssue(data, file), ...scanMarkers(data, file)];
    return file.endsWith('profile.json')
      ? [...own, ...requiredPublicIssues(data, file)]
      : own;
  });
  for (const i of issues) {
    console.log(
      `${strict ? 'error' : 'warning'}: ${i.file} ${i.path}: ${i.message}`,
    );
  }
  console.log(
    `${issues.length} issue(s)${strict ? '' : ' (non-strict: not failing)'}`,
  );
  if (strict && issues.length > 0) process.exit(1);
}

main();
