import { useState } from "react";

const AVATARS = ["🦁", "🐸", "🐢", "🦊", "🐼", "🐧", "🚀", "🦄", "🐙", "🦖"];

interface Props {
  onJoin: (name: string, emoji: string) => void;
  busy: boolean;
}

export default function Login({ onJoin, busy }: Props) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState(AVATARS[0]);

  return (
    <div className="screen login-screen">
      <div className="login-card">
        <h1>🗺️ Sommerferie 2026</h1>
        <p className="subtitle">Helsingør → Stresa</p>
        <p className="instructions">Vælg dit eventyr-dyr og skriv dit navn for at blive med på turen!</p>

        <div className="avatar-grid">
          {AVATARS.map((a) => (
            <button
              key={a}
              className={`avatar-btn ${emoji === a ? "selected" : ""}`}
              onClick={() => setEmoji(a)}
              type="button"
            >
              {a}
            </button>
          ))}
        </div>

        <input
          className="name-input"
          placeholder="Dit navn"
          value={name}
          maxLength={20}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          className="big-button primary"
          disabled={!name.trim() || busy}
          onClick={() => onJoin(name.trim(), emoji)}
        >
          {busy ? "Opretter..." : `${emoji} Opret mig som spiller!`}
        </button>
      </div>
    </div>
  );
}
