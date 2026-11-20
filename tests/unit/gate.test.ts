import { describe, expect, it } from 'vitest';
import { scanMarkers as scan, statusIssue } from '../../src/lib/content/gate';

describe('publish gate', () => {
  it('flags markers in published fields', () => {
    expect(scan({ summary: 'x [TO CONFIRM: y]' }, 'f.json')).toHaveLength(1);
  });
  it('ignores markers in internal fields', () => {
    expect(
      scan(
        { openQuestions: ['[SOURCE NEEDED]'], internalNote: '[TO CONFIRM]' },
        'f.json',
      ),
    ).toEqual([]);
  });
  it('flags to_confirm status', () => {
    expect(statusIssue({ status: 'to_confirm' }, 'f.json')).toHaveLength(1);
    expect(statusIssue({ status: 'verified' }, 'f.json')).toEqual([]);
  });
});

import {
  isPublishable,
  publishedOnly,
  requiredPublicIssues,
} from '../../src/lib/content/gate';

describe('isPublishable', () => {
  it('accepts a verified item without marker', () => {
    expect(isPublishable({ status: 'verified', summary: 'ok' })).toBe(true);
  });
  it('rejects to_confirm and marked items', () => {
    expect(isPublishable({ status: 'to_confirm', summary: 'ok' })).toBe(false);
    expect(
      isPublishable({ status: 'verified', summary: 'x [SOURCE NEEDED]' }),
    ).toBe(false);
  });
  it('filters a list', () => {
    const items = [{ status: 'verified' }, { status: 'to_confirm' }];
    expect(publishedOnly(items)).toEqual([{ status: 'verified' }]);
  });
});

describe('requiredPublicIssues', () => {
  it('reports an empty email', () => {
    const issues = requiredPublicIssues(
      { contact: { email: null } },
      'profile.json',
    );
    expect(issues.map((i) => i.path)).toEqual(['contact.email']);
  });
  it('passes when both are set', () => {
    expect(
      requiredPublicIssues({ contact: { email: 'a@b.c' } }, 'profile.json'),
    ).toEqual([]);
  });
});
