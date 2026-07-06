// Genererer en stiliseret, snoet "eventyrsti" (som et brætspil) i SVG-koordinater,
// helt uafhængig af rigtig geografi — kun waypointernes indbyrdes afstand (t=0..1) bruges.
export const PATH_WIDTH = 400;
export const PATH_HEIGHT_PER_UNIT = 1900;
const AMPLITUDE = 100;
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

// Nogle waypoints ligger meget tæt (eller oveni hinanden) i virkelig afstand langs ruten
// (fx Viamala og Thusis). Til VISNING af mærker/labels presser vi dem fra hinanden med en
// minimumsafstand, så teksten aldrig overlapper — men uden at røre den "rigtige" t-værdi,
// som stadig bruges til GPS-matching og oplåsning af fun facts.
export function computeDisplayT(trueT: number[], minGap: number): number[] {
  const n = trueT.length;
  const forward = [...trueT];
  for (let i = 1; i < n; i++) {
    forward[i] = Math.max(trueT[i], forward[i - 1] + minGap);
  }

  const last = forward[n - 1];
  if (last <= trueT[n - 1] + 1e-9) {
    return forward;
  }

  // Der var ikke plads nok til at nå den sidste waypoint uden at "flyde over" —
  // pres i stedet bagfra, forankret i den rigtige slutposition.
  const backward = [...forward];
  backward[n - 1] = trueT[n - 1];
  for (let i = n - 2; i >= 0; i--) {
    backward[i] = Math.min(forward[i], backward[i + 1] - minGap);
  }
  return backward;
}
