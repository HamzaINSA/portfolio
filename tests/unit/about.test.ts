import { describe, expect, it } from 'vitest';
import { buildMailto } from '../../src/lib/contact/mailto';
import { capabilityGroups, nextRunSteps } from '../../src/lib/content/views';
import type { Experience, Skills } from '../../src/lib/content/types';

const exp = (over: Partial<Experience>): Experience => ({
  id: 'x',
  type: 'internship',
  title: 't',
  organization: { name: 'o' },
  current: false,
  checkpoint: false,
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

describe('nextRunSteps', () => {
  it('lists published plans before career goals and skips unverified ones', () => {
    const steps = nextRunSteps([
      exp({ type: 'career-goal', summary: 'PhD' }),
      exp({ type: 'academic-plan', summary: 'KTH', status: 'to_confirm' }),
      exp({ type: 'academic-plan', summary: 'Exchange' }),
      exp({ type: 'internship', summary: 'Job' }),
    ]);
    expect(steps).toEqual(['Exchange', 'PhD']);
  });
});

describe('capabilityGroups', () => {
  const skills: Skills = {
    groups: [
      { id: 'languages', label: 'Languages', items: ['Python'] },
      { id: 'empty', label: 'Empty', items: [] },
    ],
    spoken: [{ language: 'French', level: 'Native' }],
    status: 'verified',
    openQuestions: [],
  };
  it('keeps non-empty groups and adds spoken languages with their level', () => {
    expect(capabilityGroups(skills, 'Spoken')).toEqual([
      { label: 'Languages', items: ['Python'] },
      { label: 'Spoken', items: ['French (Native)'] },
    ]);
  });
  it('has no spoken column without spoken languages', () => {
    expect(capabilityGroups({ ...skills, spoken: [] }, 'Spoken')).toHaveLength(
      1,
    );
  });
});

describe('buildMailto', () => {
  const subject = (name: string) => (name ? `Contact from ${name}` : 'Contact');
  it('prefills an encoded subject and a signed body', () => {
    const url = buildMailto(
      'me@example.org',
      {
        name: ' Ada ',
        email: 'ada@example.org',
        message: 'Hello & bye?\nLine 2',
      },
      subject,
    );
    expect(url.startsWith('mailto:me@example.org?subject=')).toBe(true);
    const params = new URLSearchParams(url.split('?')[1]);
    expect(params.get('subject')).toBe('Contact from Ada');
    expect(params.get('body')).toBe(
      'Hello & bye?\nLine 2\n\n-- Ada <ada@example.org>',
    );
  });
  it('works with empty fields', () => {
    const params = new URLSearchParams(
      buildMailto(
        'me@example.org',
        { name: '', email: '', message: '' },
        subject,
      ).split('?')[1],
    );
    expect(params.get('subject')).toBe('Contact');
    expect(params.get('body')).toBe('');
  });
});
