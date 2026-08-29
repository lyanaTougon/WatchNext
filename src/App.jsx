// App.jsx
import { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';

// Liste des films choisis, avec TES propres images.
// Les images doivent être dans le dossier public/images/
// (donc le fichier réel est à : public/images/evil-dead-burn.jpeg)
// Le chemin ici commence par /images/... et PAS /public/images/...
const MOVIES = [
  { title: "Evil Dead Burn", poster: "/images/evil-dead-burn.jpeg" },
];

// ---------------------- NAVBAR ----------------------
function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">🎬 WatchNext</div>
        {isHome && (
          <div className="search-section">
            <input
              type="text"
              placeholder="Recherche..."
              className="search-input"
            />
            <button className="search-button">Rechercher</button>
          </div>
        )}
      </div>
      <div className="navbar-links">
        <NavLink to="/" end>Accueil</NavLink>
        <NavLink to="/films">Films</NavLink>
        <NavLink to="/series">Séries</NavLink>
        <NavLink to="/favoris">Favoris</NavLink>
        <NavLink to="/note">Notes</NavLink>
        <NavLink to="/apropos">À propos</NavLink>
      </div>
    </nav>
  );
}

// ---------------------- CAROUSEL ----------------------
function Carousel({ movies }) {
  const [index, setIndex] = useState(0);

  if (!movies || movies.length === 0) return null;

  const current = movies[Math.min(index, movies.length - 1)];

  const prevSlide = () => {
    setIndex((i) => (i === 0 ? movies.length - 1 : i - 1));
  };

  const nextSlide = () => {
    setIndex((i) => (i === movies.length - 1 ? 0 : i + 1));
  };

  return (
    <div className="carousel">
      <button className="carousel-arrow left" onClick={prevSlide}>‹</button>

      <div className="carousel-slide">
        <img src={current.poster} alt={current.title} />
        <h3>{current.title}</h3>
      </div>

      <button className="carousel-arrow right" onClick={nextSlide}>›</button>
    </div>
  );
}

// ---------------------- ACCUEIL ----------------------
function Accueil() {
  return (
    <section>
      <Carousel movies={MOVIES} />

      <div className="results-section">
        {MOVIES.map((movie) => (
          <div className="movie-card" key={movie.title}>
            <img src={movie.poster} alt={movie.title} />
            <h3>{movie.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------------------- AUTRES PAGES ----------------------
function Films() {
  return <h2>Page Films</h2>;
}

function Favoris() {
  return <h2>Page Favoris</h2>;
}

function APropos() {
  return <h2>Page À propos</h2>;
}

// ---------------------- APP ----------------------
function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="header">
          <Navbar />
        </header>

        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/films" element={<Films />} />
          <Route path="/favoris" element={<Favoris />} />
          <Route path="/apropos" element={<APropos />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;