import { useEffect, useRef, useState } from "react";
import { pokemonifyImage, TYPE_INFO, type PokemonType } from "../lib/pokemonify";
import { loadPokedex, savePokedex, MAX_POKEMON, type CaughtPokemon } from "../lib/pokedex";

interface Props {
  onCatch?: () => void;
}

type Phase = "idle" | "throwing" | "shaking" | "caught" | "escaped" | "fled";

interface Encounter {
  dataUrl: string;
  type: PokemonType;
  name: string;
  hp: number;
}

// Højere KP = sværere at fange. Spænder ca. 85% (lav KP) ned til 35% (høj KP).
function catchChanceForHp(hp: number): number {
  const t = Math.min(1, Math.max(0, (hp - 20) / 80));
  return 0.85 - t * 0.5;
}

export default function PokeBror({ onCatch }: Props) {
  const [caught, setCaught] = useState<CaughtPokemon[]>(() => loadPokedex());
  const [encounter, setEncounter] = useState<Encounter | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [attempts, setAttempts] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const shakeCountRef = useRef(3);

  useEffect(() => {
    savePokedex(caught);
  }, [caught]);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const maxW = 360;
      const scale = Math.min(1, maxW / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const result = pokemonifyImage(canvas);
      setEncounter({ dataUrl: result.dataUrl, type: result.type, name: result.name, hp: result.hp });
      setAttempts(0);
      setPhase("idle");
      URL.revokeObjectURL(url);
    };
    img.src = url;
    e.target.value = "";
  }

  function throwBall() {
    if (!encounter || phase === "throwing" || phase === "shaking") return;
    const attemptNumber = attempts;
    setAttempts((a) => a + 1);
    setPhase("throwing");

    setTimeout(() => {
      // Lidt varierende antal ryst — nogle kast afgøres hurtigt, andre trækker ud.
      shakeCountRef.current = 2 + Math.floor(Math.random() * 3);
      setPhase("shaking");

      setTimeout(() => {
        const baseChance = catchChanceForHp(encounter.hp);
        const decay = Math.pow(0.8, attemptNumber); // sværere for hvert nyt kast mod samme pokémon
        const jitter = (Math.random() - 0.5) * 0.12;
        const chance = Math.min(0.95, Math.max(0.05, baseChance * decay + jitter));
        const success = Math.random() < chance;

        if (success) {
          setPhase("caught");
          setCaught((prev) =>
            [
              ...prev,
              {
                id: `${Date.now()}`,
                dataUrl: encounter.dataUrl,
                name: encounter.name,
                type: encounter.type,
                hp: encounter.hp,
                caughtAt: Date.now(),
              },
            ].slice(0, MAX_POKEMON)
          );
          onCatch?.();
        } else {
          // Jo flere gange den er undsluppet, jo større chance for at den stikker helt af.
          const fleeChance = 0.3 + attemptNumber * 0.15;
          setPhase(Math.random() < fleeChance ? "fled" : "escaped");
        }
      }, shakeCountRef.current * 320 + 200);
    }, 500);
  }

  function nextEncounter() {
    setEncounter(null);
    setPhase("idle");
    setAttempts(0);
  }

  const pokedexFull = caught.length >= MAX_POKEMON;

  return (
    <div className="screen pokebror-screen">
      <h2>🎾 PokeBror</h2>
      <p className="instructions">
        Tag et billede af din bror (eller et dyr!) — det bliver til en vild pokémon, som du skal fange med en Pokéball!
      </p>

      {!encounter && !pokedexFull && (
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
            📸 Tag billede
          </button>
        </>
      )}

      {!encounter && pokedexFull && (
        <p className="pokedex-full-text">🎉 Pokédex fuld! Du har fanget alle {MAX_POKEMON} pokémon.</p>
      )}

      {encounter && (
        <div className="encounter-wrap">
          <div
            className={`encounter-card ${phase === "shaking" ? "shaking" : ""} ${phase === "caught" ? "caught-flash" : ""}`}
            style={{
              borderColor: TYPE_INFO[encounter.type].color,
              animationIterationCount: phase === "shaking" ? shakeCountRef.current : undefined,
            }}
          >
            <div className="encounter-type-badge" style={{ background: TYPE_INFO[encounter.type].color }}>
              {TYPE_INFO[encounter.type].emoji} {encounter.type}
            </div>
            <img src={encounter.dataUrl} alt={encounter.name} className="encounter-image" />
            <div className="encounter-name">{encounter.name}</div>
            <div className="encounter-hp">KP {encounter.hp}</div>
            {phase === "throwing" && <span className="pokeball-throw">⚾</span>}
          </div>

          {phase === "idle" && (
            <button className="big-button primary" onClick={throwBall}>
              ⚾ Kast Pokéball!
            </button>
          )}
          {phase === "throwing" && (
            <button className="big-button primary" disabled>
              🎯 Kaster...
            </button>
          )}
          {phase === "shaking" && (
            <button className="big-button primary" disabled>
              📦 Ryster...
            </button>
          )}

          {phase === "caught" && (
            <>
              <p className="catch-result caught">🎉 Fanget! {encounter.name} er nu i din Pokédex!</p>
              <button className="big-button primary" onClick={nextEncounter}>
                {pokedexFull ? "Se Pokédex" : "📸 Fang en til"}
              </button>
            </>
          )}

          {phase === "escaped" && (
            <>
              <p className="catch-result escaped">💨 Den slap væk! Prøv igen?</p>
              <div className="button-row">
                <button className="big-button primary" onClick={throwBall}>
                  ⚾ Kast igen
                </button>
                <button className="big-button secondary" onClick={nextEncounter}>
                  Giv op
                </button>
              </div>
            </>
          )}

          {phase === "fled" && (
            <>
              <p className="catch-result fled">💨🏃 Den stak helt af! Den kommer ikke tilbage.</p>
              <button className="big-button primary" onClick={nextEncounter}>
                📸 Nyt billede
              </button>
            </>
          )}
        </div>
      )}

      {caught.length > 0 && (
        <div className="pokedex-gallery">
          <h3>
            Din Pokédex ({caught.length}/{MAX_POKEMON})
          </h3>
          <div className="pokedex-grid">
            {caught.map((p) => (
              <div key={p.id} className="pokedex-item" style={{ borderColor: TYPE_INFO[p.type].color }}>
                <img src={p.dataUrl} alt={p.name} />
                <span className="pokedex-item-name">{p.name}</span>
                <span className="pokedex-item-type">{TYPE_INFO[p.type].emoji}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
