import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { findMovieById } from "../Data/movie.jsx";
import "./note.css";

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

function Note() {
  const navigate = useNavigate();

  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // ============================================================
  // RÉCUPÉRER LES NOTES
  // ============================================================

  useEffect(() => {
    const getRatings = async () => {
      const token = localStorage.getItem("token");

      // ----------------------------------------------------------
      // UTILISATEUR NON CONNECTÉ
      // ----------------------------------------------------------

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/ratings`,
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
              "Impossible de récupérer vos notes."
          );
          return;
        }

        setRatings(data.ratings || []);
      } catch (error) {
        console.error(
          "Erreur récupération notes :",
          error
        );

        setMessage(
          "Impossible de contacter le serveur."
        );
      } finally {
        setLoading(false);
      }
    };

    getRatings();
  }, []);

  // ============================================================
  // SUPPRIMER UNE NOTE
  // ============================================================

  const deleteRating = async (movieId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/se-connecter");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/ratings/${movieId}`,
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
            "Impossible de supprimer la note."
        );
        return;
      }

      // Retirer le film de la liste immédiatement
      setRatings((currentRatings) =>
        currentRatings.filter(
          (rating) =>
            String(rating.movie_id) !==
            String(movieId)
        )
      );

      setMessage("Note supprimée avec succès ⭐");
    } catch (error) {
      console.error(
        "Erreur suppression note :",
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
      <div className="note-page">

        <div className="note-empty">

          <div className="note-empty-icon">
            ⭐
          </div>

          <h1>Mes notes</h1>

          <p>
            Connecte-toi pour retrouver les films
            que tu as notés.
          </p>

          <button
            type="button"
            className="note-login-button"
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
      <div className="note-page">

        <div className="note-loading">
          Chargement de vos notes...
        </div>

      </div>
    );
  }

  // ============================================================
  // AFFICHAGE
  // ============================================================

  return (
    <div className="note-page">

      {/* ========================================================
          TITRE
      ======================================================== */}

      <div className="note-header">

        <div>
          <h1>Mes notes</h1>

          <p>
            Retrouvez tous les films que vous avez notés.
          </p>
        </div>

        <div className="note-count">
          {ratings.length}{" "}
          {ratings.length > 1
            ? "films notés"
            : "film noté"}
        </div>

      </div>

      {/* ========================================================
          MESSAGE
      ======================================================== */}

      {message && (
        <div className="note-message">
          {message}
        </div>
      )}

      {/* ========================================================
          AUCUNE NOTE
      ======================================================== */}

      {ratings.length === 0 ? (
        <div className="note-empty">

          <div className="note-empty-icon">
            ⭐
          </div>

          <h2>Aucune note</h2>

          <p>
            Tu n'as pas encore noté de film.
          </p>

          <button
            type="button"
            className="note-login-button"
            onClick={() => navigate("/films")}
          >
            Découvrir les films
          </button>

        </div>
      ) : (

        /* ======================================================
           LISTE DES NOTES
        ====================================================== */

        <div className="notes-grid">

          {ratings.map((rating) => {

            const movie = findMovieById(
              String(rating.movie_id)
            );

            // Si le film n'existe plus dans movie.jsx
            if (!movie) {
              return (
                <div
                  className="note-card"
                  key={rating.id}
                >
                  <div className="note-card-info">

                    <h2>
                      Film #{rating.movie_id}
                    </h2>

                    <p>
                      Note : {rating.rating}/5 ⭐
                    </p>

                  </div>

                  <button
                    type="button"
                    className="delete-note-button"
                    onClick={() =>
                      deleteRating(
                        rating.movie_id
                      )
                    }
                  >
                    Supprimer
                  </button>

                </div>
              );
            }

            return (
              <article
                className="note-card"
                key={rating.id}
              >

                {/* ==================================================
                    AFFICHE
                ================================================== */}

                <img
                  src={getImagePath(movie.poster)}
                  alt={movie.title}
                  className="note-card-poster"
                  onClick={() =>
                    navigate(
                      `/film/${movie.id}`
                    )
                  }
                />

                {/* ==================================================
                    INFORMATIONS
                ================================================== */}

                <div className="note-card-content">

                  <button
                    type="button"
                    className="note-card-title"
                    onClick={() =>
                      navigate(
                        `/film/${movie.id}`
                      )
                    }
                  >
                    {movie.title}
                  </button>

                  <span className="note-card-genre">
                    {movie.genre}
                  </span>

                  {/* ==================================================
                      ÉTOILES
                  ================================================== */}

                  <div className="note-card-stars">

                    {[1, 2, 3, 4, 5].map(
                      (star) => (
                        <span
                          key={star}
                          className={
                            star <=
                            Number(rating.rating)
                              ? "small-star active"
                              : "small-star"
                          }
                        >
                          ★
                        </span>
                      )
                    )}

                  </div>

                  <p className="note-value">
                    Ma note :{" "}
                    <strong>
                      {rating.rating}/5
                    </strong>
                  </p>

                  {/* ==================================================
                      SUPPRIMER
                  ================================================== */}

                  <button
                    type="button"
                    className="delete-note-button"
                    onClick={() =>
                      deleteRating(
                        rating.movie_id
                      )
                    }
                  >
                    🗑 Supprimer ma note
                  </button>

                </div>

              </article>
            );
          })}

        </div>
      )}

    </div>
  );
}

export default Note;