import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { isPublishable } from '../../src/lib/content/gate';
import { partnersSchema } from '../../src/lib/content/schemas';

const partners = partnersSchema.parse(
  JSON.parse(
    readFileSync(join(process.cwd(), 'content/partners.json'), 'utf8'),
  ),
);

describe('content/partners.json', () => {
  it('is publishable', () => {
    expect(isPublishable(partners)).toBe(true);
  });

  it('points to logo files that exist in public/', () => {
    for (const p of partners.partners) {
      expect(existsSync(join(process.cwd(), 'public', p.logo.src)), p.id).toBe(
        true,
      );
    }
  });

  it('has unique ids and names', () => {
    const ids = partners.partners.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('only lists organisations, not projects', () => {
    expect(partners.partners.map((p) => p.id)).not.toContain('jai-pige');
  });
});
