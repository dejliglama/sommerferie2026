import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  type Firestore,
} from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

// Firebase (særligt Auth) kaster synkront hvis konfigurationen mangler, så vi
// undgår helt at initialisere den, hvis .env ikke er sat op endnu (fx lokal test uden Firebase).
export let app: FirebaseApp | null = null;
export let db: Firestore | null = null;
export let auth: Auth | null = null;

if (firebaseConfigured) {
  app = initializeApp(firebaseConfig);

  // persistentLocalCache giver os offline-first: data læses/skrives lokalt med det samme
  // og synkroniseres til Firestore i baggrunden når enheden får forbindelse igen.
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  });

  auth = getAuth(app);
}

// Enkelt, anonymt UID pr. enhed — bruges kun til at afgrænse skriverettigheder
// i Firestore-reglerne, der er ingen synlig login-skærm for dette.
export function ensureAnonymousAuth(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!auth) {
      reject(new Error("Firebase er ikke konfigureret."));
      return;
    }
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        unsub();
        resolve(user.uid);
      }
    }, reject);
    if (!auth.currentUser) {
      signInAnonymously(auth).catch((err) => {
        unsub();
        reject(err);
      });
    }
  });
}

// Al familien deler denne ene rejse.
export const TRIP_ID = "sommerferie2026";
