import { waypoints, cumulativeDistances, totalDistanceKm } from "../data/route";
import { pathPoint } from "./pathShape";
import { isNight } from "./daynight";

const waypointT = waypoints.map((_, i) => cumulativeDistances[i] / totalDistanceKm);
const waypointTimesMs = waypoints.map((w) => new Date(w.scheduledTime).getTime());

// Ben som Chur -> Viamala dækker et helt døgns hotel-ophold over meget kort distance
// (bilen holder stille det meste af tiden). Lineær tid-interpolation ville der fejlagtigt
// "feje" gennem en hel nat, selvom begge endepunkter faktisk er om dagen. Under denne
// tempo-grænse (km/t) regnes benet som et "ophold", og vi bruger nærmeste endepunkts
// dag/nat-status i stedet for at interpolere klokkeslættet.
const STAY_SPEED_THRESHOLD_KMH = 10;

const legIsStay = waypoints.slice(0, -1).map((_, i) => {
  const distKm = cumulativeDistances[i + 1] - cumulativeDistances[i];
  const hours = (waypointTimesMs[i + 1] - waypointTimesMs[i]) / 3600000;
  const speedKmh = hours > 0 ? distKm / hours : Infinity;
  return speedKmh < STAY_SPEED_THRESHOLD_KMH;
});

// Finder dag/nat-status et sted midt mellem to waypoints (t = 0..1 langs hele ruten).
function nightAtT(t: number): boolean {
  let i = 0;
  while (i < waypointT.length - 2 && waypointT[i + 1] < t) i++;
  const t0 = waypointT[i];
  const t1 = waypointT[i + 1];
  const f = t1 === t0 ? 0 : (t - t0) / (t1 - t0);

  if (legIsStay[i]) {
    return isNight(new Date(f < 0.5 ? waypointTimesMs[i] : waypointTimesMs[i + 1]));
  }
  const time = new Date(waypointTimesMs[i] + f * (waypointTimesMs[i + 1] - waypointTimesMs[i]));
  return isNight(time);
}

export interface DayNightSegment {
  d: string;
  isNight: boolean;
}

// Deler vejen op i skiftende dag/nat-strækninger, så vi visuelt kan gøre natte-kørslen mørkere.
export function buildDayNightSegments(steps = 300): DayNightSegment[] {
  const segments: DayNightSegment[] = [];
  let currentD = "";
  let currentNight: boolean | null = null;
  let prevPoint: { x: number; y: number } | null = null;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const { x, y } = pathPoint(t);
    const night = nightAtT(t);

    if (currentNight === null) {
      currentD = `M ${x} ${y}`;
      currentNight = night;
    } else if (night !== currentNight) {
      segments.push({ d: currentD, isNight: currentNight });
      currentD = `M ${prevPoint!.x} ${prevPoint!.y} L ${x} ${y}`;
      currentNight = night;
    } else {
      currentD += ` L ${x} ${y}`;
    }
    prevPoint = { x, y };
  }
  segments.push({ d: currentD, isNight: currentNight! });
  return segments;
}
