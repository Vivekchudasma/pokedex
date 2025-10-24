# Pokédex Mini-Challenge

A modern React TypeScript application that displays Pokémon data from the PokeAPI. Built with React Router for navigation and TanStack Query for efficient data fetching and caching. 

### Project Structure
```
src/
├── components/
│   ├── PokemonList.tsx      # Home screen with grid of Pokémon
│   ├── PokemonList.css      # Styles for list view
│   ├── PokemonDetails.tsx   # Detail screen with full Pokémon info
│   └── PokemonDetails.css   # Styles for detail view
├── services/
│   └── pokemonApi.ts        # API service functions
├── types/
│   └── pokemon.ts           # TypeScript interfaces
├── App.tsx                  # Main app with routing
└── main.tsx                 # App entry point with providers
```

## How to Run

### Prerequisites
- Node.js 22+ (use `nvm use 22` if you have nvm)
- npm or yarn

### Installation & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:5173`

## API Integration

The app integrates with the public [PokeAPI](https://pokeapi.co/): 

- **List Endpoint**: `GET https://pokeapi.co/api/v2/pokemon?limit=50&offset=0`
- **Detail Endpoint**: `GET https://pokeapi.co/api/v2/pokemon/{name}`

### Data Flow
1. App loads → TanStack Query fetches Pokémon list
2. User clicks tile → Router navigates to `/pokemon/{name}`
3. Details screen → TanStack Query fetches individual Pokémon data
4. Caching prevents unnecessary API calls when navigating back

## Design Notes & Tradeoffs

### ✅ What's Implemented Well

1. **Performance Optimizations:**
   - Image lazy loading with `loading="lazy"`
   - TanStack Query caching reduces API calls
   - Responsive images and optimized loading states

2. **User Experience:**
   - Smooth loading animations with skeleton screens
   - Error states with retry functionality
   - Mobile-responsive design
   - Accessible navigation with proper ARIA labels

3. **Code Quality:**
   - Full TypeScript coverage with strict types
   - Modular component architecture
   - Clean separation of concerns (API, types, components)
   - Consistent error handling patterns

### 🔄 Tradeoffs Made

1. **Image Loading:**
   - Used GitHub sprites instead of PokeAPI images for better performance
   - Trade-off: Slightly less official, but much faster loading

2. **Styling Approach:**
   - Used CSS modules instead of styled-components or CSS-in-JS
   - Trade-off: More traditional, but easier to maintain and debug

3. **State Management:**
   - TanStack Query instead of Redux for simplicity
   - Trade-off: Perfect for this use case, but wouldn't scale for complex state

## Testing

Currently, no tests are implemented due to time constraints. With more time, I would add:

```bash
# Unit tests
npm run test

# run tests  
npm run test:run
```

## Performance Considerations

- **Bundle Size**: Optimized with Vite's tree-shaking
- **API Calls**: Cached with TanStack Query (5-minute stale time)
- **Images**: Lazy loaded and optimized sprites
- **Responsive**: Mobile-first CSS with efficient grid layouts
