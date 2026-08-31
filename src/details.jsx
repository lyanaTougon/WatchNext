// pages/Details/Details.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { findMovieById } from '../../data/movies';
import { OMDB_API_KEY } from '../../config';
import './Details.css';

function Details() {
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

export default Details;