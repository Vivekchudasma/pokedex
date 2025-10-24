import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { PokemonDetails } from '../PokemonDetails';
import { fetchPokemon } from '../../services/pokemonApi';
import { vi } from 'vitest';
import { describe, it, expect, beforeEach } from 'vitest';

vi.mock('../../services/pokemonApi');
const mockFetchPokemon = vi.mocked(fetchPokemon);


describe('PokemonDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Pokemon details when data is loaded', async () => {
    const mockPokemonData = {
      id: 25,
      name: 'pikachu',
      height: 4,
      weight: 60,
      sprites: {
        front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
        front_shiny: null,
        back_default: null,
        back_shiny: null,
      },
      types: [
        {
          slot: 1,
          type: { name: 'electric', url: 'https://pokeapi.co/api/v2/type/13/' },
        },
      ],
      abilities: [
        {
          slot: 1,
          is_hidden: false,
          ability: { name: 'static', url: 'https://pokeapi.co/api/v2/ability/9/' },
        },
      ],
      stats: [
        {
          base_stat: 35,
          effort: 0,
          stat: { name: 'hp', url: 'https://pokeapi.co/api/v2/stat/1/' },
        },
        {
          base_stat: 55,
          effort: 0,
          stat: { name: 'attack', url: 'https://pokeapi.co/api/v2/stat/2/' },
        },
      ],
    };

    mockFetchPokemon.mockResolvedValue(mockPokemonData);

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    render(
      <MemoryRouter initialEntries={['/pokemon/pikachu']}>
        <QueryClientProvider client={queryClient}>
          <PokemonDetails />
        </QueryClientProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Back to Pokédex')).toBeInTheDocument();
    });
  });

  it('renders error state when Pokemon is not found', async () => {
    mockFetchPokemon.mockRejectedValue(new Error('Pokemon not found'));

    render(
      <MemoryRouter initialEntries={['/pokemon/invalid-pokemon']}>
        <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
          <PokemonDetails />
        </QueryClientProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Pokemon not found')).toBeInTheDocument();
      expect(screen.getByText('The Pokemon you\'re looking for doesn\'t exist or there was an error loading it.')).toBeInTheDocument();
    });
  });

  it('displays back button to navigate to list', async () => {
    const mockPokemonData = {
      id: 25,
      name: 'pikachu',
      height: 4,
      weight: 60,
      sprites: { front_default: 'test.png', front_shiny: null, back_default: null, back_shiny: null },
      types: [],
      abilities: [],
      stats: [],
    };

    mockFetchPokemon.mockResolvedValue(mockPokemonData);

    render(
      <MemoryRouter initialEntries={['/pokemon/pikachu']}>
        <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
          <PokemonDetails />
        </QueryClientProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      const backButton = screen.getByRole('link', { name: /back to pokédex/i });
      expect(backButton).toBeInTheDocument();
      expect(backButton).toHaveAttribute('href', '/');
    });
  });
});
