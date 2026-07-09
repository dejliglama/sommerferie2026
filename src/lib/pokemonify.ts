// "Pokemonficerer" et billede rent lokalt i browseren: ingen AI, ingen server —
// bare farve-analyse, et cartoon-agtigt canvas-filter, tilfældige pynte-effekter,
// og sjovt genererede navne/stats. Ingen to fangster ser helt ens ud.

export type PokemonType = "Ild" | "Vand" | "Natur" | "Elektrisk" | "Spøgelse" | "Normal";

interface FilterBase {
  saturate: number;
  contrast: number;
  hueRotate: number;
  brightness: number;
}

export const TYPE_INFO: Record<PokemonType, { emoji: string; color: string; filterBase: FilterBase }> = {
  Ild: { emoji: "🔥", color: "#ff7043", filterBase: { saturate: 2.1, contrast: 1.25, hueRotate: -6, brightness: 1.05 } },
  Vand: { emoji: "💧", color: "#42a5f5", filterBase: { saturate: 1.9, contrast: 1.15, hueRotate: 190, brightness: 1.0 } },
  Natur: { emoji: "🌿", color: "#66bb6a", filterBase: { saturate: 1.8, contrast: 1.2, hueRotate: 80, brightness: 1.0 } },
  Elektrisk: { emoji: "⚡", color: "#ffca28", filterBase: { saturate: 2.2, contrast: 1.1, hueRotate: 35, brightness: 1.15 } },
  Spøgelse: { emoji: "👻", color: "#ab7cf7", filterBase: { saturate: 1.6, contrast: 1.1, hueRotate: 265, brightness: 0.94 } },
  Normal: { emoji: "⭐", color: "#c9b896", filterBase: { saturate: 1.5, contrast: 1.15, hueRotate: 0, brightness: 1.0 } },
};

function jitter(v: number, amount: number): number {
  return v + (Math.random() - 0.5) * amount;
}

// Bygger et filter ud fra typens "grundopskrift", men med lidt tilfældig variation
// hver gang, så samme type stadig kan se forskellig ud fra fangst til fangst.
function buildFilter(type: PokemonType): string {
  const b = TYPE_INFO[type].filterBase;
  const sat = Math.max(0.5, jitter(b.saturate, 0.5));
  const con = Math.max(0.7, jitter(b.contrast, 0.25));
  const hue = jitter(b.hueRotate, 24);
  const bri = Math.max(0.6, jitter(b.brightness, 0.18));
  return `saturate(${sat.toFixed(2)}) contrast(${con.toFixed(2)}) hue-rotate(${hue.toFixed(0)}deg) brightness(${bri.toFixed(2)})`;
}

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
// ligner en tegnet illustration frem for et rent foto. Niveauet varieres tilfældigt.
function posterize(ctx: CanvasRenderingContext2D, w: number, h: number, levels: number): void {
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

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Mørk kant rundt om billedet i typens farve, for et lidt mere dramatisk "wild encounter"-look.
function drawVignette(ctx: CanvasRenderingContext2D, w: number, h: number, color: string): void {
  const grad = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.32, w / 2, h / 2, Math.max(w, h) * 0.72);
  grad.addColorStop(0, "rgba(0,0,0,0)");
  grad.addColorStop(1, hexToRgba(color, 0.5));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

const SPARKLE_GLYPHS = ["✨", "⭐", "💫"];

// Strør et par glimmer-symboler tilfældigt ud over billedet.
function drawSparkles(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const count = 3 + Math.floor(Math.random() * 4);
  for (let i = 0; i < count; i++) {
    const glyph = SPARKLE_GLYPHS[Math.floor(Math.random() * SPARKLE_GLYPHS.length)];
    const size = 14 + Math.random() * 18;
    ctx.save();
    ctx.translate(Math.random() * w, Math.random() * h);
    ctx.rotate((Math.random() - 0.5) * 0.8);
    ctx.font = `${size}px sans-serif`;
    ctx.globalAlpha = 0.75 + Math.random() * 0.25;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(glyph, 0, 0);
    ctx.restore();
  }
}

// Bager typens eget emoji ind i hjørnet/hjørnerne, ligesom et lille "klistermærke".
function drawCornerStickers(ctx: CanvasRenderingContext2D, w: number, h: number, emoji: string): void {
  const size = Math.max(22, Math.min(w, h) * 0.14);
  ctx.save();
  ctx.font = `${size}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.globalAlpha = 0.9;
  ctx.fillText(emoji, size * 0.7, size * 0.7);
  if (Math.random() < 0.5) {
    ctx.fillText(emoji, w - size * 0.7, h - size * 0.7);
  }
  ctx.restore();
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
// "pokemonficerede" udgave: type ud fra farverne, cartoon-filter (med variation),
// et par tilfældige pynte-effekter, og et navn/HP.
export function pokemonifyImage(source: HTMLCanvasElement): PokemonifyResult {
  const w = source.width;
  const h = source.height;
  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;
  const ctx = out.getContext("2d")!;

  const type = detectType(source.getContext("2d")!, w, h);

  ctx.save();
  if (Math.random() < 0.15) {
    // Et lille skvæt variation: nogle gange spejlvendt.
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
  }
  ctx.filter = buildFilter(type);
  ctx.drawImage(source, 0, 0, w, h);
  ctx.restore();
  ctx.filter = "none";

  posterize(ctx, w, h, 4 + Math.floor(Math.random() * 5));

  if (Math.random() < 0.45) drawVignette(ctx, w, h, TYPE_INFO[type].color);
  if (Math.random() < 0.55) drawSparkles(ctx, w, h);
  if (Math.random() < 0.6) drawCornerStickers(ctx, w, h, TYPE_INFO[type].emoji);

  return {
    dataUrl: out.toDataURL("image/jpeg", 0.85),
    type,
    name: randomName(),
    hp: 20 + Math.floor(Math.random() * 80),
  };
}
