import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Zap, Shield, Swords } from 'lucide-react';
import { fetchPokemon } from '../services/pokemonApi';
import './PokemonDetails.css';

const StatBar = ({ name, value, max = 255 }: { name: string; value: number; max?: number }) => {
  const percentage = (value / max) * 100;
  
  const getStatColor = (statName: string) => {
    switch (statName.toLowerCase()) {
      case 'hp':
        return '#e74c3c';
      case 'attack':
        return '#f39c12';
      case 'defense':
        return '#3498db';
      case 'special-attack':
        return '#9b59b6';
      case 'special-defense':
        return '#2ecc71';
      case 'speed':
        return '#f1c40f';
      default:
        return '#95a5a6';
    }
  };

  const getStatIcon = (statName: string) => {
    switch (statName.toLowerCase()) {
      case 'hp':
        return <Heart size={16} />;
      case 'attack':
        return <Swords size={16} />;
      case 'defense':
        return <Shield size={16} />;
      case 'special-attack':
        return <Zap size={16} />;
      case 'special-defense':
        return <Shield size={16} />;
      case 'speed':
        return <Zap size={16} />;
      default:
        return null;
    }
  };

  return (
    <div className="stat-item">
      <div className="stat-header">
        <span className="stat-icon">{getStatIcon(name)}</span>
        <span className="stat-name">{name.replace('-', ' ').toUpperCase()}</span>
        <span className="stat-value">{value}</span>
      </div>
      <div className="stat-bar">
        <div
          className="stat-fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: getStatColor(name),
          }}
        />
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="pokemon-details loading">
    <div className="back-button">
      <div className="skeleton skeleton-button"></div>
    </div>
    <div className="pokemon-header">
      <div className="skeleton skeleton-image-large"></div>
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-subtitle"></div>
    </div>
    <div className="pokemon-info">
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-text"></div>
    </div>
  </div>
);

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div className="error-state">
    <h2>Pokemon not found</h2>
    <p>The Pokemon you're looking for doesn't exist or there was an error loading it.</p>
    <div className="error-actions">
      <button onClick={onRetry} className="retry-button">
        Retry
      </button>
      <Link to="/" className="back-button-link">
        Back to Pokédex
      </Link>
    </div>
  </div>
);

export const PokemonDetails = () => {
  const { name } = useParams<{ name: string }>();
  
  const {
    data: pokemon,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['pokemon', name],
    queryFn: () => fetchPokemon(name!),
    enabled: !!name,
  });

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!pokemon) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  const capitalizedName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  const heightInMeters = pokemon.height / 10;
  const weightInKg = pokemon.weight / 10;

  return (
    <div className="pokemon-details">
      <Link to="/" className="back-button">
        <ArrowLeft size={20} />
        Back to Pokédex
      </Link>

      <div className="pokemon-header">
        <div className="pokemon-image-container">
          <img
            src={pokemon.sprites.front_default || '/placeholder-pokemon.png'}
            alt={capitalizedName}
            className="pokemon-image-large"
          />
        </div>
        <div className="pokemon-info-header">
          <h1 className="pokemon-name-large">{capitalizedName}</h1>
          <p className="pokemon-id">#{pokemon.id.toString().padStart(3, '0')}</p>
        </div>
      </div>

      <div className="pokemon-info">
        <div className="info-section">
          <h3>Physical Stats</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Height</span>
              <span className="info-value">{heightInMeters}m</span>
            </div>
            <div className="info-item">
              <span className="info-label">Weight</span>
              <span className="info-value">{weightInKg}kg</span>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h3>Types</h3>
          <div className="types-container">
            {pokemon.types.map((type) => (
              <span
                key={type.type.name}
                className={`type-badge type-${type.type.name}`}
              >
                {type.type.name.toUpperCase()}
              </span>
            ))}
          </div>
        </div>

        <div className="info-section">
          <h3>Abilities</h3>
          <div className="abilities-container">
            {pokemon.abilities.map((ability) => (
              <span
                key={ability.ability.name}
                className={`ability-badge ${ability.is_hidden ? 'hidden' : ''}`}
              >
                {ability.ability.name.replace('-', ' ').toUpperCase()}
                {ability.is_hidden && ' (Hidden)'}
              </span>
            ))}
          </div>
        </div>

        <div className="info-section">
          <h3>Base Stats</h3>
          <div className="stats-container">
            {pokemon.stats.map((stat) => (
              <StatBar
                key={stat.stat.name}
                name={stat.stat.name}
                value={stat.base_stat}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
