import type { CounterField, PlayerCounters } from "../lib/trip";

interface Props {
  myUid: string;
  myName: string;
  myEmoji: string;
  counters: PlayerCounters[];
  onBump: (field: CounterField, delta?: 1 | -1) => void;
}

const COUNTER_CONFIG: { field: CounterField; emoji: string; label: string; buttonLabel: string }[] = [
  { field: "iceCream", emoji: "🍦", label: "Dine is", buttonLabel: "IS" },
  { field: "tisse", emoji: "🚽", label: "Dine tisse-pauser", buttonLabel: "TISSE" },
  { field: "coffee", emoji: "☕", label: "Dine kaffer", buttonLabel: "KAFFE" },
  { field: "snack", emoji: "🍪", label: "Dine slik/snacks", buttonLabel: "SLIK" },
  { field: "pokemon", emoji: "🎾", label: "Dine fangede pokémon", buttonLabel: "POKÉMON" },
];

export default function Games({ myUid, myEmoji, counters, onBump }: Props) {
  const mine = counters.find((c) => c.uid === myUid);

  return (
    <div className="screen games-screen">
      <h2>🎮 Rejse-tællere</h2>

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
    </div>
  );
}
