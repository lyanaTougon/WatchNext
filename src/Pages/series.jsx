// ============================================================
// PAGE SÉRIES - SERIES.JSX
// ============================================================

import { useState } from "react";
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

  // Image provenant d'un site externe
  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  // Image située dans public/images/
  // Compatible avec GitHub Pages
  return `${BASE_URL}${path.replace(/^\/+/, "")}`;
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

  // ----------------------------------------------------------
  // GENRES DISPONIBLES
  // ----------------------------------------------------------

  const genres = [
    "Tous",
    ...new Set(
      SERIES.map((series) => series.genre)
    ),
  ];

  // ----------------------------------------------------------
  // FILTRAGE
  // ----------------------------------------------------------

  const filteredSeries = SERIES.filter((series) => {

    const matchesSearch =
      series.title
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesGenre =
      genre === "Tous" ||
      series.genre === genre;

    return (
      matchesSearch &&
      matchesGenre
    );
  });

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

        {/* RECHERCHE */}

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

        {/* GENRE */}

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
          CARTES
      ====================================================== */}

      {filteredSeries.length > 0 ? (

        <div className="series-grid">

          {filteredSeries.map((series) => (

            <div
              className="series-card"
              key={series.id}
              onClick={() =>
                navigate(`/film/${series.id}`)
              }
            >

              {/* IMAGE */}

              <img
                src={getImagePath(series.poster)}
                alt={series.title}
                draggable="false"
              />

              {/* INFORMATIONS */}

              <div className="series-card-info">

                <h2>
                  {series.title}
                </h2>

                <span>
                  {series.genre}
                </span>

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

          ))}

        </div>

      ) : (

        /* ====================================================
           AUCUN RÉSULTAT
        ==================================================== */

        <div className="series-no-results">

          <h2>
            Aucune série trouvée 😕
          </h2>

          <p>
            Aucune série ne correspond à votre recherche.
          </p>

        </div>

      )}

    </div>
  );
}

// ============================================================
// EXPORT
// ============================================================

export default Series;