import type { PlayerCounters } from "../lib/trip";

interface Props {
  myUid: string;
  myName: string;
  myEmoji: string;
  counters: PlayerCounters[];
  onBump: (field: "iceCream" | "tisse") => void;
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
        <button className="counter-btn" onClick={() => onBump("iceCream")}>
          +1 IS
        </button>
      </div>

      <div className="counter-card">
        <div className="counter-emoji">🚽</div>
        <div className="counter-info">
          <span className="counter-label">Dine tisse-pauser</span>
          <span className="counter-number">{mine?.tisse ?? 0}</span>
        </div>
        <button className="counter-btn" onClick={() => onBump("tisse")}>
          +1 TISSE
        </button>
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
