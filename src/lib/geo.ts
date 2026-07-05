import { waypoints, cumulativeDistances, totalDistanceKm, type Waypoint } from "../data/route";

interface XY {
  x: number;
  y: number;
}

// Simpel ligeareal-agtig flad projektion, centreret om rutens middel-breddegrad.
// Fin nok til afstande over nogle hundrede km — vi navigerer ikke skibe.
const meanLat = waypoints.reduce((s, w) => s + w.lat, 0) / waypoints.length;
const cosMeanLat = Math.cos((meanLat * Math.PI) / 180);

function toXY(lat: number, lon: number): XY {
  return { x: lon * cosMeanLat, y: lat };
}

const routeXY = waypoints.map((w) => toXY(w.lat, w.lon));

export interface RouteProjection {
  progressKm: number;
  progressFraction: number; // 0..1 langs hele ruten
  legIndex: number; // segment mellem waypoints[legIndex] og waypoints[legIndex+1]
  tAlongLeg: number; // 0..1 hvor langt i segmentet
  distanceFromRouteKm: number; // hvor langt fra ruten punktet reelt ligger (afvigelse)
  nearestWaypoint: Waypoint;
}

// Projicér et GPS-punkt ned på det nærmeste sted på rute-polylinen.
export function projectOntoRoute(lat: number, lon: number): RouteProjection {
  const p = toXY(lat, lon);
  let best: RouteProjection | null = null;

  for (let i = 0; i < routeXY.length - 1; i++) {
    const a = routeXY[i];
    const b = routeXY[i + 1];
    const abx = b.x - a.x;
    const aby = b.y - a.y;
    const lenSq = abx * abx + aby * aby || 1e-9;
    let t = ((p.x - a.x) * abx + (p.y - a.y) * aby) / lenSq;
    t = Math.max(0, Math.min(1, t));
    const projX = a.x + t * abx;
    const projY = a.y + t * aby;
    const dx = p.x - projX;
    const dy = p.y - projY;
    // konverter graders-afstand til km groft (1 grad bredde ~ 111km)
    const distKm = Math.sqrt(dx * dx + dy * dy) * 111;

    if (!best || distKm < best.distanceFromRouteKm) {
      const segStartKm = cumulativeDistances[i];
      const segEndKm = cumulativeDistances[i + 1];
      const progressKm = segStartKm + t * (segEndKm - segStartKm);
      best = {
        progressKm,
        progressFraction: progressKm / totalDistanceKm,
        legIndex: i,
        tAlongLeg: t,
        distanceFromRouteKm: distKm,
        nearestWaypoint: t < 0.5 ? waypoints[i] : waypoints[i + 1],
      };
    }
  }

  return best!;
}

export interface EtaResult {
  scheduledTimeAtPosition: Date;
  driftMs: number; // positiv = bagud ift. planen, negativ = i forvejen
  nextWaypoint: Waypoint;
  etaNext: Date;
  finalWaypoint: Waypoint;
  etaFinal: Date;
  isFinished: boolean;
}

export function computeEta(projection: RouteProjection, now: Date = new Date()): EtaResult {
  const { legIndex, tAlongLeg } = projection;
  const from = waypoints[legIndex];
  const to = waypoints[legIndex + 1];
  const fromT = new Date(from.scheduledTime).getTime();
  const toT = new Date(to.scheduledTime).getTime();
  const scheduledAtPositionMs = fromT + tAlongLeg * (toT - fromT);
  const driftMs = now.getTime() - scheduledAtPositionMs;

  const finalWaypoint = waypoints[waypoints.length - 1];
  const isFinished = to.id === finalWaypoint.id && tAlongLeg > 0.98;

  const etaNextMs = toT + driftMs;
  const etaFinalMs = new Date(finalWaypoint.scheduledTime).getTime() + driftMs;

  return {
    scheduledTimeAtPosition: new Date(scheduledAtPositionMs),
    driftMs,
    nextWaypoint: to,
    etaNext: new Date(etaNextMs),
    finalWaypoint,
    etaFinal: new Date(etaFinalMs),
    isFinished,
  };
}

export function formatDuration(ms: number): string {
  const sign = ms < 0 ? "-" : "";
  const abs = Math.abs(ms);
  const totalMin = Math.round(abs / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${sign}${m} min`;
  return `${sign}${h} t ${m} min`;
}

export function formatClock(d: Date): string {
  return d.toLocaleTimeString("da-DK", { hour: "2-digit", minute: "2-digit" });
}
