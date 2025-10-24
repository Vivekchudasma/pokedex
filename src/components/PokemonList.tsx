import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchPokemonList } from '../services/pokemonApi';
import type { PokemonListItem } from '../types/pokemon';
import './PokemonList.css';

interface PokemonTileProps {
  pokemon: PokemonListItem;
}

const PokemonTile = ({ pokemon }: PokemonTileProps) => {
  const pokemonId = pokemon.url.split('/').slice(-2, -1)[0];
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
  const capitalizedName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  return (
    <Link to={`/pokemon/${pokemon.name}`} className="pokemon-tile">
      <div className="pokemon-image-container">
        <img
          src={imageUrl}
          alt={capitalizedName}
          className="pokemon-image"
          loading="lazy"
        />
      </div>
      <h3 className="pokemon-name">{capitalizedName}</h3>
    </Link>
  );
};

const LoadingSkeleton = () => (
  <div className="pokemon-tile loading">
    <div className="pokemon-image-container">
      <div className="skeleton skeleton-image"></div>
    </div>
    <div className="skeleton skeleton-text"></div>
  </div>
);

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div className="error-state">
    <h2>Oops! Something went wrong</h2>
    <p>Failed to load Pokemon list. Please try again.</p>
    <button onClick={onRetry} className="retry-button">
      Retry
    </button>
  </div>
);

export const PokemonList = () => {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['pokemonList'],
    queryFn: () => fetchPokemonList(50, 0),
  });

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  return (
    <div className="pokemon-list-container">
      <h1 className="page-title">Pokédex</h1>
      <div className="pokemon-grid">
        {isLoading
          ? Array.from({ length: 50 }).map((_, index) => (
              <LoadingSkeleton key={index} />
            ))
          : data?.results.map((pokemon) => (
              <PokemonTile key={pokemon.name} pokemon={pokemon} />
            ))}
      </div>
    </div>
  );
};
