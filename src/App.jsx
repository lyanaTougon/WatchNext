// App.jsx
import { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import './index.css';

// Liste des films choisis, avec TES propres images.
// Les images doivent être dans le dossier public/images/
// (donc le fichier réel est à : public/images/evil-dead-burn.jpeg)
// Le chemin ici commence par /images/... et PAS /public/images/...
const MOVIES = [
  {
    title: "Evil Dead Burn",
    poster: "/images/evil-dead-burn.jpeg",
    banner: "/images/evil-dead-burn-banner.jpeg",
  },
  {
    title: "L'odysée",
    poster: "/images/lodyssee.jpeg",
    banner: "/images/lodyssee-banner.webp",
  },
  {
    title: "Une série",
    poster: "/images/ma-serie.jpeg",
    banner: "/images/ma-serie-banner.png",
  },
];

// Films "récemment ajoutés" affichés dans la colonne de droite.
// Tu peux réutiliser MOVIES ou faire une liste séparée si besoin.
const RECENTLY_ADDED = [
  {
    title: "Evil Dead Burn",
    poster: "/images/evil-dead-burn.jpeg",
  },
  {
    title: "L'odysée",
    poster: "/images/lodyssee.jpeg",
  },
  {
    title: "Une série",
    poster: "/images/ma-serie.jpeg",
  },
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

  const handleVoirPlus = () => {
    // à remplacer par ta logique (ex: navigate vers une page détail)
    console.log("Voir plus :", current.title);
  };

  return (
    <div className="carousel">
      <div className="carousel-slide">
        <img src={current.banner || current.poster} alt={current.title} />

        <h3>{current.title}</h3>

        <button className="carousel-more-button" onClick={handleVoirPlus}>
          Voir plus
        </button>

        <div className="carousel-arrows">
          <button className="carousel-arrow" onClick={prevSlide}>‹</button>
          <button className="carousel-arrow" onClick={nextSlide}>›</button>
        </div>
      </div>
    </div>
  );
}

// ---------------------- SIDEBAR (RÉCEMMENT AJOUTÉS) ----------------------
function Sidebar({ movies }) {
  return (
    <aside className="home-sidebar">
      <h2>Récemment ajoutés</h2>
      {movies.map((movie) => (
        <div className="sidebar-movie" key={movie.title}>
          <img src={movie.poster} alt={movie.title} />
          <div className="sidebar-movie-info">
            <h4>{movie.title}</h4>
            <p>Ajouté récemment</p>
          </div>
        </div>
      ))}
    </aside>
  );
}

// ---------------------- ACCUEIL ----------------------
function Accueil() {
  const handleAdd = (movie) => {
    // à remplacer par ta logique (ex: ajouter aux favoris)
    console.log("Ajouté aux favoris :", movie.title);
  };

  return (
    <div className="home-layout">
      <div className="home-main">
        <Carousel movies={MOVIES} />

        <div className="results-section">
          {MOVIES.map((movie) => (
            <div className="movie-card" key={movie.title}>
              <button
                className="movie-card-add"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAdd(movie);
                }}
              >
                +
              </button>
              <img src={movie.poster} alt={movie.title} />
              <h3>{movie.title}</h3>
            </div>
          ))}
        </div>
      </div>

      <Sidebar movies={RECENTLY_ADDED} />
    </div>
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