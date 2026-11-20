import { describe, expect, it } from 'vitest';
import { lossCurve } from '../../src/lib/charts/loss-curve';

describe('lossCurve', () => {
  it('has one marker per checkpoint', () => {
    for (const n of [1, 2, 3, 4, 7])
      expect(lossCurve(n, 1280, 200, 10).points).toHaveLength(n);
  });
  it('returns nothing for zero checkpoints', () => {
    expect(lossCurve(0, 1280, 200, 10)).toEqual({ points: [], path: '' });
  });
  it('spans the width and falls monotonically', () => {
    const { points } = lossCurve(4, 1280, 200, 10);
    expect(points[0]?.x).toBe(10);
    expect(points[3]?.x).toBe(1270);
    const ys = points.map((p) => p.y);
    expect(ys).toEqual([...ys].sort((a, b) => a - b));
    expect(Math.min(...ys)).toBeGreaterThanOrEqual(10);
    expect(Math.max(...ys)).toBeLessThanOrEqual(190);
  });
  it('is deterministic and starts the path on the first marker', () => {
    const a = lossCurve(3, 350, 90, 6);
    expect(a).toEqual(lossCurve(3, 350, 90, 6));
    expect(a.path.startsWith(`M${a.points[0]?.x} ${a.points[0]?.y}`)).toBe(
      true,
    );
  });
  it('draws a single marker without a segment', () => {
    expect(lossCurve(1, 100, 50, 5).path).toBe('M50 5');
  });
});
