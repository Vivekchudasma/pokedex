import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchPokemonList, fetchPokemon } from '../pokemonApi';

// Mock fetch globally
(globalThis as any).fetch = vi.fn();

describe('pokemonApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchPokemonList', () => {
    it('should fetch Pokemon list successfully', async () => {
      const mockResponse = {
        count: 50,
        next: null,
        previous: null,
        results: [
          { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
          { name: 'charizard', url: 'https://pokeapi.co/api/v2/pokemon/6/' },
        ],
      };

      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await fetchPokemonList(50, 0);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon?limit=50&offset=0'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when API request fails', async () => {
      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      });

      await expect(fetchPokemonList(50, 0)).rejects.toThrow(
        'Failed to fetch Pokemon list: Not Found'
      );
    });

    it('should use default parameters', async () => {
      const mockResponse = { count: 50, next: null, previous: null, results: [] };
      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await fetchPokemonList();

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon?limit=50&offset=0'
      );
    });
  });

  describe('fetchPokemon', () => {
    it('should fetch Pokemon details successfully', async () => {
      const mockPokemon = {
        id: 25,
        name: 'pikachu',
        height: 4,
        weight: 60,
        sprites: { front_default: 'test.png', front_shiny: null, back_default: null, back_shiny: null },
        types: [],
        abilities: [],
        stats: [],
      };

      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemon,
      });

      const result = await fetchPokemon('pikachu');

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon/pikachu'
      );
      expect(result).toEqual(mockPokemon);
    });

    it('should throw error when Pokemon not found', async () => {
      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      });

      await expect(fetchPokemon('invalid-pokemon')).rejects.toThrow(
        'Failed to fetch Pokemon invalid-pokemon: Not Found'
      );
    });
  });
});
