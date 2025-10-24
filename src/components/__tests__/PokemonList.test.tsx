import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { PokemonList } from '../PokemonList';
import { fetchPokemonList } from '../../services/pokemonApi';
import { vi } from 'vitest';
import { describe, it, expect, beforeEach } from 'vitest';

vi.mock('../../services/pokemonApi');
const mockFetchPokemonList = vi.mocked(fetchPokemonList);

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('PokemonList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    mockFetchPokemonList.mockImplementation(() => new Promise(() => {}));
    
    render(
      <TestWrapper>
        <PokemonList />
      </TestWrapper>
    );

    expect(screen.getByText('Pokédex')).toBeInTheDocument();
    const container = screen.getByText('Pokédex').closest('div');
    expect(container?.querySelectorAll('.pokemon-tile.loading')).toHaveLength(50);
  });

  it('renders Pokemon list when data is loaded', async () => {
    const mockPokemonData = {
      count: 50,
      next: null,
      previous: null,
      results: [
        { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
        { name: 'charizard', url: 'https://pokeapi.co/api/v2/pokemon/6/' },
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      ],
    };

    mockFetchPokemonList.mockResolvedValue(mockPokemonData);

    render(
      <TestWrapper>
        <PokemonList />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Pikachu')).toBeInTheDocument();
      expect(screen.getByText('Charizard')).toBeInTheDocument();
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    });
  });

  it('renders error state when API fails', async () => {
    mockFetchPokemonList.mockRejectedValue(new Error('API Error'));

    render(
      <TestWrapper>
        <PokemonList />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('Failed to load Pokemon list. Please try again.')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });
  });

  it('capitalizes Pokemon names correctly', async () => {
    const mockPokemonData = {
      count: 1,
      next: null,
      previous: null,
      results: [
        { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
      ],
    };

    mockFetchPokemonList.mockResolvedValue(mockPokemonData);

    render(
      <TestWrapper>
        <PokemonList />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Pikachu')).toBeInTheDocument();
      expect(screen.queryByText('pikachu')).not.toBeInTheDocument();
    });
  });
});
