import { useEffect } from "react";
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

  return (
    <div className="film-detail">

      <button
        className="back-button"
        onClick={() => navigate(-1)}
      >
        ← Retour
      </button>

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

export default Details;