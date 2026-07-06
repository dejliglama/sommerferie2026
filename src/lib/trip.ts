import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  increment,
  type Unsubscribe,
} from "firebase/firestore";
import { db, TRIP_ID } from "./firebase";

export interface Player {
  uid: string;
  name: string;
  emoji: string;
}

export interface PlayerPosition {
  uid: string;
  name: string;
  lat: number;
  lon: number;
  progressFraction: number;
  updatedAt: number | null;
}

export interface PlayerCounters {
  uid: string;
  name: string;
  iceCream: number;
  tisse: number;
}

// Disse hjælpere kaldes kun efter ensureAnonymousAuth() er lykkedes, hvilket
// kræver firebaseConfigured === true, så db er garanteret initialiseret her.
const playersCol = () => collection(db!, "trips", TRIP_ID, "players");
const positionsCol = () => collection(db!, "trips", TRIP_ID, "positions");
const countersCol = () => collection(db!, "trips", TRIP_ID, "counters");

export async function joinAsPlayer(uid: string, name: string, emoji: string): Promise<void> {
  await setDoc(
    doc(playersCol(), uid),
    { name, emoji, createdAt: serverTimestamp() },
    { merge: true }
  );
}

export function subscribePlayers(cb: (players: Player[]) => void): Unsubscribe {
  return onSnapshot(playersCol(), (snap) => {
    cb(snap.docs.map((d) => ({ uid: d.id, name: d.data().name, emoji: d.data().emoji })));
  });
}

export async function updateMyPosition(
  uid: string,
  name: string,
  lat: number,
  lon: number,
  progressFraction: number
): Promise<void> {
  await setDoc(
    doc(positionsCol(), uid),
    { name, lat, lon, progressFraction, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

export function subscribePositions(cb: (positions: PlayerPosition[]) => void): Unsubscribe {
  return onSnapshot(positionsCol(), (snap) => {
    cb(
      snap.docs.map((d) => {
        const data = d.data();
        return {
          uid: d.id,
          name: data.name,
          lat: data.lat,
          lon: data.lon,
          progressFraction: data.progressFraction,
          updatedAt: data.updatedAt?.toMillis?.() ?? null,
        };
      })
    );
  });
}

export async function bumpCounter(
  uid: string,
  name: string,
  field: "iceCream" | "tisse",
  delta: 1 | -1 = 1
): Promise<void> {
  await setDoc(
    doc(countersCol(), uid),
    { name, [field]: increment(delta) },
    { merge: true }
  );
}

export function subscribeCounters(cb: (counters: PlayerCounters[]) => void): Unsubscribe {
  return onSnapshot(countersCol(), (snap) => {
    cb(
      snap.docs.map((d) => {
        const data = d.data();
        return {
          uid: d.id,
          name: data.name,
          iceCream: data.iceCream ?? 0,
          tisse: data.tisse ?? 0,
        };
      })
    );
  });
}
