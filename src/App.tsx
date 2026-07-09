import { useEffect, useState } from "react";
import Login from "./screens/Login";
import AdventurePath from "./screens/AdventurePath";
import Games from "./screens/Games";
import PokeBror from "./screens/PokeBror";
import Quiz from "./screens/Quiz";
import ColorFace from "./screens/ColorFace";
import BottomNav, { type Tab } from "./components/BottomNav";
import { ensureAnonymousAuth, firebaseConfigured } from "./lib/firebase";
import { loadLocalPlayer, saveLocalPlayer, type LocalPlayer } from "./lib/localPlayer";
import {
  joinAsPlayer,
  subscribePlayers,
  subscribePositions,
  subscribeCounters,
  updateMyPosition,
  bumpCounter,
  type Player,
  type PlayerPosition,
  type PlayerCounters,
  type CounterField,
} from "./lib/trip";

export default function App() {
  const [uid, setUid] = useState<string | null>(null);
  const [authError, setAuthError] = useState(false);
  const [player, setPlayer] = useState<LocalPlayer | null>(() => loadLocalPlayer());
  const [joining, setJoining] = useState(false);
  const [tab, setTab] = useState<Tab>("path");
  const [players, setPlayers] = useState<Player[]>([]);
  const [positions, setPositions] = useState<PlayerPosition[]>([]);
  const [counters, setCounters] = useState<PlayerCounters[]>([]);

  useEffect(() => {
    if (!firebaseConfigured) {
      setAuthError(true);
      return;
    }
    ensureAnonymousAuth()
      .then(setUid)
      .catch(() => setAuthError(true));
  }, []);

  useEffect(() => {
    if (!uid || !player) return;
    joinAsPlayer(uid, player.name, player.emoji).catch(() => {
      // Offline er ok — Firestore synker det automatisk når vi er online igen.
    });
  }, [uid, player]);

  useEffect(() => {
    if (!uid) return;
    const unsubPlayers = subscribePlayers(setPlayers);
    const unsubPos = subscribePositions(setPositions);
    const unsubCounters = subscribeCounters(setCounters);
    return () => {
      unsubPlayers();
      unsubPos();
      unsubCounters();
    };
  }, [uid]);

  async function handleJoin(name: string, emoji: string) {
    setJoining(true);
    const local = { name, emoji };
    saveLocalPlayer(local);
    setPlayer(local);
    if (uid) {
      try {
        await joinAsPlayer(uid, name, emoji);
      } catch {
        // offline, prøves igen næste gang uid/player ændres
      }
    }
    setJoining(false);
  }

  function handleLocate(lat: number, lon: number, progressFraction: number) {
    if (!uid || !player) return;
    updateMyPosition(uid, player.name, lat, lon, progressFraction).catch(() => {});
    setPositions((prev) => {
      const others = prev.filter((p) => p.uid !== uid);
      return [...others, { uid, name: player.name, lat, lon, progressFraction, updatedAt: Date.now() }];
    });
  }

  function handleBump(field: CounterField, delta: 1 | -1 = 1) {
    if (!uid || !player) return;
    const existing = counters.find((c) => c.uid === uid);
    if (delta < 0 && (!existing || existing[field] <= 0)) return;

    bumpCounter(uid, player.name, field, delta).catch(() => {});
    setCounters((prev) => {
      const found = prev.find((c) => c.uid === uid);
      if (found) {
        return prev.map((c) => (c.uid === uid ? { ...c, [field]: Math.max(0, c[field] + delta) } : c));
      }
      return [
        ...prev,
        {
          uid,
          name: player.name,
          iceCream: 0,
          tisse: 0,
          coffee: 0,
          snack: 0,
          pokemon: 0,
          [field]: 1,
        },
      ];
    });
  }

  if (authError) {
    return (
      <div className="screen center-screen">
        <p>⚠️ Kunne ikke oprette forbindelse. Tjek Firebase-opsætningen (se README).</p>
      </div>
    );
  }

  if (!player) {
    return <Login onJoin={handleJoin} busy={joining} />;
  }

  return (
    <div className="app-shell">
      <div className="app-content">
        {tab === "path" && uid && (
          <AdventurePath
            myUid={uid}
            myName={player.name}
            myEmoji={player.emoji}
            positions={positions}
            onLocate={handleLocate}
          />
        )}
        {tab === "games" && uid && (
          <Games
            myUid={uid}
            myName={player.name}
            myEmoji={player.emoji}
            counters={counters}
            positions={positions}
            players={players}
            onBump={handleBump}
          />
        )}
        {tab === "poke" && <PokeBror onCatch={() => handleBump("pokemon", 1)} />}
        {tab === "quiz" && <Quiz />}
        {tab === "color" && <ColorFace />}
      </div>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}
