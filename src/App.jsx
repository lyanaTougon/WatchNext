// ============================================================
// APP.JSX
// ============================================================

import { useState, useEffect } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useNavigate,
  useParams,
  Navigate,
} from "react-router-dom";

import "./App.css";

// ============================================================
// IMPORT DES PAGES
// ============================================================

import Films from "./Pages/films.jsx";
import Series from "./Pages/series.jsx";
import SeConnecter from "./Pages/seconnecter.jsx";
import Note from "./Pages/note.jsx";
import Favoris from "./Pages/favoris.jsx";

// ============================================================
// IMPORT DES DONNÉES
// ============================================================

import {
  CAROUSEL_MOVIES,
  CARD_MOVIES,
  findMovieById,
} from "./Data/movie.jsx";

// ============================================================
// IMPORT PAGE DÉTAIL
// ============================================================

import Details from "./details.jsx";

// ============================================================
// BASE URL
// ============================================================

const BASE_URL = import.meta.env.BASE_URL;

// ============================================================
// IMAGES
// ============================================================

function getImagePath(path) {
  if (!path) {
    return "";
  }

  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  return `${BASE_URL}${path.replace(/^\/+/, "")}`;
}

// ============================================================
// RÉCUPÉRER L'UTILISATEUR
// ============================================================

function getCurrentUser() {
  const savedUser = localStorage.getItem("user");

  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser);
  } catch (error) {
    console.error(
      "Erreur récupération utilisateur :",
      error
    );

    return null;
  }
}

// ============================================================
// PROTECTION DES PAGES UTILISATEUR
// ============================================================

function UserOnlyRoute({ children, user }) {
  if (user?.role === "admin") {
    return (
      <Navigate
        to="/se-connecter"
        replace
      />
    );
  }

  return children;
}

// ============================================================
// SIDEBAR
// ============================================================

function Sidebar({ user }) {
  const admin = user?.role === "admin";

  return (
    <nav className="sidebar">

      <div className="sidebar-logo">
        🎬 WatchNext
      </div>

      <ul className="sidebar-links">

        {admin ? (
          <li>
            <NavLink to="/se-connecter">
              👑 Administration
            </NavLink>
          </li>
        ) : (
          <>
            <li>
              <NavLink to="/" end>
                Accueil
              </NavLink>
            </li>

            <li>
              <NavLink to="/favoris">
                Favoris
              </NavLink>
            </li>

            <li>
              <NavLink to="/note">
                Notes
              </NavLink>
            </li>

            <li>
              <NavLink to="/se-connecter">
                Mon compte
              </NavLink>
            </li>
          </>
        )}

      </ul>
    </nav>
  );
}

// ============================================================
// BARRE DU HAUT
// ============================================================

function TopNavbar({ user }) {
  const navigate = useNavigate();
  const admin = user?.role === "admin";

  return (
    <div className="top-navbar">

      {admin ? (
        <ul className="top-navbar-links">
          <li>
            <span className="admin-navbar-title">
              👑 Espace administrateur
            </span>
          </li>
        </ul>
      ) : (
        <ul className="top-navbar-links">
          <li>
            <NavLink to="/films">
              Films
            </NavLink>
          </li>

          <li>
            <NavLink to="/series">
              Séries
            </NavLink>
          </li>
        </ul>
      )}

      <div className="top-navbar-right">

        <button
          type="button"
          className="user-icon"
          aria-label={
            admin
              ? "Administration"
              : "Mon compte"
          }
          title={
            admin
              ? "Administration"
              : "Mon compte"
          }
          onClick={() =>
            navigate("/se-connecter")
          }
        >
          {admin ? "👑" : "👤"}
        </button>

      </div>
    </div>
  );
}

// ============================================================
// CAROUSEL
// ============================================================

