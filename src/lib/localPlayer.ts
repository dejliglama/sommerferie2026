export interface LocalPlayer {
  name: string;
  emoji: string;
}

const KEY = "sommerferie2026-player";

export function loadLocalPlayer(): LocalPlayer | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LocalPlayer;
  } catch {
    return null;
  }
}

export function saveLocalPlayer(player: LocalPlayer): void {
  localStorage.setItem(KEY, JSON.stringify(player));
}

export function clearLocalPlayer(): void {
  localStorage.removeItem(KEY);
}
