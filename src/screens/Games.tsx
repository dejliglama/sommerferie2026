import type { PlayerCounters } from "../lib/trip";

interface Props {
  myUid: string;
  myName: string;
  myEmoji: string;
  counters: PlayerCounters[];
  onBump: (field: "iceCream" | "tisse", delta?: 1 | -1) => void;
}

export default function Games({ myUid, myEmoji, counters, onBump }: Props) {
  const mine = counters.find((c) => c.uid === myUid);
  const totalIce = counters.reduce((s, c) => s + c.iceCream, 0);
  const totalTisse = counters.reduce((s, c) => s + c.tisse, 0);

  return (
    <div className="screen games-screen">
      <h2>🎮 Rejse-tællere</h2>

      <div className="counter-card">
        <div className="counter-emoji">🍦</div>
        <div className="counter-info">
          <span className="counter-label">Dine is</span>
          <span className="counter-number">{mine?.iceCream ?? 0}</span>
        </div>
        <div className="counter-btn-group">
          <button
            className="counter-btn counter-btn-minus"
            onClick={() => onBump("iceCream", -1)}
            disabled={!mine?.iceCream}
            aria-label="Fjern en is"
          >
            −1
          </button>
          <button className="counter-btn" onClick={() => onBump("iceCream", 1)}>
            +1 IS
          </button>
        </div>
      </div>

      <div className="counter-card">
        <div className="counter-emoji">🚽</div>
        <div className="counter-info">
          <span className="counter-label">Dine tisse-pauser</span>
          <span className="counter-number">{mine?.tisse ?? 0}</span>
        </div>
        <div className="counter-btn-group">
          <button
            className="counter-btn counter-btn-minus"
            onClick={() => onBump("tisse", -1)}
            disabled={!mine?.tisse}
            aria-label="Fjern en tisse-pause"
          >
            −1
          </button>
          <button className="counter-btn" onClick={() => onBump("tisse", 1)}>
            +1 TISSE
          </button>
        </div>
      </div>

      <div className="family-total">
        <h3>Familie-total</h3>
        <div className="family-total-row">
          <span>🍦 Is i alt</span>
          <strong>{totalIce}</strong>
        </div>
        <div className="family-total-row">
          <span>🚽 Tisse-pauser i alt</span>
          <strong>{totalTisse}</strong>
        </div>
        <ul className="leaderboard">
          {counters
            .slice()
            .sort((a, b) => b.iceCream - a.iceCream)
            .map((c) => (
              <li key={c.uid}>
                <span>{c.uid === myUid ? myEmoji : "👤"} {c.name}</span>
                <span>🍦 {c.iceCream} · 🚽 {c.tisse}</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
