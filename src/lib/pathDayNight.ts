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

// Rødbyhavn -> Puttgarden er en færgeoverfart, ikke en kørt strækning — her skal
// vejen "brydes" og vise vand i stedet.
const FERRY_LEG_INDEX = waypoints.findIndex((w) => w.id === "rodbyhavn");
export const FERRY_T_START = waypointT[FERRY_LEG_INDEX];
export const FERRY_T_END = waypointT[FERRY_LEG_INDEX + 1];

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

export type RoadSegmentKind = "day" | "night" | "ferry";

export interface RoadSegment {
  d: string;
  kind: RoadSegmentKind;
}

function kindAtT(t: number): RoadSegmentKind {
  if (t >= FERRY_T_START && t <= FERRY_T_END) return "ferry";
  return nightAtT(t) ? "night" : "day";
}

// Deler vejen op i skiftende dag/nat/færge-strækninger, så vi visuelt kan gøre
// natte-kørslen mørkere og færgeoverfarten til vand.
export function buildRoadSegments(steps = 300): RoadSegment[] {
  const segments: RoadSegment[] = [];
  let currentD = "";
  let currentKind: RoadSegmentKind | null = null;
  let prevPoint: { x: number; y: number } | null = null;

  // Sørg for at vi rammer præcis på færge-grænserne, så vandet starter/slutter pænt.
  const boundaryTs = [FERRY_T_START, FERRY_T_END];
  const sampleTs = new Set<number>();
  for (let i = 0; i <= steps; i++) sampleTs.add(i / steps);
  boundaryTs.forEach((t) => sampleTs.add(t));
  const sorted = Array.from(sampleTs).sort((a, b) => a - b);

  for (const t of sorted) {
    const { x, y } = pathPoint(t);
    const kind = kindAtT(t);

    if (currentKind === null) {
      currentD = `M ${x} ${y}`;
      currentKind = kind;
    } else if (kind !== currentKind) {
      segments.push({ d: currentD, kind: currentKind });
      currentD = `M ${prevPoint!.x} ${prevPoint!.y} L ${x} ${y}`;
      currentKind = kind;
    } else {
      currentD += ` L ${x} ${y}`;
    }
    prevPoint = { x, y };
  }
  segments.push({ d: currentD, kind: currentKind! });
  return segments;
}
