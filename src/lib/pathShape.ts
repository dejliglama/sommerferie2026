// Genererer en stiliseret, snoet "eventyrsti" (som et brætspil) i SVG-koordinater,
// helt uafhængig af rigtig geografi — kun waypointernes indbyrdes afstand (t=0..1) bruges.
export const PATH_WIDTH = 400;
export const PATH_HEIGHT_PER_UNIT = 1500;
const AMPLITUDE = 130;
const CENTER_X = PATH_WIDTH / 2;
const WAVES = 3.4;

export function pathPoint(t: number): { x: number; y: number } {
  const y = t * PATH_HEIGHT_PER_UNIT + 60;
  const x = CENTER_X + AMPLITUDE * Math.sin(t * Math.PI * 2 * WAVES);
  return { x, y };
}

export function buildPathD(steps = 300): string {
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const { x, y } = pathPoint(t);
    d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  }
  return d;
}

export const TOTAL_SVG_HEIGHT = PATH_HEIGHT_PER_UNIT + 120;
