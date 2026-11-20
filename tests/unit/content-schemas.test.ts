import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { ZodType } from 'astro/zod';
import {
  educationItemSchema,
  experienceSchema,
  knowledgeEntrySchema,
  profileSchema,
  projectSchema,
  skillsSchema,
} from '../../src/lib/content/schemas';

const read = (path: string): unknown => JSON.parse(readFileSync(path, 'utf8'));
const jsonIn = (dir: string): string[] =>
  readdirSync(dir)
    .filter((f) => f.endsWith('.json') && !f.startsWith('_'))
    .map((f) => join(dir, f));

function expectAllValid(files: string[], schema: ZodType): void {
  expect(files.length).toBeGreaterThan(0);
  for (const file of files) {
    const result = schema.safeParse(read(file));
    expect(
      result.success,
      `${file}: ${result.success ? '' : result.error.message}`,
    ).toBe(true);
  }
}

describe('content files match their schemas', () => {
  it('experiences', () =>
    expectAllValid(jsonIn('content/experiences'), experienceSchema));
  it('experience template', () => {
    expect(
      experienceSchema.safeParse(read('content/experiences/_template.json'))
        .success,
    ).toBe(false);
  });
  it('projects', () =>
    expectAllValid(jsonIn('content/projects'), projectSchema));
  it('knowledge base', () =>
    expectAllValid(jsonIn('content/knowledge-base'), knowledgeEntrySchema));
  it('profile', () => expectAllValid(['content/profile.json'], profileSchema));
  it('skills', () => expectAllValid(['content/skills.json'], skillsSchema));
  it('education', () => {
    const items = read('content/education.json') as unknown[];
    for (const item of items)
      expect(educationItemSchema.safeParse(item).success).toBe(true);
  });
});

describe('schemas reject bad data', () => {
  const base = {
    id: 'a-b',
    type: 'internship',
    title: 't',
    organization: { name: 'o' },
    summary: 's',
    status: 'verified',
  };
  it('accepts a minimal experience and applies defaults', () => {
    const parsed = experienceSchema.parse(base);
    expect(parsed.highlights).toEqual([]);
    expect(parsed.checkpoint).toBe(false);
  });
  it('rejects a non kebab-case id', () => {
    expect(
      experienceSchema.safeParse({ ...base, id: 'Not Kebab' }).success,
    ).toBe(false);
  });
  it('rejects a bad date', () => {
    expect(
      experienceSchema.safeParse({ ...base, startDate: '2026/05' }).success,
    ).toBe(false);
  });
  it('rejects an unknown field', () => {
    expect(experienceSchema.safeParse({ ...base, surprise: 1 }).success).toBe(
      false,
    );
  });
  it('rejects an unknown status', () => {
    expect(
      experienceSchema.safeParse({ ...base, status: 'maybe' }).success,
    ).toBe(false);
  });
  it('rejects a knowledge entry with accents in keywords', () => {
    const entry = {
      id: 'x',
      title: 't',
      source: 'x.json',
      keywords: ['a', 'b', 'é'],
      exampleQuestions: ['q1', 'q2', 'q3'],
      answer: 'a',
      status: 'verified',
    };
    expect(knowledgeEntrySchema.safeParse(entry).success).toBe(false);
  });
});
