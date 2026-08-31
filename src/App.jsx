// App.jsx
import { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import './index.css';
import './App.css';

// Clé API OMDb (Open Movie Database) — récupérée sur https://www.omdbapi.com/apikey.aspx
const OMDB_API_KEY = "c73348c8";

// ============================================================
// FILMS DU CAROUSEL (bandeau du haut)
// ============================================================
// Les images doivent être dans le dossier public/images/
// (donc le fichier réel est à : public/images/evil-dead-burn.jpeg)
// Le chemin ici commence par /images/... et PAS /public/images/...
//
// "id" sert à construire l'URL de la page détail (/film/:id).
// "trailer" est l'URL d'embed YouTube (format https://www.youtube.com/embed/XXXXXXXX).
const CAROUSEL_MOVIES = [
  {
    id: "lodyssee",
    title: "L'odysée",
    genre: "Aventure",
    synopsis: "Un voyage épique à travers des mondes inconnus, entre péril et découverte.",
    poster: "/images/lodyssee.jpeg",
    banner: "/images/lodyssee-banner.png",
    background: "linear-gradient(to bottom, rgb(7, 7, 7), rgb(124, 74, 17))",
    trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ", // à remplacer par le vrai trailer
  },
  {
    id: "girl-from-nowhere",
    title: "Girl From Nowhere",
    genre: "Série",
    synopsis: "Une histoire captivante mêlant suspense, émotion et rebondissements.",
    poster: "/images/girl-from-nowhere.jpeg",
    banner: "/images/girl-from-nowhere-banner.jpeg",
    background: "linear-gradient(to bottom, rgb(140, 148, 180), rgb(100, 110, 185))",
    trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ", // à remplacer par le vrai trailer
  },
  {
    id: "evil-dead-burn",
    title: "Evil Dead Burn",
    genre: "Horreur",
    synopsis: "Une nuit de terreur où le mal ancien se réveille et ne laisse aucune chance à ses victimes.",
    poster: "/images/evil-dead-burn.jpeg",
    banner: "/images/evil-dead-burn-banner.jpeg",
    background: "linear-gradient(to bottom, rgb(120, 0, 0), rgb(0, 0, 0))",
    trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ", // à remplacer par le vrai trailer
  },
];

// ============================================================
// FILMS DES CARTES (grille en dessous du carousel)
// ============================================================
// Liste INDÉPENDANTE du carousel — ajoute ici tes propres films/séries,
// même s'ils sont différents de ceux du carousel.
const CARD_MOVIES = [
  {
    id: "lodyssee",
    title: "L'odysée",
    genre: "Aventure",
    synopsis: "Un voyage épique à travers des mondes inconnus, entre péril et découverte.",
    poster: "/images/lodyssee.jpeg",
    trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "girl-from-nowhere",
    title: "Girl From Nowhere",
    genre: "Série",
    synopsis: "Une histoire captivante mêlant suspense, émotion et rebondissements.",
    poster: "/images/girl-from-nowhere.jpeg",
    trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "evil-dead-burn",
    title: "Evil Dead Burn",
    genre: "Horreur",
    synopsis: "Une nuit de terreur où le mal ancien se réveille et ne laisse aucune chance à ses victimes.",
    poster: "/images/evil-dead-burn.jpeg",
    trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  // Ajoute d'autres films/séries ici librement, sans toucher au carousel.
];

// Liste combinée utilisée uniquement pour retrouver un film par son id
// (nécessaire pour que la page détail fonctionne peu importe d'où vient le clic).
const ALL_MOVIES = [...CAROUSEL_MOVIES, ...CARD_MOVIES];

function findMovieById(id) {
  // On évite les doublons si le même id existe dans les deux listes
  return ALL_MOVIES.find((m) => m.id === id);
}

// ---------------------- SIDEBAR (VERTICALE, GAUCHE) ----------------------
function Sidebar() {
  return (
    <nav className="sidebar">
      <div className="sidebar-logo">🎬 WatchNext</div>
      <ul className="sidebar-links">
        <li><NavLink to="/" end>Accueil</NavLink></li>
        <li><NavLink to="/favoris">Favoris</NavLink></li>
        <li><NavLink to="/note">Notes</NavLink></li>
        <li><NavLink to="/apropos">À propos</NavLink></li>
      </ul>
    </nav>
  );
}

// ---------------------- TOP NAVBAR (FILMS / SÉRIES) ----------------------
function TopNavbar() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="top-navbar">
      <ul className="top-navbar-links">
        <li><NavLink to="/films">Films</NavLink></li>
        <li><NavLink to="/series">Séries</NavLink></li>
      </ul>
      <div className="top-navbar-right">
        {!isHome && (
          <div className="search-section">
            <input
              type="text"
              placeholder="Recherche..."
              className="search-input"
            />
            <button className="search-button">Rechercher</button>
          </div>
        )}
        <button className="user-icon" aria-label="Se connecter" title="Se connecter">
          👤
        </button>
      </div>
    </div>
  );
}

