import { describe, expect, it } from 'vitest';
import { buildMailto } from '../../src/lib/contact/mailto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { releasesSchema } from '../../src/lib/content/schemas';
import {
  capabilityGroups,
  releaseNotes,
  versionNumber,
} from '../../src/lib/content/views';
import type { Releases, Skills } from '../../src/lib/content/types';

const releases = (over: Partial<Releases>): Releases => ({
  objective: null,
  objectiveComment: null,
  releases: [
    {
      version: 'v1',
      period: '2023',
      state: 'past',
      title: 'A',
      items: [{ tag: 'init', text: 'a' }],
      learned: [],
    },
    {
      version: 'v2',
      period: '2024',
      state: 'past',
      title: 'Empty',
      items: [],
      learned: [],
    },
    {
      version: 'v3',
      period: '2025',
      state: 'current',
      title: 'C',
      items: [{ tag: 'added', text: 'c' }],
      learned: [],
    },
  ],
  status: 'verified',
  openQuestions: [],
  ...over,
});

describe('releaseNotes', () => {
  it('lists releases newest first and skips empty ones', () => {
    expect(releaseNotes(releases({})).map((r) => r.version)).toEqual([
      'v3',
      'v1',
    ]);
  });
  it('shows nothing when the file is not verified', () => {
    expect(releaseNotes(releases({ status: 'to_confirm' }))).toEqual([]);
  });
  it('does not change the order of the source data', () => {
    const data = releases({});
    releaseNotes(data);
    expect(data.releases[0]?.version).toBe('v1');
  });
  it('validates content/releases.json, with exactly one current release', () => {
    const file = JSON.parse(
      readFileSync(
        join(__dirname, '..', '..', 'content', 'releases.json'),
        'utf8',
      ),
    ) as unknown;
    const data = releasesSchema.parse(file);
    expect(data.releases.filter((r) => r.state === 'current')).toHaveLength(1);
  });
});

describe('versionNumber', () => {
  it('prints the model version as a tool would', () => {
    expect(versionNumber('v4')).toBe('4.0');
    expect(versionNumber('v4.1')).toBe('4.1');
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
