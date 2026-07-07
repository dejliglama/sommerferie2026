import type { PokemonType } from "./pokemonify";

export interface CaughtPokemon {
  id: string;
  dataUrl: string;
  name: string;
  type: PokemonType;
  hp: number;
  caughtAt: number;
}

export const MAX_POKEMON = 10;

const KEY = "sommerferie2026-pokedex";

export function loadPokedex(): CaughtPokemon[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function savePokedex(pokedex: CaughtPokemon[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(pokedex));
  } catch {
    // Fx localStorage-kvote overskredet — så mister vi bare persistensen, ikke appen.
  }
}