// ---------------------- CAROUSEL ----------------------
function Carousel({ movies }) {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  const hasMovies = movies && movies.length > 0;
  const current = hasMovies ? movies[Math.min(index, movies.length - 1)] : null;

  // Applique la couleur/dégradé du film affiché dans le carousel au fond de toute la page
  useEffect(() => {
    if (!current) return;

    document.body.style.background = current.background || "#c5c4c4";

    return () => {
      document.body.style.background = "";
    };
  }, [current]);

  if (!hasMovies) return null;

  const prevSlide = () => {
    setIndex((i) => (i === 0 ? movies.length - 1 : i - 1));
  };

  const nextSlide = () => {
    setIndex((i) => (i === movies.length - 1 ? 0 : i + 1));
  };

  const handleVoirPlus = () => {
    navigate(`/film/${current.id}`);
  };

  return (
    <div className="carousel">
      <div
        className="carousel-slide"
        style={{ background: current.background || "#969696" }}
      >
        <img src={current.banner || current.poster} alt={current.title} />

        <div className="carousel-info">
          <h3>{current.title}</h3>
          <p className="carousel-synopsis">{current.synopsis}</p>
        </div>

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

// ---------------------- ACCUEIL ----------------------
function Accueil() {
  const navigate = useNavigate();

  return (
    <div className="home-main">
      <h2 className="section-title">4 suggestions de films / séries 🎬</h2>

      <Carousel movies={CAROUSEL_MOVIES} />

      <div className="results-section">
        {CARD_MOVIES.map((movie) => (
          <div className="movie-card" key={movie.id}>
            <img src={movie.poster} alt={movie.title} />
            <div className="movie-card-info">
              <h3>{movie.title}</h3>
              <span className="movie-card-genre">{movie.genre}</span>
              <button
                className="movie-card-view"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/film/${movie.id}`);
                }}
              >
                Voir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------- PAGE DÉTAIL FILM ----------------------
function FilmDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const movie = findMovieById(id);

  // Données récupérées depuis l'API OMDb (date de sortie + synopsis)
  const [apiData, setApiData] = useState(null);
  const [loadingApi, setLoadingApi] = useState(false);

  // Applique le fond du film à la page détail aussi
  useEffect(() => {
    if (!movie) return;
    document.body.style.background = movie.background || "#c5c4c4";
    return () => {
      document.body.style.background = "";
    };
  }, [movie]);

  // Va chercher la date de sortie + le synopsis via l'API OMDb
  useEffect(() => {
    if (!movie) return;

    let cancelled = false;
    // Réinitialisation volontaire de l'état avant chaque nouvelle requête
    // (nécessaire pour ne pas garder les données de l'ancien film pendant le chargement).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setApiData(null);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoadingApi(true);

    // "movie" pour les films, "series" pour les séries
    const type = movie.genre === "Série" ? "series" : "movie";

    const searchUrl = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(
      movie.title
    )}&type=${type}`;

    fetch(searchUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`OMDb a répondu avec le statut ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;

        if (data.Response === "False") {
          console.warn("OMDb :", data.Error);
          return;
        }

        setApiData({
          synopsis: data.Plot && data.Plot !== "N/A" ? data.Plot : null,
          date: data.Released && data.Released !== "N/A" ? data.Released : null,
        });
      })
      .catch((err) => {
        console.warn("Erreur API OMDb :", err.message || err);
      })
      .finally(() => {
        if (!cancelled) setLoadingApi(false);
      });

    return () => {
      cancelled = true;
    };
  }, [movie]);

  if (!movie) {
    return (
      <div className="film-detail">
        <p>Film introuvable.</p>
        <button className="back-button" onClick={() => navigate('/')}>
          ← Retour à l'accueil
        </button>
      </div>
    );
  }

  // Priorité aux données de l'API si disponibles, sinon on garde les données locales
  const displaySynopsis = apiData?.synopsis || movie.synopsis;
  const displayDate = apiData?.date
    ? new Date(apiData.date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="film-detail">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Retour
      </button>

      <div className="film-detail-header">
        <img
          className="film-detail-poster"
          src={movie.poster}
          alt={movie.title}
        />
        <div className="film-detail-info">
          <h1>{movie.title}</h1>
          <span className="film-detail-genre">{movie.genre}</span>
          {loadingApi && (
            <span className="film-detail-loading">Chargement des informations…</span>
          )}
          {displayDate && (
            <span className="film-detail-date">Sortie le {displayDate}</span>
          )}
          <p className="film-detail-synopsis">{displaySynopsis}</p>
        </div>
      </div>

      {movie.trailer && (
        <div className="film-detail-trailer">
          <h2>Bande-annonce</h2>
          <div className="trailer-wrapper">
            <iframe
              src={movie.trailer}
              title={`Trailer de ${movie.title}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------- AUTRES PAGES ----------------------
function Films() {
  return <h2>Page Films</h2>;
}

function Series() {
  return <h2>Page Séries</h2>;
}

function Favoris() {
  return <h2>Page Favoris</h2>;
}

function Note() {
  return <h2>Page Notes</h2>;
}

function APropos() {
  return <h2>Page À propos</h2>;
}

// ---------------------- APP ----------------------
function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Sidebar />

        <div className="app-content">
          <TopNavbar />

          <main className="page-content">
            <Routes>
              <Route path="/" element={<Accueil />} />
              <Route path="/films" element={<Films />} />
              <Route path="/series" element={<Series />} />
              <Route path="/favoris" element={<Favoris />} />
              <Route path="/note" element={<Note />} />
              <Route path="/apropos" element={<APropos />} />
              <Route path="/film/:id" element={<FilmDetail />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;