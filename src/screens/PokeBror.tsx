import { useRef, useState } from "react";

const POKE_EMOJIS = ["👉", "💥", "😆", "🫵", "😵", "🤪"];
const MAX_POKES_FOR_SQUISH = 25;

interface Bubble {
  id: number;
  x: number;
  y: number;
  emoji: string;
}

export default function PokeBror() {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [pokeCount, setPokeCount] = useState(0);
  const [shakeKey, setShakeKey] = useState(0);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bubbleId = useRef(0);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
    setPokeCount(0);
  }

  function poke(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = bubbleId.current++;
    const emoji = POKE_EMOJIS[Math.floor(Math.random() * POKE_EMOJIS.length)];
    setBubbles((b) => [...b, { id, x, y, emoji }]);
    setTimeout(() => setBubbles((b) => b.filter((bub) => bub.id !== id)), 800);
    setPokeCount((c) => Math.min(c + 1, MAX_POKES_FOR_SQUISH));
    setShakeKey((k) => k + 1);
  }

  function reset() {
    setPokeCount(0);
    setPhotoUrl(null);
  }

  const scaleX = 1 + (pokeCount / MAX_POKES_FOR_SQUISH) * 0.6;
  const scaleY = Math.max(0.25, 1 - (pokeCount / MAX_POKES_FOR_SQUISH) * 0.75);
  const wiggle = (pokeCount % 2 === 0 ? 1 : -1) * Math.min(pokeCount, 8);

  return (
    <div className="screen pokebror-screen">
      <h2>🫵 PokeBror</h2>
      <p className="instructions">Tag et billede af din bror og prik løs på ham!</p>

      {!photoUrl && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFile}
            style={{ display: "none" }}
          />
          <button className="big-button primary" onClick={() => fileInputRef.current?.click()}>
            📸 Tag billede af bror
          </button>
        </>
      )}

      {photoUrl && (
        <>
          <div className="poke-count-badge">Antal prik: {pokeCount}</div>
          <div className="poke-stage" onClick={poke}>
            <img
              key={shakeKey}
              src={photoUrl}
              alt="Bror"
              className="poke-image"
              style={{
                transform: `scale(${scaleX}, ${scaleY}) rotate(${wiggle}deg)`,
              }}
            />
            {bubbles.map((b) => (
              <span key={b.id} className="poke-bubble" style={{ left: b.x, top: b.y }}>
                {b.emoji}
              </span>
            ))}
          </div>
          {pokeCount >= MAX_POKES_FOR_SQUISH && (
            <p className="max-poke-text">😵‍💫 Han kan ikke blive mere flad!</p>
          )}
          <button className="big-button secondary" onClick={reset}>
            🔄 Nyt billede
          </button>
        </>
      )}
    </div>
  );
}
