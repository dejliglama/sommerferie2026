import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { waypoints, cumulativeDistances, totalDistanceKm, type Waypoint } from "../data/route";
import { projectOntoRoute, computeEta, formatDuration, formatClock, type EtaResult } from "../lib/geo";
import { pathPoint, computeDisplayT, TOTAL_SVG_HEIGHT, PATH_WIDTH } from "../lib/pathShape";
import { buildRoadSegments } from "../lib/pathDayNight";
import { isNight } from "../lib/daynight";
import { buildSkyGradientStops } from "../lib/skyColor";
import { MedievalTown, HotelZzz, SnowMountain, Lake } from "../components/RouteDoodles";
import type { PlayerPosition } from "../lib/trip";

interface Props {
  myUid: string;
  myName: string;
  myEmoji: string;
  positions: PlayerPosition[];
  onLocate: (lat: number, lon: number, progressFraction: number) => void;
}

const waypointT = waypoints.map((_, i) => cumulativeDistances[i] / totalDistanceKm);
// Minimumsafstand mellem waypoint-mærker på kortet, kun til visning (se computeDisplayT).
const MIN_WAYPOINT_GAP_T = 0.071;
const waypointDisplayT = computeDisplayT(waypointT, MIN_WAYPOINT_GAP_T);
const skyGradientStops = buildSkyGradientStops();

// Lidt "forspring" så et fun fact låses op, lige før man præcist rammer punktet på GPS.
const UNLOCK_BUFFER = 0.03;

// Små pynte-illustrationer ved udvalgte stop, placeret som et sidespring fra selve mærket.
const WAYPOINT_DOODLES: Record<string, { render: () => ReactNode; dx: number; dy: number }[]> = {
  chur: [
    { render: () => <MedievalTown />, dx: -58, dy: 2 },
    { render: () => <HotelZzz />, dx: 60, dy: -4 },
  ],
  sanbernardino: [{ render: () => <SnowMountain />, dx: -58, dy: 5 }],
  lagomaggiore: [{ render: () => <Lake />, dx: -58, dy: 5 }],
};

// Lille flag-badge ved det første stop i hvert nyt land på ruten (Tyskland får sin
// egen fra selve waypoint-emojiet ved Puttgarden, så den er ikke gentaget her).
const COUNTRY_BADGES: Record<string, string> = {
  hohenems: "🇦🇹",
  chur: "🇨🇭",
  lagomaggiore: "🇮🇹",
};

// Vand-illustrationen skal forbinde de VISTE mærker (display-t), ikke den sande t —
// ellers passer den ikke, når Rødbyhavn/Puttgarden bliver skubbet fra hinanden for læsbarhed.
const RODBYHAVN_INDEX = waypoints.findIndex((w) => w.id === "rodbyhavn");
const ferryDisplayStart = waypointDisplayT[RODBYHAVN_INDEX];
const ferryDisplayEnd = waypointDisplayT[RODBYHAVN_INDEX + 1];
const ferryStartPt = pathPoint(ferryDisplayStart);
const ferryEndPt = pathPoint(ferryDisplayEnd);
const ferryMidPt = pathPoint((ferryDisplayStart + ferryDisplayEnd) / 2);

