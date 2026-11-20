import { describe, expect, it } from 'vitest';
import { neighbours } from '../../src/lib/content/select';
import {
  bioParagraphs,
  toProjectCardView,
  toProjectDetailView,
  yearSpan,
} from '../../src/lib/content/views';
import type { Project } from '../../src/lib/content/types';
import {
  formatCount,
  matchesTopic,
  resolveTopic,
  topicSearch,
} from '../../src/lib/filters/topic';

const project: Project = {
  id: 'demo',
  title: 'Demo',
  startDate: '2026-06',
  endDate: '2026-08',
  current: false,
  featured: true,
  summary: 'A summary.',
  highlights: [],
  stack: ['TypeScript', 'Astro'],
  tags: ['llm', 'mobile'],
  links: [],
  status: 'verified',
  openQuestions: [],
  internalNote: 'never shown',
};

describe('yearSpan', () => {
  it('shows one year, a range across years, or nothing without a start', () => {
    expect(yearSpan('2026-06', '2026-08')).toBe('2026');
    expect(yearSpan('2025-09', '2026-02')).toBe('2025–2026');
    expect(yearSpan('2026-09', null)).toBe('2026');
    expect(yearSpan(undefined, '2026-01')).toBeNull();
  });
});

describe('toProjectCardView', () => {
  it('keeps display-safe fields only', () => {
    const view = toProjectCardView(project);
    expect(view).toEqual({
      id: 'demo',
      href: '/projects/demo',
      title: 'Demo',
      summary: 'A summary.',
      topic: 'llm',
      topics: ['llm', 'mobile'],
      context: null,
      client: null,
      year: '2026',
      current: false,
      image: null,
      stack: ['TypeScript', 'Astro'],
    });
  });
  it('shows the frame and an anonymous client, never the real name by default', () => {
    const view = toProjectCardView({
      ...project,
      context: 'ETIC INSA Technologies',
      client: {
        disclosure: 'anonymous',
        descriptor: 'a road-construction company',
        publicName: 'Hidden Corp',
      },
    });
    expect(view.context).toBe('ETIC INSA Technologies');
    expect(view.client).toBe('a road-construction company');
  });
  it('uses the first filter topic as chip when there is one', () => {
    const view = toProjectCardView(
      { ...project, tags: ['privacy', 'mobile'] },
      ['mobile'],
    );
    expect(view.topic).toBe('mobile');
  });
  it('has no chip when there is no tag', () => {
    expect(toProjectCardView({ ...project, tags: [] }).topic).toBeNull();
  });
});

describe('topic filter', () => {
  const topics = ['llm', 'mobile'];

  it('accepts only known topics from the URL', () => {
    expect(resolveTopic('llm', topics)).toBe('llm');
    expect(resolveTopic('unknown', topics)).toBeNull();
    expect(resolveTopic('', topics)).toBeNull();
    expect(resolveTopic(null, topics)).toBeNull();
    expect(resolveTopic('<script>', topics)).toBeNull();
  });

  it('shows everything for "All" and matching items otherwise', () => {
    expect(matchesTopic(['llm'], null)).toBe(true);
    expect(matchesTopic([], null)).toBe(true);
    expect(matchesTopic(['llm', 'mobile'], 'mobile')).toBe(true);
    expect(matchesTopic(['llm'], 'mobile')).toBe(false);
  });

  it('writes the topic in the query and keeps other parameters', () => {
    expect(topicSearch('', 'llm')).toBe('?topic=llm');
    expect(topicSearch('?topic=llm', null)).toBe('');
    expect(topicSearch('?a=1&topic=llm', 'mobile')).toBe('?a=1&topic=mobile');
    expect(topicSearch('?a=1&topic=llm', null)).toBe('?a=1');
  });

  it('formats the screen-reader count', () => {
    const strings = { one: '1 project shown', many: '{n} projects shown' };
    expect(formatCount(1, strings)).toBe('1 project shown');
    expect(formatCount(3, strings)).toBe('3 projects shown');
    expect(formatCount(0, strings)).toBe('0 projects shown');
  });
});

describe('toProjectDetailView', () => {
  it('keeps only filled card cells and story blocks, in mockup order', () => {
    const view = toProjectDetailView({
      ...project,
      card: {
        task: 'T',
        data: null,
        method: '  ',
        metric: 'M',
        result: null,
        myRole: 'R',
      },
      retrospective: { worked: null, failed: 'F', next: null },
    });
    expect(view.facts).toEqual([
      { key: 'task', value: 'T' },
      { key: 'metric', value: 'M' },
      { key: 'myRole', value: 'R' },
    ]);
    expect(view.story).toEqual([{ key: 'failed', text: 'F' }]);
  });
  it('has no blocks when card and retrospective are missing', () => {
    const view = toProjectDetailView(project);
    expect(view.facts).toEqual([]);
    expect(view.story).toEqual([]);
    expect(view).not.toHaveProperty('internalNote');
    expect(view).not.toHaveProperty('openQuestions');
  });
});

describe('neighbours', () => {
  const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
  it('returns the items around an id, null at the ends', () => {
    expect(neighbours(items, 'b')).toEqual({
      previous: { id: 'a' },
      next: { id: 'c' },
    });
    expect(neighbours(items, 'a')).toEqual({
      previous: null,
      next: { id: 'b' },
    });
    expect(neighbours(items, 'c')).toEqual({
      previous: { id: 'b' },
      next: null,
    });
    expect(neighbours(items, 'x')).toEqual({ previous: null, next: null });
  });
});

describe('bioParagraphs', () => {
  it('splits on blank lines and drops empty parts', () => {
    expect(bioParagraphs('One.\n\nTwo.\n  \nThree.')).toEqual([
      'One.',
      'Two.',
      'Three.',
    ]);
    expect(bioParagraphs(null)).toEqual([]);
    expect(bioParagraphs('  ')).toEqual([]);
  });
});
