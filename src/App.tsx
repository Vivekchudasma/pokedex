import { Routes, Route } from 'react-router-dom';
import { PokemonList } from './components/PokemonList';
import { PokemonDetails } from './components/PokemonDetails';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<PokemonList />} />
        <Route path="/pokemon/:name" element={<PokemonDetails />} />
      </Routes>
    </div>
  );
}

export default App;
