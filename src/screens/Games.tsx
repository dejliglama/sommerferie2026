import { useState } from "react";
import { deletePlayer, type CounterField, type Player, type PlayerCounters, type PlayerPosition } from "../lib/trip";
import { countriesReached, countriesReachedList, TOTAL_COUNTRIES } from "../lib/countries";

interface Props {
  myUid: string;
  myName: string;
  myEmoji: string;
  counters: PlayerCounters[];
  positions: PlayerPosition[];
  players: Player[];
  onBump: (field: CounterField, delta?: 1 | -1) => void;
}

const COUNTER_CONFIG: { field: CounterField; emoji: string; label: string; buttonLabel: string }[] = [
  { field: "iceCream", emoji: "🍦", label: "Dine is", buttonLabel: "IS" },
  { field: "tisse", emoji: "🚽", label: "Dine tisse-pauser", buttonLabel: "TISSE" },
  { field: "coffee", emoji: "☕", label: "Dine kaffer", buttonLabel: "KAFFE" },
  { field: "snack", emoji: "🍪", label: "Dine slik/snacks", buttonLabel: "SLIK" },
  { field: "pokemon", emoji: "🎾", label: "Dine fangede pokémon", buttonLabel: "POKÉMON" },
];

export default function Games({ myUid, myEmoji, counters, positions, players, onBump }: Props) {
  const mine = counters.find((c) => c.uid === myUid);
  const [deletingUid, setDeletingUid] = useState<string | null>(null);

  // Hele familien kører i samme bil, så "hvor mange lande" er ét fælles tal —
  // baseret på den længst fremme position nogen i familien har bekræftet.
  const familyProgress = positions.reduce((max, p) => Math.max(max, p.progressFraction ?? 0), 0);
  const countryCount = countriesReached(familyProgress);
  const countryFlags = countriesReachedList(familyProgress);

  const isFar = myUid && players.find((p) => p.uid === myUid)?.name.trim().toLowerCase() === "far";

  async function handleDeletePlayer(uid: string, name: string) {
    if (!window.confirm(`Slet spilleren "${name}" og al deres data (position, tællere)? Dette kan ikke fortrydes.`)) {
      return;
    }
    setDeletingUid(uid);
    try {
      await deletePlayer(uid);
    } finally {
      setDeletingUid(null);
    }
  }

  return (
    <div className="screen games-screen">
      <h2>🎮 Rejse-tællere</h2>

      <div className="counter-card country-counter-card">
        <div className="counter-emoji">🌍</div>
        <div className="counter-info">
          <span className="counter-label">Lande på turen</span>
          <span className="counter-number">
            {countryCount}/{TOTAL_COUNTRIES}
          </span>
          <span className="country-flags">{countryFlags.map((c) => c.flag).join(" ")}</span>
        </div>
      </div>

      {COUNTER_CONFIG.map(({ field, emoji, label, buttonLabel }) => (
        <div className="counter-card" key={field}>
          <div className="counter-emoji">{emoji}</div>
          <div className="counter-info">
            <span className="counter-label">{label}</span>
            <span className="counter-number">{mine?.[field] ?? 0}</span>
          </div>
          <div className="counter-btn-group">
            <button
              className="counter-btn counter-btn-minus"
              onClick={() => onBump(field, -1)}
              disabled={!mine?.[field]}
              aria-label={`Fjern en ${buttonLabel.toLowerCase()}`}
            >
              −1
            </button>
            <button className="counter-btn" onClick={() => onBump(field, 1)}>
              +1 {buttonLabel}
            </button>
          </div>
        </div>
      ))}

      <div className="family-total">
        <h3>Familie-total</h3>
        <div className="family-total-row">
          <span>🌍 Lande i alt</span>
          <strong>
            {countryCount}/{TOTAL_COUNTRIES}
          </strong>
        </div>
        {COUNTER_CONFIG.map(({ field, emoji, label }) => (
          <div className="family-total-row" key={field}>
            <span>
              {emoji} {label.replace("Dine ", "").replace(/^./, (c) => c.toUpperCase())} i alt
            </span>
            <strong>{counters.reduce((s, c) => s + c[field], 0)}</strong>
          </div>
        ))}
        <ul className="leaderboard">
          {counters
            .slice()
            .sort((a, b) => b.iceCream - a.iceCream)
            .map((c) => (
              <li key={c.uid}>
                <span>
                  {c.uid === myUid ? myEmoji : "👤"} {c.name}
                </span>
                <span>
                  🍦 {c.iceCream} · 🚽 {c.tisse} · ☕ {c.coffee} · 🍪 {c.snack} · 🎾 {c.pokemon}
                </span>
              </li>
            ))}
        </ul>
      </div>

      {isFar && (
        <div className="admin-panel">
          <h3>🛠️ Admin: Nulstil spillere</h3>
          <p className="admin-hint">Kun synligt for dig, "Far". Sletning fjerner spilleren, deres position og tællere permanent.</p>
          {players.length === 0 && <p className="admin-hint">Ingen spillere endnu.</p>}
          <ul className="admin-player-list">
            {players.map((p) => (
              <li key={p.uid}>
                <span>
                  {p.emoji} {p.name}
                  {p.uid === myUid && " (dig)"}
                </span>
                <button
                  className="admin-delete-btn"
                  onClick={() => handleDeletePlayer(p.uid, p.name)}
                  disabled={deletingUid === p.uid}
                >
                  {deletingUid === p.uid ? "Sletter…" : "🗑️ Slet"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
