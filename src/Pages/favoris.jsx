import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { findMovieById } from "../Data/movie.jsx";
import "./favoris.css";

const BASE_URL = import.meta.env.BASE_URL;
const API_URL = "http://localhost:5000";

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

function Favoris() {
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // ============================================================
  // RÉCUPÉRER LES FAVORIS
  // ============================================================

  useEffect(() => {
    const getFavorites = async () => {
      const token = localStorage.getItem("token");

      // ----------------------------------------------------------
      // PAS CONNECTÉ
      // ----------------------------------------------------------

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/favoris`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage(
            data.message ||
              "Impossible de récupérer vos favoris."
          );
          return;
        }

        setFavorites(data.favorites || []);
      } catch (error) {
        console.error(
          "Erreur récupération favoris :",
          error
        );

        setMessage(
          "Impossible de contacter le serveur."
        );
      } finally {
        setLoading(false);
      }
    };

    getFavorites();
  }, []);

  // ============================================================
  // SUPPRIMER UN FAVORI
  // ============================================================

  const deleteFavorite = async (movieId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/se-connecter");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/favoris/${movieId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Impossible de supprimer le favori."
        );
        return;
      }

      // Retirer immédiatement le film de la page
      setFavorites((currentFavorites) =>
        currentFavorites.filter(
          (favorite) =>
            String(favorite.movie_id) !==
            String(movieId)
        )
      );

      setMessage(
        "Film retiré de vos favoris ❤️"
      );
    } catch (error) {
      console.error(
        "Erreur suppression favori :",
        error
      );

      setMessage(
        "Impossible de contacter le serveur."
      );
    }
  };

  // ============================================================
  // UTILISATEUR NON CONNECTÉ
  // ============================================================

  const token = localStorage.getItem("token");

  if (!token) {
    return (
      <div className="favoris-page">

        <div className="favoris-empty">

          <div className="favoris-empty-icon">
            ❤️
          </div>

          <h1>Mes favoris</h1>

          <p>
            Connecte-toi pour retrouver les films
            que tu as ajoutés à tes favoris.
          </p>

          <button
            type="button"
            className="favoris-login-button"
            onClick={() =>
              navigate("/se-connecter")
            }
          >
            Se connecter
          </button>

        </div>

      </div>
    );
  }

  // ============================================================
  // CHARGEMENT
  // ============================================================

  if (loading) {
    return (
      <div className="favoris-page">

        <div className="favoris-loading">
          Chargement de vos favoris...
        </div>

      </div>
    );
  }

  // ============================================================
  // AFFICHAGE
  // ============================================================

  return (
    <div className="favoris-page">

      {/* ========================================================
          EN-TÊTE
      ======================================================== */}

      <div className="favoris-header">

        <div>
          <h1>Mes favoris ❤️</h1>

          <p>
            Retrouvez tous les films et séries
            que vous souhaitez regarder.
          </p>
        </div>

        <div className="favoris-count">
          {favorites.length}{" "}
          {favorites.length > 1
            ? "favoris"
            : "favori"}
        </div>

      </div>

      {/* ========================================================
          MESSAGE
      ======================================================== */}

      {message && (
        <div className="favoris-message">
          {message}
        </div>
      )}

      {/* ========================================================
          AUCUN FAVORI
      ======================================================== */}

      {favorites.length === 0 ? (

        <div className="favoris-empty">

          <div className="favoris-empty-icon">
            ❤️
          </div>

          <h2>
            Aucun favori
          </h2>

          <p>
            Tu n'as pas encore ajouté de film
            à tes favoris.
          </p>

          <button
            type="button"
            className="favoris-login-button"
            onClick={() =>
              navigate("/films")
            }
          >
            Découvrir les films
          </button>

        </div>

      ) : (

        /* ======================================================
           LISTE DES FAVORIS
        ====================================================== */

        <div className="favoris-grid">

          {favorites.map((favorite) => {

            const movie = findMovieById(
              String(favorite.movie_id)
            );

            // --------------------------------------------------
            // FILM NON TROUVÉ DANS movie.jsx
            // --------------------------------------------------

            if (!movie) {
              return (
                <div
                  className="favoris-card favoris-card-error"
                  key={favorite.id}
                >

                  <div className="favoris-card-content">

                    <h2>
                      Film #{favorite.movie_id}
                    </h2>

                    <p>
                      Ce film n'existe pas dans
                      ta liste locale.
                    </p>

                    <button
                      type="button"
                      className="delete-favori-button"
                      onClick={() =>
                        deleteFavorite(
                          favorite.movie_id
                        )
                      }
                    >
                      🗑 Retirer
                    </button>

                  </div>

                </div>
              );
            }

            // --------------------------------------------------
            // FILM TROUVÉ
            // --------------------------------------------------

            return (
              <article
                className="favoris-card"
                key={favorite.id}
              >

                {/* ==================================================
                    AFFICHE
                ================================================== */}

                <img
                  src={getImagePath(movie.poster)}
                  alt={movie.title}
                  className="favoris-card-poster"
                  onClick={() =>
                    navigate(
                      `/film/${movie.id}`
                    )
                  }
                />

                {/* ==================================================
                    INFORMATIONS
                ================================================== */}

                <div className="favoris-card-content">

                  <button
                    type="button"
                    className="favoris-card-title"
                    onClick={() =>
                      navigate(
                        `/film/${movie.id}`
                      )
                    }
                  >
                    {movie.title}
                  </button>

                  <span className="favoris-card-genre">
                    {movie.genre}
                  </span>

                  <p className="favoris-card-description">
                    {movie.synopsis}
                  </p>

                  {/* ==================================================
                      BOUTONS
                  ================================================== */}

                  <div className="favoris-card-actions">

                    <button
                      type="button"
                      className="favoris-view-button"
                      onClick={() =>
                        navigate(
                          `/film/${movie.id}`
                        )
                      }
                    >
                      Voir
                    </button>

                    <button
                      type="button"
                      className="delete-favori-button"
                      onClick={() =>
                        deleteFavorite(
                          favorite.movie_id
                        )
                      }
                    >
                      🗑 Retirer
                    </button>

                  </div>

                </div>

              </article>
            );
          })}

        </div>
      )}

    </div>
  );
}

export default Favoris;