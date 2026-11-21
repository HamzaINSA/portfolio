import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { knowledgeEntrySchema } from '../../src/lib/content/schemas';
import {
  keywordTokens,
  MAX_QUESTION_LENGTH,
  retrieve,
  type RetrievalEntry,
} from '../../src/lib/retrieval/match';
import {
  contentTokens,
  normalise,
  stem,
  STOP_WORDS,
} from '../../src/lib/retrieval/normalise';
import evalSet from '../chat/eval-set.json';
import { toRetrievalEntries } from '../../src/lib/content/views';

const root = join(__dirname, '..', '..');
const kbDir = join(root, 'content', 'knowledge-base');
const all = readdirSync(kbDir)
  .filter((f) => f.endsWith('.json'))
  .map((f) =>
    knowledgeEntrySchema.parse(
      JSON.parse(readFileSync(join(kbDir, f), 'utf8')),
    ),
  );
// Production ships verified entries only, so the evaluation runs on those.
const entries: RetrievalEntry[] = all.filter((e) => e.status === 'verified');

describe('normalise and stem', () => {
  it('lowercases, strips accents and punctuation, keeps c++ and c#', () => {
    expect(normalise("J'ai PiGé, en C++ et C# !")).toBe(
      'j ai pige en c++ et c#',
    );
  });
  it('stems plurals and long -ing forms only', () => {
    expect(stem('skills')).toBe('skill');
    expect(stem('class')).toBe('class');
    expect(stem('learning')).toBe('learn');
    expect(stem('coding')).toBe('coding');
  });
  it('drops stop words before stemming', () => {
    expect(contentTokens('What is his stack?')).toEqual(['stack']);
  });
});

describe('knowledge base', () => {
  it('has no keyword that is a stop word', () => {
    for (const entry of all) {
      for (const keyword of keywordTokens(entry)) {
        expect(STOP_WORDS.has(keyword), `${entry.id}: ${keyword}`).toBe(false);
      }
    }
  });
  it('has unique ids and file names that match the source', () => {
    const ids = all.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const entry of all) expect(entry.source).toBe(`${entry.id}.json`);
  });
  it('only relates to existing entries', () => {
    const ids = new Set(all.map((e) => e.id));
    for (const entry of all) {
      for (const id of entry.related)
        expect(ids.has(id), `${entry.id} -> ${id}`).toBe(true);
    }
  });
  it('never contains a phone number', () => {
    for (const entry of all)
      expect(entry.answer).not.toMatch(/\+?\d[\d .-]{8,}\d/);
  });
});

describe('evaluation set', () => {
  it("answers every entry's example questions with that entry", () => {
    for (const entry of entries) {
      for (const q of entry.exampleQuestions) {
        expect(retrieve(q, entries)?.entry.id, q).toBe(entry.id);
      }
    }
  });

  it('answers each suggestion chip and Home teaser label with its own entry', () => {
    const suggested = entries.filter((e) => e.suggested);
    expect(suggested.length).toBeGreaterThan(0);
    expect(suggested.length).toBeLessThanOrEqual(5);
    for (const entry of suggested) {
      const label = entry.suggestedLabel ?? entry.title;
      expect(retrieve(label, entries)?.entry.id, label).toBe(entry.id);
    }
  });

  it.each(evalSet.inScope)('in scope: $q', ({ q, expected }) => {
    expect(retrieve(q, entries)?.entry.id).toBe(expected);
  });

  it.each(evalSet.ambiguous)('ambiguous: $q', ({ q, expected, didYouMean }) => {
    const result = retrieve(q, entries);
    expect(result?.entry.id).toBe(expected);
    expect(result?.ambiguous?.id).toBe(didYouMean);
  });

  it.each(evalSet.outOfScope)('out of scope: "%s"', (q) => {
    expect(retrieve(q, entries)).toBeNull();
  });

  it.each(evalSet.hostile)('hostile: "%s"', (q) => {
    expect(retrieve(q, entries)).toBeNull();
  });

  it('cuts very long input to the console limit', () => {
    const noise = 'zz '.repeat(MAX_QUESTION_LENGTH);
    expect(retrieve(`${noise} email`, entries)).toBeNull();
    expect(retrieve('x'.repeat(5000), entries)).toBeNull();
  });

  it('is deterministic', () => {
    const q = 'languages';
    expect(retrieve(q, entries)).toEqual(retrieve(q, entries));
  });
});

describe('toRetrievalEntries', () => {
  it('keeps verified entries only and drops internal fields', () => {
    const shipped = toRetrievalEntries(all);
    expect(shipped.length).toBe(entries.length);
    for (const entry of shipped) {
      expect(entry).not.toHaveProperty('openQuestions');
      expect(entry).not.toHaveProperty('status');
      expect(entry).not.toHaveProperty('sources');
    }
  });
});
