import { timeAtT } from "./pathDayNight";
import { tripLocalHour } from "./daynight";

type RGB = [number, number, number];

// Nøgle-farver for himlen hen over et helt døgn — dæmpet dyb blå om natten,
// varm morgenrøde omkring daggry, og den lyse dag-himmel resten af tiden.
const KEYFRAMES: { hour: number; color: RGB }[] = [
  { hour: 0, color: [23, 28, 56] }, // dyb nat
  { hour: 5, color: [23, 28, 56] }, // stadig dyb nat
  { hour: 6.2, color: [95, 70, 105] }, // daggry begynder
  { hour: 6.8, color: [255, 148, 118] }, // morgenrøde
  { hour: 8, color: [190, 216, 220] }, // blødt op mod dagslys
  { hour: 9.5, color: [126, 200, 227] }, // fuld dag
  { hour: 17.5, color: [126, 200, 227] }, // stadig dag
  { hour: 19, color: [235, 160, 118] }, // aftenvarme
  { hour: 20.3, color: [90, 70, 110] }, // dæmpet skumring
  { hour: 22, color: [23, 28, 56] }, // dyb nat
  { hour: 24, color: [23, 28, 56] },
];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function colorForHour(hour: number): string {
  const h = ((hour % 24) + 24) % 24;
  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    const a = KEYFRAMES[i];
    const b = KEYFRAMES[i + 1];
    if (h >= a.hour && h <= b.hour) {
      const t = b.hour === a.hour ? 0 : (h - a.hour) / (b.hour - a.hour);
      const r = Math.round(lerp(a.color[0], b.color[0], t));
      const g = Math.round(lerp(a.color[1], b.color[1], t));
      const bl = Math.round(lerp(a.color[2], b.color[2], t));
      return `rgb(${r}, ${g}, ${bl})`;
    }
  }
  const last = KEYFRAMES[KEYFRAMES.length - 1].color;
  return `rgb(${last[0]}, ${last[1]}, ${last[2]})`;
}

export interface SkyStop {
  offset: number;
  color: string;
}

// Bygger farve-stop til en lodret baggrunds-gradient, så himlen bag ruten går
// fra dag til aften/nat til morgenrøde og tilbage til dag, i takt med planen.
export function buildSkyGradientStops(steps = 200): SkyStop[] {
  const stops: SkyStop[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const hour = tripLocalHour(timeAtT(t));
    stops.push({ offset: t, color: colorForHour(hour) });
  }
  return stops;
}
