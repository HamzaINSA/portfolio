import { describe, expect, it } from 'vitest';
import { formatMonth, formatRange } from '../../src/lib/format/dates';

describe('formatMonth', () => {
  it('formats year and month', () =>
    expect(formatMonth('2027-05')).toBe('May 2027'));
  it('keeps a bare year', () => expect(formatMonth('2027')).toBe('2027'));
  it('throws on invalid input', () => {
    expect(() => formatMonth('2027-13')).toThrow();
    expect(() => formatMonth('May 2027')).toThrow();
  });
});

describe('formatRange', () => {
  it('formats a closed range', () => {
    expect(formatRange('2026-06', '2026-09')).toBe(
      'June 2026 – September 2026',
    );
  });
  it('uses "now" for an open end', () =>
    expect(formatRange('2026-05', null)).toBe('May 2026 – now'));
  it('handles missing dates', () => {
    expect(formatRange(null, null)).toBe('');
    expect(formatRange(undefined, '2026')).toBe('2026');
  });
});
