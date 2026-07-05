export const NIGHT_START_HOUR = 20;
export const NIGHT_END_HOUR = 7;

// Hele ruten (DK/DE/AT/CH/IT) ligger i CEST (+02:00) om sommeren, så vi regner
// "klokken der" ud fra det faste offset i stedet for enhedens egen tidszone —
// det giver samme dag/nat-resultat uanset hvor appen køres fra.
const TRIP_UTC_OFFSET_HOURS = 2;

export function tripLocalHour(date: Date): number {
  const shifted = new Date(date.getTime() + TRIP_UTC_OFFSET_HOURS * 3600 * 1000);
  return shifted.getUTCHours() + shifted.getUTCMinutes() / 60;
}

export function isNight(date: Date): boolean {
  const h = tripLocalHour(date);
  return h >= NIGHT_START_HOUR || h < NIGHT_END_HOUR;
}
