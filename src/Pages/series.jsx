import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { SERIES } from "../Data/movie.jsx";

import "./series.css";

// ============================================================
// GESTION DES IMAGES
// ============================================================

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

// ============================================================
// AFFICHAGE DES ÉTOILES
// ============================================================

function Stars({ rating }) {
  const roundedRating = Math.round(rating * 2) / 2;
  const fullStars = Math.floor(roundedRating);
  const halfStar = roundedRating % 1 !== 0;
  const emptyStars =
    5 - fullStars - (halfStar ? 1 : 0);

  return (
    <span className="rating-stars">
      {"★".repeat(fullStars)}
      {halfStar && "½"}
      {"☆".repeat(emptyStars)}
    </span>
  );
}

// ============================================================
// PAGE SÉRIES
// ============================================================

function Series() {
  const navigate = useNavigate();

  // ----------------------------------------------------------
  // ÉTATS
  // ----------------------------------------------------------

  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("Tous");
  const [ratings, setRatings] = useState({});
  const [loadingRatings, setLoadingRatings] = useState(true);

  // ----------------------------------------------------------
  // RÉCUPÉRER LES MOYENNES
  // ----------------------------------------------------------

  useEffect(() => {
    async function loadRatings() {
      try {
        setLoadingRatings(true);

        const results = await Promise.all(
          SERIES.map(async (series) => {
            try {
              const response = await fetch(
                `http://localhost:5000/api/ratings/movie/${series.id}`
              );

              if (!response.ok) {
                return {
                  id: series.id,
                  average_rating: 0,
                  rating_count: 0
                };
              }

              const data = await response.json();

              return {
                id: series.id,
                average_rating:
                  Number(data.average_rating) || 0,
                rating_count:
                  Number(data.rating_count) || 0
              };
            } catch (error) {
              console.error(
                `Erreur note de la série ${series.title} :`,
                error
              );

              return {
                id: series.id,
                average_rating: 0,
                rating_count: 0
              };
            }
          })
        );

        const ratingsObject = {};

        results.forEach((item) => {
          ratingsObject[item.id] = {
            average: item.average_rating,
            count: item.rating_count
          };
        });

        setRatings(ratingsObject);
      } catch (error) {
        console.error(
          "Erreur récupération des notes :",
          error
        );
      } finally {
        setLoadingRatings(false);
      }
    }

    loadRatings();
  }, []);

  // ----------------------------------------------------------
  // GENRES
  // ----------------------------------------------------------

  const genres = [
    "Tous",
    ...new Set(
      SERIES.map((series) => series.genre)
    )
  ];

  // ----------------------------------------------------------
  // FILTRAGE
  // ----------------------------------------------------------

  const filteredSeries = SERIES.filter((series) => {
    const matchesSearch = series.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesGenre =
      genre === "Tous" ||
      series.genre === genre;

    return matchesSearch && matchesGenre;
  });

  // ----------------------------------------------------------
  // TOP 5 DES SÉRIES
  // ----------------------------------------------------------

  const topSeries = [...SERIES]
    .filter((series) => {
      const rating = ratings[series.id];

      return rating && rating.count > 0;
    })
    .sort((a, b) => {
      const ratingA =
        ratings[a.id]?.average || 0;

      const ratingB =
        ratings[b.id]?.average || 0;

      return ratingB - ratingA;
    })
    .slice(0, 5);

  // ----------------------------------------------------------
  // AFFICHAGE
  // ----------------------------------------------------------

  return (
    <div className="series-page">

      {/* ======================================================
          EN-TÊTE
      ====================================================== */}

      <div className="series-header">
        <h1>
          Toutes les séries 📺
        </h1>

        <p>
          Retrouvez toutes les séries disponibles sur WatchNext.
        </p>
      </div>

      {/* ======================================================
          RECHERCHE + FILTRE
      ====================================================== */}

      <div className="series-filters">

        <div className="series-search">
          <input
            type="text"
            placeholder="Rechercher une série..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <div className="series-genre">

          <label htmlFor="series-genre">
            Genre :
          </label>

          <select
            id="series-genre"
            value={genre}
            onChange={(event) =>
              setGenre(event.target.value)
            }
          >
            {genres.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>

        </div>

      </div>

      {/* ======================================================
          NOMBRE DE RÉSULTATS
      ====================================================== */}

      <div className="series-count">
        {filteredSeries.length} série
        {filteredSeries.length > 1 ? "s" : ""}
      </div>

      {/* ======================================================
          CARTES DES SÉRIES
      ====================================================== */}

      {filteredSeries.length > 0 ? (

        <div className="series-grid">

          {filteredSeries.map((series) => {

            const rating = ratings[series.id];

            return (
              <div
                className="series-card"
                key={series.id}
                onClick={() =>
                  navigate(`/film/${series.id}`)
                }
              >

                <img
                  src={getImagePath(series.poster)}
                  alt={series.title}
                  draggable="false"
                />

                <div className="series-card-info">

                  <h2>
                    {series.title}
                  </h2>

                  <span>
                    {series.genre}
                  </span>

                  {/* ==================================================
                      NOTE MOYENNE
                  ================================================== */}

                  {rating && rating.count > 0 ? (

                    <div className="series-rating">

                      <div className="series-rating-stars">
                        <Stars
                          rating={rating.average}
                        />
                      </div>

                      <strong>
                        {rating.average.toFixed(1)} / 5
                      </strong>

                      <small>
                        ({rating.count})
                      </small>

                    </div>

                  ) : (

                    <div className="series-rating no-rating">
                      ☆ Aucune note
                    </div>

                  )}

                  {/* ==================================================
                      BOUTON VOIR
                  ================================================== */}

                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();

                      navigate(
                        `/film/${series.id}`
                      );
                    }}
                  >
                    Voir
                  </button>

                </div>

              </div>
            );
          })}

        </div>

      ) : (

        <div className="series-no-results">

          <h2>
            Aucune série trouvée 😕
          </h2>

          <p>
            Aucune série ne correspond à votre recherche.
          </p>

        </div>

      )}

      {/* ======================================================
          TOP 5 DES SÉRIES
          PLACÉ EN BAS DE LA PAGE
      ====================================================== */}

      {!loadingRatings && topSeries.length > 0 && (

        <section className="top-rated-section">

          <div className="top-rated-header">

            <h2>
              🏆 Top 5 des séries les mieux notées
            </h2>

            <p>
              Classement basé sur les notes de tous les utilisateurs.
            </p>

          </div>

          <div className="top-rated-grid">

            {topSeries.map((series, index) => {

              const rating = ratings[series.id];

              return (
                <div
                  className="top-rated-card"
                  key={series.id}
                  onClick={() =>
                    navigate(`/film/${series.id}`)
                  }
                >

                  <div className="top-position">
                    {index === 0 && "🥇"}
                    {index === 1 && "🥈"}
                    {index === 2 && "🥉"}
                    {index > 2 && `${index + 1}️⃣`}
                  </div>

                  <img
                    src={getImagePath(series.poster)}
                    alt={series.title}
                    draggable="false"
                  />

                  <div className="top-rated-info">

                    <h3>
                      {series.title}
                    </h3>

                    <div className="average-rating">

                      <Stars
                        rating={rating.average}
                      />

                      <strong>
                        {rating.average.toFixed(1)} / 5
                      </strong>

                    </div>

                    <span className="rating-count">
                      {rating.count}{" "}
                      {rating.count > 1
                        ? "votes"
                        : "vote"}
                    </span>

                  </div>

                </div>
              );
            })}

          </div>

        </section>

      )}

    </div>
  );
}

export default Series;