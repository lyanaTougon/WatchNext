import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { findMovieById } from "./Data/movie.jsx";

const BASE_URL = import.meta.env.BASE_URL;

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

function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const movie = findMovieById(id);

  // ========================================
  // ÉTATS
  // ========================================

  const [isFavorite, setIsFavorite] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const [hoverRating, setHoverRating] = useState(0);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const [loadingRating, setLoadingRating] = useState(false);
  const [message, setMessage] = useState("");

  // ========================================
  // BACKEND
  // ========================================

  const API_URL = "http://localhost:5000";

  // ========================================
  // RÉCUPÉRER LE TOKEN
  // ========================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ========================================
  // VÉRIFIER SI LE FILM EST EN FAVORI
  // ========================================

  useEffect(() => {
    const checkFavorite = async () => {
      const token = getToken();

      if (!token || !movie) {
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/favoris`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        const favoriteExists = data.favorites.some(
          (favorite) =>
            String(favorite.movie_id) === String(movie.id)
        );

        setIsFavorite(favoriteExists);
      } catch (error) {
        console.error(
          "Erreur récupération favoris :",
          error
        );
      }
    };

    checkFavorite();
  }, [movie]);

  // ========================================
  // RÉCUPÉRER LA NOTE DE L'UTILISATEUR
  // ========================================

  useEffect(() => {
    const getUserRating = async () => {
      const token = getToken();

      if (!token || !movie) {
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/ratings`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        const ratingExists = data.ratings.find(
          (rating) =>
            String(rating.movie_id) === String(movie.id)
        );

        if (ratingExists) {
          setUserRating(Number(ratingExists.rating));
        }
      } catch (error) {
        console.error(
          "Erreur récupération note :",
          error
        );
      }
    };

    getUserRating();
  }, [movie]);

  // ========================================
  // AJOUTER / SUPPRIMER UN FAVORI
  // ========================================

  const toggleFavorite = async () => {
    const token = getToken();

    if (!token) {
      navigate("/se-connecter");
      return;
    }

    if (!movie) {
      return;
    }

    setLoadingFavorite(true);
    setMessage("");

    try {
      if (isFavorite) {
        // SUPPRESSION
        const response = await fetch(
          `${API_URL}/api/favoris/${movie.id}`,
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
            data.message || "Erreur lors de la suppression."
          );
          return;
        }

        setIsFavorite(false);
        setMessage("Film retiré des favoris ❤️");
      } else {
        // AJOUT
        const response = await fetch(
          `${API_URL}/api/favoris`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              movie_id: movie.id,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage(
            data.message || "Erreur lors de l'ajout."
          );
          return;
        }

        setIsFavorite(true);
        setMessage("Film ajouté aux favoris ❤️");
      }
    } catch (error) {
      console.error(
        "Erreur favori :",
        error
      );

      setMessage(
        "Impossible de contacter le serveur."
      );
    } finally {
      setLoadingFavorite(false);
    }
  };

  // ========================================
  // AJOUTER / MODIFIER UNE NOTE
  // ========================================

  const handleRating = async (rating) => {
    const token = getToken();

    if (!token) {
      navigate("/se-connecter");
      return;
    }

    if (!movie) {
      return;
    }

    setLoadingRating(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/ratings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            movie_id: movie.id,
            rating: rating,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Erreur lors de l'enregistrement."
        );
        return;
      }

      setUserRating(Number(rating));
      setMessage("Note enregistrée ⭐");
    } catch (error) {
      console.error(
        "Erreur note :",
        error
      );

      setMessage(
        "Impossible de contacter le serveur."
      );
    } finally {
      setLoadingRating(false);
      setHoverRating(0);
    }
  };

  // ========================================
  // ARRIÈRE-PLAN
  // ========================================

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

  // ========================================
  // FILM INTROUVABLE
  // ========================================

  if (!movie) {
    return (
      <div className="film-detail">
        <h2>Film introuvable</h2>

        <button
          className="back-button"
          onClick={() => navigate("/")}
        >
          ← Retour à l'accueil
        </button>
      </div>
    );
  }

  // ========================================
  // AFFICHAGE
  // ========================================

  return (
    <div className="film-detail">

      {/* RETOUR */}

      <button
        className="back-button"
        onClick={() => navigate(-1)}
      >
        ← Retour
      </button>


      {/* INFORMATIONS DU FILM */}

      <div className="film-detail-header">

        <img
          className="film-detail-poster"
          src={getImagePath(movie.poster)}
          alt={movie.title}
        />

        <div className="film-detail-info">

          <h1>{movie.title}</h1>

          <span className="film-detail-genre">
            {movie.genre}
          </span>

          <p className="film-detail-synopsis">
            {movie.synopsis}
          </p>


          {/* ========================================
              FAVORIS
          ======================================== */}

          <button
            className={`favorite-button ${
              isFavorite ? "favorite-active" : ""
            }`}
            onClick={toggleFavorite}
            disabled={loadingFavorite}
          >
            {loadingFavorite
              ? "Chargement..."
              : isFavorite
              ? "❤️ Retirer des favoris"
              : "♡ Ajouter aux favoris"}
          </button>


          {/* ========================================
              NOTES
          ======================================== */}

          <div className="rating-section">

            <h3>Ma note</h3>

            <div className="stars">

              {[1, 2, 3, 4, 5].map((star) => {

                const currentRating =
                  hoverRating || userRating || 0;

                return (
                  <button
                    key={star}
                    className={
                      star <= currentRating
                        ? "star active"
                        : "star"
                    }
                    onClick={() => handleRating(star)}
                    onMouseEnter={() =>
                      setHoverRating(star)
                    }
                    onMouseLeave={() =>
                      setHoverRating(0)
                    }
                    disabled={loadingRating}
                    aria-label={`Noter ${star} sur 5`}
                  >
                    ★
                  </button>
                );
              })}

            </div>

            {userRating && (
              <p className="rating-text">
                Ma note : {userRating}/5 ⭐
              </p>
            )}

          </div>


          {/* MESSAGE */}

          {message && (
            <p className="action-message">
              {message}
            </p>
          )}

        </div>
      </div>


      {/* BANDE-ANNONCE */}

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

export default Details;