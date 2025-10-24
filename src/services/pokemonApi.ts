import type { PokemonListResponse, Pokemon } from '../types/pokemon';

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

export const fetchPokemonList = async (
  limit: number = 50,
  offset: number = 0
): Promise<PokemonListResponse> => {
  const response = await fetch(
    `${POKEAPI_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon list: ${response.statusText}`);
  }
  
  return response.json();
};

export const fetchPokemon = async (name: string): Promise<Pokemon> => {
  const response = await fetch(`${POKEAPI_BASE_URL}/pokemon/${name}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon ${name}: ${response.statusText}`);
  }
  
  return response.json();
};