function Carousel({ movies }) {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  const hasMovies =
    Array.isArray(movies) &&
    movies.length > 0;

  const current = hasMovies
    ? movies[index]
    : null;

  useEffect(() => {
    if (!hasMovies) {
      return;
    }

    movies.forEach((movie) => {
      const image = new Image();

      image.src = getImagePath(
        movie.banner || movie.poster
      );
    });
  }, [movies, hasMovies]);

  useEffect(() => {
    if (!current) {
      return;
    }

    document.body.style.background =
      current.background || "#c5c4c4";

    return () => {
      document.body.style.background = "";
    };
  }, [current]);

  function previousSlide() {
    setIndex((oldIndex) => {
      if (oldIndex === 0) {
        return movies.length - 1;
      }

      return oldIndex - 1;
    });
  }

  function nextSlide() {
    setIndex((oldIndex) => {
      if (oldIndex === movies.length - 1) {
        return 0;
      }

      return oldIndex + 1;
    });
  }

  function voirPlus() {
    if (!current) {
      return;
    }

    navigate(`/film/${current.id}`);
  }

  if (!hasMovies || !current) {
    return null;
  }

  return (
    <div className="carousel">

      <div
        className="carousel-slide"
        style={{
          background:
            current.background || "#969696",
        }}
      >

        <img
          src={getImagePath(
            current.banner || current.poster
          )}
          alt={current.title}
          draggable="false"
        />

        <div className="carousel-info">
          <h3>
            {current.title}
          </h3>

          <p className="carousel-synopsis">
            {current.synopsis}
          </p>
        </div>

        <button
          type="button"
          className="carousel-more-button"
          onClick={voirPlus}
        >
          Voir plus
        </button>

        <div className="carousel-arrows">

          <button
            type="button"
            className="carousel-arrow"
            onClick={previousSlide}
            aria-label="Film précédent"
          >
            ‹
          </button>

          <button
            type="button"
            className="carousel-arrow"
            onClick={nextSlide}
            aria-label="Film suivant"
          >
            ›
          </button>

        </div>

      </div>
    </div>
  );
}

// ============================================================
// ACCUEIL
// ============================================================

function Accueil() {
  const navigate = useNavigate();

  return (
    <div className="home-main">

      <h2 className="section-title">
        4 suggestions de films / séries 🎬
      </h2>

      <Carousel
        movies={CAROUSEL_MOVIES}
      />

      <h2 className="section-title">
        4 derniers films / séries récemment ajoutés 🎬
      </h2>

      <div className="results-section">

        {CARD_MOVIES.map((movie) => (

          <div
            className="movie-card"
            key={movie.id}
          >

            <img
              src={getImagePath(movie.poster)}
              alt={movie.title}
              draggable="false"
            />

            <div className="movie-card-info">

              <h3>
                {movie.title}
              </h3>

              <span className="movie-card-genre">
                {movie.genre}
              </span>

              <button
                type="button"
                className="movie-card-view"
                onClick={() =>
                  navigate(
                    `/film/${movie.id}`
                  )
                }
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

// ============================================================
// DÉTAIL FILM / SÉRIE
// ============================================================

function FilmDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const movie = findMovieById(id);

  useEffect(() => {
    if (!movie) {
      return;
    }

    document.body.style.background =
      movie.background || "#c5c4c4";

    return () => {
      document.body.style.background = "";
    };
  }, [movie]);

  if (!movie) {
    return (
      <div className="film-detail">

        <h2>
          Film ou série introuvable
        </h2>

        <button
          type="button"
          className="back-button"
          onClick={() =>
            navigate("/")
          }
        >
          ← Retour à l'accueil
        </button>

      </div>
    );
  }

  return (
    <Details movie={movie} />
  );
}

// ============================================================
// APPLICATION
// ============================================================

function App() {

  const [user, setUser] = useState(
    getCurrentUser()
  );

  useEffect(() => {

    function updateUser() {
      setUser(getCurrentUser());
    }

    window.addEventListener(
      "storage",
      updateUser
    );

    const interval = setInterval(
      updateUser,
      500
    );

    return () => {

      window.removeEventListener(
        "storage",
        updateUser
      );

      clearInterval(interval);
    };

  }, []);

  return (
    <BrowserRouter basename={BASE_URL}>

      <div className="app">

        <Sidebar user={user} />

        <div className="app-content">

          <TopNavbar user={user} />

          <main className="page-content">

            <Routes>

              <Route
                path="/"
                element={
                  <UserOnlyRoute user={user}>
                    <Accueil />
                  </UserOnlyRoute>
                }
              />

              <Route
                path="/films"
                element={
                  <UserOnlyRoute user={user}>
                    <Films />
                  </UserOnlyRoute>
                }
              />

              <Route
                path="/series"
                element={
                  <UserOnlyRoute user={user}>
                    <Series />
                  </UserOnlyRoute>
                }
              />

              <Route
                path="/favoris"
                element={
                  <UserOnlyRoute user={user}>
                    <Favoris />
                  </UserOnlyRoute>
                }
              />

              <Route
                path="/note"
                element={
                  <UserOnlyRoute user={user}>
                    <Note />
                  </UserOnlyRoute>
                }
              />

              <Route
                path="/se-connecter"
                element={
                  <SeConnecter />
                }
              />

              <Route
                path="/film/:id"
                element={
                  <UserOnlyRoute user={user}>
                    <FilmDetail />
                  </UserOnlyRoute>
                }
              />

              <Route
                path="*"
                element={
                  <Navigate
                    to={
                      user?.role === "admin"
                        ? "/se-connecter"
                        : "/"
                    }
                    replace
                  />
                }
              />

            </Routes>

          </main>
        </div>
      </div>

    </BrowserRouter>
  );
}

// ============================================================
// EXPORT
// ============================================================

export default App;