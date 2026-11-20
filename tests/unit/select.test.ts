import { describe, expect, it } from 'vitest';
import { displayClient } from '../../src/lib/content/anonymise';
import {
  checkpoints,
  currentEducation,
  entriesById,
  featuredProjects,
} from '../../src/lib/content/select';
import type {
  EducationItem,
  Experience,
  KnowledgeEntry,
  Project,
} from '../../src/lib/content/types';

const exp = (over: Partial<Experience>): Experience => ({
  id: 'x',
  type: 'internship',
  title: 't',
  organization: { name: 'o' },
  current: false,
  checkpoint: true,
  summary: 's',
  highlights: [],
  learned: [],
  stack: [],
  tags: [],
  links: [],
  status: 'verified',
  openQuestions: [],
  ...over,
});

const proj = (over: Partial<Project>): Project => ({
  id: 'p',
  title: 't',
  current: false,
  featured: true,
  summary: 's',
  highlights: [],
  stack: [],
  tags: [],
  links: [],
  status: 'verified',
  openQuestions: [],
  ...over,
});

describe('checkpoints', () => {
  it('keeps verified checkpoints in date order', () => {
    const result = checkpoints([
      exp({ id: 'b', startDate: '2026-06' }),
      exp({ id: 'a', startDate: '2026-05' }),
      exp({ id: 'c', startDate: '2025', checkpoint: false }),
      exp({ id: 'd', startDate: '2024', status: 'to_confirm' }),
    ]);
    expect(result.map((e) => e.id)).toEqual(['a', 'b']);
  });
  it('puts undated items last and breaks ties by id', () => {
    const result = checkpoints([
      exp({ id: 'z' }),
      exp({ id: 'a', startDate: '2026' }),
      exp({ id: 'b' }),
    ]);
    expect(result.map((e) => e.id)).toEqual(['a', 'b', 'z']);
  });
});

describe('featuredProjects', () => {
  it('keeps featured and verified projects, newest first', () => {
    const result = featuredProjects([
      proj({ id: 'old', startDate: '2025' }),
      proj({ id: 'new', startDate: '2026-09' }),
      proj({ id: 'hidden', featured: false }),
      proj({ id: 'draft', status: 'to_confirm' }),
    ]);
    expect(result.map((p) => p.id)).toEqual(['new', 'old']);
  });
});

describe('currentEducation', () => {
  const edu = (over: Partial<EducationItem>): EducationItem => ({
    id: 'e',
    institution: 'i',
    program: 'p',
    startYear: 2025,
    endYear: 2028,
    location: 'l',
    notes: [],
    coursework: [],
    current: true,
    status: 'verified',
    openQuestions: [],
    ...over,
  });
  it('returns the verified current item', () => {
    expect(
      currentEducation([edu({ id: 'a', current: false }), edu({ id: 'b' })])
        ?.id,
    ).toBe('b');
  });
  it('returns undefined when nothing is current', () => {
    expect(currentEducation([edu({ current: false })])).toBeUndefined();
  });
});

describe('entriesById', () => {
  const entry = (
    id: string,
    status: 'verified' | 'to_confirm',
  ): KnowledgeEntry => ({
    id,
    title: id,
    source: `${id}.json`,
    keywords: ['a', 'b', 'c'],
    phrases: [],
    exampleQuestions: ['1', '2', '3'],
    answer: 'a',
    links: [],
    sources: [],
    related: [],
    priority: 0,
    suggested: false,
    status,
    openQuestions: [],
  });
  it('keeps the requested order and skips unverified or unknown ids', () => {
    const entries = [
      entry('a', 'verified'),
      entry('b', 'to_confirm'),
      entry('c', 'verified'),
    ];
    expect(
      entriesById(entries, ['c', 'b', 'zzz', 'a']).map((e) => e.id),
    ).toEqual(['c', 'a']);
  });
});

describe('displayClient', () => {
  it('is null for items without client', () => {
    expect(displayClient({})).toBeNull();
  });
  it('shows the neutral descriptor when anonymous', () => {
    expect(
      displayClient({
        client: {
          disclosure: 'anonymous',
          descriptor: 'a consulting firm',
          publicName: 'Secret Ltd',
        },
      }),
    ).toBe('a consulting firm');
  });
  it('shows the public name only when named and set', () => {
    expect(
      displayClient({
        client: { disclosure: 'named', descriptor: 'd', publicName: 'Acme' },
      }),
    ).toBe('Acme');
    expect(
      displayClient({
        client: { disclosure: 'named', descriptor: 'd', publicName: null },
      }),
    ).toBe('d');
  });
});
