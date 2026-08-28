// App.jsx
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">🎬 WatchNext</div>
        {isHome && (
          <div className="search-section">
            <input type="text" placeholder="Recherche..." className="search-input" />
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

function Accueil() {
  return (
    <section>
      <div className="results-section">
        <div className="movie-card">
          <img src="" alt="Affiche du film" />
          <h3>Titre du film</h3>
        </div>
      </div>
    </section>
  );
}

function Films() {
  return <h2>Page Films</h2>;
}

function Favoris() {
  return <h2>Page Favoris</h2>;
}

function APropos() {
  return <h2>Page À propos</h2>;
}

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