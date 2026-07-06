import { WHEEL_ROTATIONS_WHOLE_TRIP, ICE_CREAMS_FOR_WHOLE_TRIP, ESTIMATED_DRIVING_KM } from "../lib/tripStats";

// Rejseplan Helsingør -> Stresa. Koordinater er tilnærmede (nok til visualisering + ETA),
// ikke turn-by-turn navigation.
export type WaypointType = "start" | "ferry" | "charge" | "meal" | "activity" | "hotel" | "sightsee" | "final";

export interface FunFact {
  emoji: string;
  text: string;
}

export interface Waypoint {
  id: string;
  name: string;
  short: string;
  lat: number;
  lon: number;
  scheduledTime: string; // ISO, lokal tid på stedet forudsat CEST for hele ruten
  type: WaypointType;
  emoji: string;
  description?: string;
  funFacts?: FunFact[];
}

const fmt = (n: number) => n.toLocaleString("da-DK");

// Afgang fredag 2026-07-17 kl. 13:30. Alle tider er i "Europe/Copenhagen"-agtig CEST,
// hvilket er fint da hele ruten (DK/DE/AT/CH/IT) ligger i samme tidszone om sommeren.
export const TRIP_START = "2026-07-17T13:30:00+02:00";

export const waypoints: Waypoint[] = [
  {
    id: "helsingor",
    name: "Helsingør",
    short: "Afgang",
    lat: 56.0360,
    lon: 12.6136,
    scheduledTime: "2026-07-17T13:30:00+02:00",
    type: "start",
    emoji: "🏠",
    description: "Afgang med 100% strøm i Kona'en!",
    funFacts: [
      {
        emoji: "👻",
        text: "Kronborg Slot i Helsingør er Hamlets slot! Dybt under slottet sover kæmpen Holger Danske — sagnet siger, at han vågner og redder Danmark, hvis landet nogensinde er i fare.",
      },
      {
        emoji: "🛞",
        text: `På hele turen til Stresa (ca. ${fmt(ESTIMATED_DRIVING_KM)} km) drejer hvert hjul på jeres Kona rundt omkring ${fmt(WHEEL_ROTATIONS_WHOLE_TRIP)} gange!`,
      },
    ],
  },
  {
    id: "rodbyhavn",
    name: "Rødbyhavn",
    short: "Færge tjek-ind",
    lat: 54.6558,
    lon: 11.3500,
    scheduledTime: "2026-07-17T15:45:00+02:00",
    type: "ferry",
    emoji: "🚢",
    description: "Tjek ind til færgen",
    funFacts: [
      {
        emoji: "🚇",
        text: "Lige her bygger de verdens længste sænketunnel — Femernbælt-tunnelen. Den bliver 18 km lang og ligger 40 meter under havet. En dag kan I køre gennem den i stedet for at sejle!",
      },
    ],
  },
  {
    id: "puttgarden",
    name: "Puttgarden",
    short: "Ankomst Tyskland",
    lat: 54.5000,
    lon: 11.2270,
    scheduledTime: "2026-07-17T17:00:00+02:00",
    type: "ferry",
    emoji: "🇩🇪",
    description: "I land i Tyskland",
    funFacts: [
      {
        emoji: "🐦",
        text: "Ruten hedder 'Vogelfluglinie' — Fugleflugtslinjen! Den følger nøjagtig den vej, som trækfugle har fløjet i tusindvis af år mellem Skandinavien og Sydeuropa.",
      },
      {
        emoji: "🍔",
        text: "I er i Tyskland! Sådan siger du 'cheeseburger' på tysk: 'Cheeseburger' — det hedder faktisk (næsten) det samme! Prøv at sige 'Ein Cheeseburger, bitte' (én cheeseburger, tak) næste gang I bestiller mad.",
      },
    ],
  },
  {
    id: "hammoor",
    name: "Omkring Hammoor",
    short: "Aftensmad og opladning",
    lat: 53.7800,
    lon: 10.4000,
    scheduledTime: "2026-07-17T18:30:00+02:00",
    type: "charge",
    emoji: "🔌",
    description: "IONITY Buddikate Ost — 45-50 min",
    funFacts: [
      {
        emoji: "🚂",
        text: "I er tæt på Hamborg, hvor Miniatur Wunderland ligger — verdens største modeljernbane med over 1.000 tog, 9.250 miniature-biler og 130.000 træer!",
      },
    ],
  },
  {
    id: "guxhagen",
    name: "Omkring Guxhagen",
    short: "Opladning og kaffe",
    lat: 51.2130,
    lon: 9.5350,
    scheduledTime: "2026-07-17T21:30:00+02:00",
    type: "meal",
    emoji: "🍔",
    description: "IONITY Guxhagen — McDonald's, tænder & nattøj",
    funFacts: [
      {
        emoji: "🏰",
        text: "Slotte-jagt! Tyskland har over 25.000 slotte og borge — flere end noget andet land i Europa. I kører lige forbi Kassel, hvor 'Tornerose-slottet' Sababurg ligger. Kan familien spotte 5 slots-tårne fra vinduet på vej gennem Hessen?",
      },
      {
        emoji: "📖",
        text: "I kører langs den 'Tyske Eventyrvej' (Deutsche Märchenstraße) — den følger i brødrene Grimms fodspor, dem der skrev eventyr som Askepot og Rødhætte.",
      },
    ],
  },
  {
    id: "ellwangen",
    name: "Omkring Ellwangen",
    short: "Opladning og kaffe",
    lat: 48.9620,
    lon: 10.1280,
    scheduledTime: "2026-07-18T01:15:00+02:00",
    type: "charge",
    emoji: "☕",
    description: "IONITY Ellwanger Berge Ost — kaffe & powernap",
    funFacts: [
      {
        emoji: "👑",
        text: "I byen Ellwangen ligger et slot med to kæmpe julekrybber, hver med over 100 figurer i gamle klæder — og et dukkehus-museum med 50 dukkehuse!",
      },
    ],
  },
  {
    id: "dietenheim",
    name: "Dietenheim",
    short: "Sidste stop i Tyskland",
    lat: 48.2110,
    lon: 10.1300,
    scheduledTime: "2026-07-18T04:30:00+02:00",
    type: "charge",
    emoji: "🌙",
    description: "IONITY Illertaler Wald Ost",
    funFacts: [
      {
        emoji: "⛪",
        text: "I nærheden ligger Ulm, hjemsted for verdens næsthøjeste kirketårn — Ulmer Münster på 161,5 meter! Der er 768 trin op til toppen.",
      },
    ],
  },
  {
    id: "hohenems",
    name: "Hohenems",
    short: "Morgenmad ved grænsen",
    lat: 47.3600,
    lon: 9.6900,
    scheduledTime: "2026-07-18T07:30:00+02:00",
    type: "meal",
    emoji: "🥐",
    description: "IONITY Hohenems, Østrig — morgenmad",
    funFacts: [
      {
        emoji: "🏯",
        text: "Højt over byen ligger ruinerne af en borg fra år 800-tallet! Hohenems har også Østrigs første kaffehus fra 1797 — måske drikker jeres forældre morgenkaffe i samme tradition.",
      },
    ],
  },
  {
    id: "chur",
    name: "Chur",
    short: "Hotel & bjergeventyr",
    lat: 46.8499,
    lon: 9.5320,
    scheduledTime: "2026-07-18T09:30:00+02:00",
    type: "hotel",
    emoji: "🏔️",
    description: "Central Hotel Post Chur — Urban Golf & Street Art",
    funFacts: [
      {
        emoji: "🦴",
        text: "Chur er Schweiz' ældste by! Der har boet mennesker her i over 13.000 år — længe før pyramiderne i Egypten blev bygget.",
      },
    ],
  },
  {
    id: "viamala",
    name: "Viamala-kløften",
    short: "359 trappetrin",
    lat: 46.6960,
    lon: 9.4360,
    scheduledTime: "2026-07-19T10:00:00+02:00",
    type: "sightsee",
    emoji: "🪨",
    description: "Ned i den vilde kløft",
    funFacts: [
      {
        emoji: "😱",
        text: "'Viamala' betyder 'den onde vej' — for hundredvis af år siden var rejsende bange for at gå her, fordi klippevæggene er op til 300 meter høje! I går ned ad alle 359 trin.",
      },
    ],
  },
  {
    id: "thusis",
    name: "Thusis",
    short: "Sidste ladestop før pas",
    lat: 46.6970,
    lon: 9.4430,
    scheduledTime: "2026-07-19T11:30:00+02:00",
    type: "charge",
    emoji: "🔋",
    description: "GOFAST Schnellladestation — 25 min",
  },
  {
    id: "sanbernardino",
    name: "San Bernardino-passet",
    short: "2.066 meter",
    lat: 46.4680,
    lon: 9.1810,
    scheduledTime: "2026-07-19T12:00:00+02:00",
    type: "sightsee",
    emoji: "⛰️",
    description: "Lago Moesola & frokost på Ospizio",
    funFacts: [
      {
        emoji: "🌀",
        text: "Den gamle bjergvej har over 40 hårnålesving! Passet ligger 2.066 meter oppe — det er så højt som 57 Rundetårne oven på hinanden.",
      },
    ],
  },
  {
    id: "lagomaggiore",
    name: "Lago Maggiore",
    short: "Gelato-pause",
    lat: 45.9700,
    lon: 8.6900,
    scheduledTime: "2026-07-19T15:15:00+02:00",
    type: "activity",
    emoji: "🍦",
    description: "Ægte italiensk is ved søen",
    funFacts: [
      {
        emoji: "🍨",
        text: `Hvis 1 is = 1 km, skal jeres Kona "spise" hele ${fmt(ICE_CREAMS_FOR_WHOLE_TRIP)} is for at køre fra Helsingør til Stresa! Held og lykke med at spise jeres andel her ved søen 😋`,
      },
      {
        emoji: "🍔",
        text: "I er i Italien! Sådan siger du 'cheeseburger' på italiensk: 'Cheeseburger'! Men is hedder 'gelato' — det bliver nyttigt at kunne lige her ved søen 🍦.",
      },
    ],
  },
  {
    id: "stresa",
    name: "Stresa",
    short: "Fremme!",
    lat: 45.8850,
    lon: 8.5320,
    scheduledTime: "2026-07-19T16:00:00+02:00",
    type: "final",
    emoji: "🎉",
    description: "Ferien er i gang!",
    funFacts: [
      {
        emoji: "🏝️",
        text: "Lige udenfor Stresa ligger de fortryllede Borromæiske Øer. På Isola Bella er der en kæmpe have bygget som en bryllupskage med 10 terrasser — Napoleon har selv besøgt den!",
      },
    ],
  },
];

export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Kumuleret distance (km) fra start til hvert waypoint, langs den rette linje mellem punkterne.
export const cumulativeDistances: number[] = waypoints.reduce<number[]>((acc, wp, i) => {
  if (i === 0) return [0];
  const prev = waypoints[i - 1];
  const dist = haversineKm(prev.lat, prev.lon, wp.lat, wp.lon);
  acc.push(acc[i - 1] + dist);
  return acc;
}, []);

export const totalDistanceKm = cumulativeDistances[cumulativeDistances.length - 1];
