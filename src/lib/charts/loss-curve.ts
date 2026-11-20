export interface Point {
  x: number;
  y: number;
}

export interface LossCurve {
  points: Point[];
  path: string;
}

const round = (n: number): number => Math.round(n * 100) / 100;

/**
 * Schematic "loss curve" through `count` markers (one per checkpoint). It is a drawing, not data:
 * the loss falls quickly and flattens. Deterministic: same inputs, same SVG.
 */
export function lossCurve(
  count: number,
  width: number,
  height: number,
  pad: number,
): LossCurve {
  if (count <= 0) return { points: [], path: '' };
  const top = pad;
  const bottom = height - pad;
  const decay = 2.2;
  const norm = 1 - Math.exp(-decay);
  const points: Point[] = Array.from({ length: count }, (_, i) => {
    const t = count === 1 ? 0 : i / (count - 1);
    const x = count === 1 ? width / 2 : pad + t * (width - 2 * pad);
    const y = top + (bottom - top) * ((1 - Math.exp(-decay * t)) / norm);
    return { x: round(x), y: round(y) };
  });
  return { points, path: smoothPath(points) };
}

// Catmull-Rom spline converted to cubic Bezier segments.
function smoothPath(points: Point[]): string {
  const first = points[0];
  if (!first) return '';
  let d = `M${first.x} ${first.y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? points[i + 1];
    if (!p0 || !p1 || !p2 || !p3) continue;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C${round(c1.x)} ${round(c1.y)}, ${round(c2.x)} ${round(c2.y)}, ${p2.x} ${p2.y}`;
  }
  return d;
}