export default function AdventurePath({ myUid, myEmoji, positions, onLocate }: Props) {
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eta, setEta] = useState<EtaResult | null>(null);
  const [openFact, setOpenFact] = useState<Waypoint | null>(null);
  const [lockedHint, setLockedHint] = useState(false);
  const svgWrapRef = useRef<HTMLDivElement>(null);
  const myMarkerRef = useRef<SVGGElement>(null);

  const roadSegments = useMemo(() => buildRoadSegments(), []);

  function locate() {
    if (!("geolocation" in navigator)) {
      setError("Din enhed understøtter ikke GPS-lokation.");
      return;
    }
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const projection = projectOntoRoute(latitude, longitude);
        const result = computeEta(projection);
        setEta(result);
        onLocate(latitude, longitude, projection.progressFraction);
        setLocating(false);
      },
      (err) => {
        setError(
          err.code === err.PERMISSION_DENIED
            ? "I skal tillade lokation for at appen kan finde jer på stien."
            : "Kunne ikke finde GPS-position lige nu. Prøv igen."
        );
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }

  useEffect(() => {
    myMarkerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [eta]);

  useEffect(() => {
    if (!lockedHint) return;
    const t = setTimeout(() => setLockedHint(false), 1800);
    return () => clearTimeout(t);
  }, [lockedHint]);

  const myProgress = positions.find((p) => p.uid === myUid)?.progressFraction ?? null;
  const effectiveProgress = myProgress ?? 0;

  function isUnlocked(i: number): boolean {
    return i === 0 || waypointT[i] <= effectiveProgress + UNLOCK_BUFFER;
  }

  function handleWaypointClick(wp: Waypoint, i: number) {
    if (!wp.funFacts?.length) return;
    if (!isUnlocked(i)) {
      setLockedHint(true);
      return;
    }
    setOpenFact(wp);
  }

  return (
    <div className="screen path-screen">
      <div className="eta-panel">
        <button className="big-button primary locate-btn" onClick={locate} disabled={locating}>
          {locating ? "📍 Finder jer..." : "📍 Hvor er vi?"}
        </button>
        {error && <p className="error-text">{error}</p>}
        {eta && (
          <div className="eta-results">
            <div className="eta-row">
              <span>{eta.isFinished ? "🎉 I er fremme!" : `Næste stop: ${eta.nextWaypoint.emoji} ${eta.nextWaypoint.name}`}</span>
              {!eta.isFinished && <strong>om {formatDuration(eta.etaNext.getTime() - Date.now())}</strong>}
            </div>
            <div className="eta-row">
              <span>🏁 Fremme i Stresa</span>
              <strong>om {formatDuration(eta.etaFinal.getTime() - Date.now())} ({formatClock(eta.etaFinal)})</strong>
            </div>
            <div className={`drift-badge ${eta.driftMs > 5 * 60000 ? "behind" : eta.driftMs < -5 * 60000 ? "ahead" : "ontime"}`}>
              {eta.driftMs > 5 * 60000
                ? `⏱️ ${formatDuration(eta.driftMs)} bagud i forhold til planen`
                : eta.driftMs < -5 * 60000
                ? `⚡ ${formatDuration(-eta.driftMs)} foran planen`
                : "✅ Lige efter planen"}
            </div>
          </div>
        )}
      </div>

      {lockedHint && (
        <p className="locked-hint">🔒 Kør lidt længere, så låses denne fun fact op!</p>
      )}

      <div className="svg-scroll-wrap" ref={svgWrapRef}>
        <svg
          viewBox={`0 0 ${PATH_WIDTH} ${TOTAL_SVG_HEIGHT}`}
          width={PATH_WIDTH}
          height={TOTAL_SVG_HEIGHT}
          className="path-svg"
          preserveAspectRatio="xMidYMin meet"
        >
          <defs>
            <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
              {skyGradientStops.map((stop, i) => (
                <stop key={i} offset={stop.offset} stopColor={stop.color} />
              ))}
            </linearGradient>
          </defs>
          <rect x="0" y="0" width={PATH_WIDTH} height={TOTAL_SVG_HEIGHT} fill="url(#skyGradient)" />

          <ellipse
            cx={(ferryStartPt.x + ferryEndPt.x) / 2}
            cy={(ferryStartPt.y + ferryEndPt.y) / 2}
            rx="160"
            ry={Math.abs(ferryEndPt.y - ferryStartPt.y) / 2 + 36}
            className="ferry-water"
          />
          <path
            d={`M ${ferryMidPt.x - 60} ${ferryMidPt.y - 12} Q ${ferryMidPt.x - 40} ${ferryMidPt.y - 20} ${ferryMidPt.x - 20} ${ferryMidPt.y - 12} T ${ferryMidPt.x + 20} ${ferryMidPt.y - 12} T ${ferryMidPt.x + 60} ${ferryMidPt.y - 12}`}
            className="ferry-wave"
          />
          <path
            d={`M ${ferryMidPt.x - 60} ${ferryMidPt.y + 14} Q ${ferryMidPt.x - 40} ${ferryMidPt.y + 6} ${ferryMidPt.x - 20} ${ferryMidPt.y + 14} T ${ferryMidPt.x + 20} ${ferryMidPt.y + 14} T ${ferryMidPt.x + 60} ${ferryMidPt.y + 14}`}
            className="ferry-wave"
          />

          {roadSegments
            .filter((seg) => seg.kind !== "ferry")
            .map((seg, i) => (
              <path key={`road-${i}`} d={seg.d} className={`road-path ${seg.kind === "night" ? "road-path-night" : "road-path-day"}`} />
            ))}
          {roadSegments.map((seg, i) => (
            <path
              key={`dash-${i}`}
              d={seg.d}
              className={`road-path-dash ${seg.kind === "night" ? "road-path-dash-night" : ""} ${seg.kind === "ferry" ? "road-path-dash-ferry" : ""}`}
            />
          ))}

          <text textAnchor="middle" x={ferryMidPt.x} y={ferryMidPt.y} dy="8" fontSize="26" className="ferry-boat">
            ⛴️
          </text>

          {waypoints.map((wp, i) => {
            const { x, y } = pathPoint(waypointDisplayT[i]);
            const unlocked = isUnlocked(i);
            const hasFacts = Boolean(wp.funFacts?.length);
            const wpNight = isNight(new Date(wp.scheduledTime));
            return (
              <g
                key={wp.id}
                transform={`translate(${x}, ${y})`}
                className={`waypoint-group ${hasFacts ? "clickable" : ""} ${unlocked ? "unlocked" : "locked"}`}
                onClick={() => handleWaypointClick(wp, i)}
              >
                {WAYPOINT_DOODLES[wp.id]?.map((doodle, di) => (
                  <g key={di} transform={`translate(${doodle.dx}, ${doodle.dy})`}>
                    {doodle.render()}
                  </g>
                ))}
                <circle r="30" className={`waypoint-circle wp-${wp.type} ${wpNight ? "wp-night" : ""}`} />
                <text textAnchor="middle" dy="11" fontSize="30">
                  {wp.emoji}
                </text>
                <text textAnchor="middle" dy="50" fontSize="17" className="waypoint-label">
                  {wp.name}
                </text>
                <text textAnchor="middle" dy="67" fontSize="13" className="waypoint-short">
                  {wp.short}
                </text>
                <text textAnchor="middle" dy="84" fontSize="14" className="waypoint-time">
                  {wpNight ? "🌙" : "☀️"} ca. {formatClock(new Date(wp.scheduledTime))}
                </text>
                {hasFacts && (
                  <text textAnchor="middle" x="24" y="-22" fontSize="21" className="fact-badge">
                    {unlocked ? "💡" : "🔒"}
                  </text>
                )}
                {COUNTRY_BADGES[wp.id] && (
                  <g transform="translate(-24, -22)">
                    <circle r="13" className="country-badge-bg" />
                    <text textAnchor="middle" dy="5" fontSize="15">
                      {COUNTRY_BADGES[wp.id]}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {positions.map((p) => {
            const { x, y } = pathPoint(Math.max(0, Math.min(1, p.progressFraction)));
            const isMe = p.uid === myUid;
            return (
              <g
                key={p.uid}
                ref={isMe ? myMarkerRef : undefined}
                transform={`translate(${x + (isMe ? -24 : 24)}, ${y - 44})`}
                className="player-marker"
              >
                <circle r="24" className={isMe ? "player-dot me" : "player-dot"} />
                <text textAnchor="middle" dy="9" fontSize="24">
                  {isMe ? myEmoji : "👤"}
                </text>
                <text textAnchor="middle" dy="-32" fontSize="14" className="player-name">
                  {p.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      {myProgress === null && (
        <p className="hint-text">Tryk "Hvor er vi?" for at se jeres prik på stien 👆</p>
      )}

      {openFact && (
        <div className="fact-overlay" onClick={() => setOpenFact(null)}>
          <div className="fact-card" onClick={(e) => e.stopPropagation()}>
            <button className="fact-close" onClick={() => setOpenFact(null)} aria-label="Luk">
              ×
            </button>
            <h3>
              {openFact.emoji} {openFact.name}
            </h3>
            {openFact.funFacts?.map((fact, idx) => (
              <p key={idx} className="fact-text">
                <span className="fact-emoji">{fact.emoji}</span> {fact.text}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
