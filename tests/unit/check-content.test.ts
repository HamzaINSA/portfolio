import { describe, expect, it } from 'vitest';
import { scan, statusIssue } from '../../scripts/check-content';

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
