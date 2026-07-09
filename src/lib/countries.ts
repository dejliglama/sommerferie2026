import { waypoints, cumulativeDistances, totalDistanceKm } from "../data/route";

export interface CountryCrossing {
  waypointId: string;
  code: string;
  flag: string;
  name: string;
}

// Rækkefølgen af lande på ruten. Danmark tæller altid med med det samme, da hele
// familien starter der — resten låses op i takt med den faktiske fremdrift på ruten.
export const COUNTRIES: CountryCrossing[] = [
  { waypointId: "helsingor", code: "DK", flag: "🇩🇰", name: "Danmark" },
  { waypointId: "puttgarden", code: "DE", flag: "🇩🇪", name: "Tyskland" },
  { waypointId: "hohenems", code: "AT", flag: "🇦🇹", name: "Østrig" },
  { waypointId: "chur", code: "CH", flag: "🇨🇭", name: "Schweiz" },
  { waypointId: "lagomaggiore", code: "IT", flag: "🇮🇹", name: "Italien" },
];

export const TOTAL_COUNTRIES = COUNTRIES.length;

const waypointT = waypoints.map((_, i) => cumulativeDistances[i] / totalDistanceKm);
const countryThresholds = COUNTRIES.map(
  (c) => waypointT[waypoints.findIndex((w) => w.id === c.waypointId)]
);

// Hvor mange lande er nået ud fra en fremdrift (0..1) langs ruten. Danmark (index 0)
// tæller altid med, selv før nogen har trykket "Hvor er vi?" én eneste gang.
export function countriesReached(progressFraction: number | null | undefined): number {
  const p = progressFraction ?? 0;
  let count = 1;
  for (let i = 1; i < countryThresholds.length; i++) {
    if (p >= countryThresholds[i]) count++;
  }
  return count;
}

export function countriesReachedList(progressFraction: number | null | undefined): CountryCrossing[] {
  return COUNTRIES.slice(0, countriesReached(progressFraction));
}
