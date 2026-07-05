// Sjove, omtrentlige rejse-tal til børnene — ikke videnskabelige facts, men gæt til grin.

// Anslået samlet kørt distance (vej-km, ikke fugleflugtslinje) for hele ruten
// Helsingør -> Rødbyhavn -> (færge) -> Puttgarden -> ... -> Chur -> San Bernardino -> Stresa.
export const ESTIMATED_DRIVING_KM = 1250;

// Hyundai Kona Electric kører typisk på 215/55 R17-dæk.
// Diameter = fælg (17" = 431,8 mm) + 2 × dækkets sidehøjde (215 mm × 0,55).
const WHEEL_DIAMETER_M = 0.6683;
export const WHEEL_CIRCUMFERENCE_M = Math.PI * WHEEL_DIAMETER_M;

export const WHEEL_ROTATIONS_WHOLE_TRIP = Math.round(
  (ESTIMATED_DRIVING_KM * 1000) / WHEEL_CIRCUMFERENCE_M
);

// Hvis 1 is = 1 km, hvor mange is skal bilen så "spise" for at nå hele vejen?
export const ICE_CREAMS_FOR_WHOLE_TRIP = ESTIMATED_DRIVING_KM;
