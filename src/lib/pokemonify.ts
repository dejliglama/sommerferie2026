// "Pokemonficerer" et billede rent lokalt i browseren: ingen AI, ingen server —
// bare farve-analyse, et cartoon-agtigt canvas-filter, og sjovt genererede navne/stats.

export type PokemonType = "Ild" | "Vand" | "Natur" | "Elektrisk" | "Spøgelse" | "Normal";

export const TYPE_INFO: Record<PokemonType, { emoji: string; color: string; filter: string }> = {
  Ild: { emoji: "🔥", color: "#ff7043", filter: "saturate(2.1) contrast(1.25) hue-rotate(-6deg) brightness(1.05)" },
  Vand: { emoji: "💧", color: "#42a5f5", filter: "saturate(1.9) contrast(1.15) hue-rotate(190deg)" },
  Natur: { emoji: "🌿", color: "#66bb6a", filter: "saturate(1.8) contrast(1.2) hue-rotate(80deg)" },
  Elektrisk: { emoji: "⚡", color: "#ffca28", filter: "saturate(2.2) brightness(1.15) hue-rotate(35deg)" },
  Spøgelse: { emoji: "👻", color: "#ab7cf7", filter: "saturate(1.6) brightness(0.94) hue-rotate(265deg)" },
  Normal: { emoji: "⭐", color: "#c9b896", filter: "saturate(1.5) contrast(1.15)" },
};

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
  else if (max === g) h = ((b - r) / d + 2) * 60;
  else h = ((r - g) / d + 4) * 60;
  return { h, s, l };
}

function detectType(ctx: CanvasRenderingContext2D, w: number, h: number): PokemonType {
  const { data } = ctx.getImageData(0, 0, w, h);
  let r = 0;
  let g = 0;
  let b = 0;
  let n = 0;
  // Sampler hver 12. pixel for hastighed.
  for (let i = 0; i < data.length; i += 12 * 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    n++;
  }
  r /= n;
  g /= n;
  b /= n;
  const { h: hue, s: sat } = rgbToHsl(r, g, b);

  if (sat < 0.12) return "Normal";
  if (hue < 25 || hue >= 335) return "Ild";
  if (hue < 70) return "Elektrisk";
  if (hue < 160) return "Natur";
  if (hue < 260) return "Vand";
  return "Spøgelse";
}

// Cartoon-agtigt look: reducer antal farvetrin pr. kanal ("posterize"), så billedet
// ligner en tegnet illustration frem for et rent foto.
function posterize(ctx: CanvasRenderingContext2D, w: number, h: number, levels = 5): void {
  const imageData = ctx.getImageData(0, 0, w, h);
  const { data } = imageData;
  const step = 255 / (levels - 1);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.round(Math.round(data[i] / step) * step);
    data[i + 1] = Math.round(Math.round(data[i + 1] / step) * step);
    data[i + 2] = Math.round(Math.round(data[i + 2] / step) * step);
  }
  ctx.putImageData(imageData, 0, 0);
}

const NAME_PREFIXES = ["Bro", "Snack", "Fnis", "Knus", "Pjat", "Fjol", "Turbo", "Mini", "Super", "Glimt", "Vild", "Fart"];
const NAME_SUFFIXES = ["mander", "chu", "zor", "ling", "fnat", "asaur", "potte", "nix", "gon", "ette", "ozor", "fnug"];

function randomName(): string {
  const p = NAME_PREFIXES[Math.floor(Math.random() * NAME_PREFIXES.length)];
  const s = NAME_SUFFIXES[Math.floor(Math.random() * NAME_SUFFIXES.length)];
  return p + s;
}

export interface PokemonifyResult {
  dataUrl: string;
  type: PokemonType;
  name: string;
  hp: number;
}

// Tager et allerede-tegnet source-canvas (billedet fra kameraet) og laver den
// "pokemonficerede" udgave: type ud fra farverne, cartoon-filter, og et navn/HP.
export function pokemonifyImage(source: HTMLCanvasElement): PokemonifyResult {
  const w = source.width;
  const h = source.height;
  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;
  const ctx = out.getContext("2d")!;

  const type = detectType(source.getContext("2d")!, w, h);

  ctx.filter = TYPE_INFO[type].filter;
  ctx.drawImage(source, 0, 0, w, h);
  ctx.filter = "none";
  posterize(ctx, w, h, 6);

  return {
    dataUrl: out.toDataURL("image/jpeg", 0.82),
    type,
    name: randomName(),
    hp: 20 + Math.floor(Math.random() * 80),
  };
}
