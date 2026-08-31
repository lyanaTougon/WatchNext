import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MOVIES } from "../Data/movie.jsx";
import "./films.css";

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
// PAGE FILMS
// ============================================================

function Films() {

  const navigate = useNavigate();

  // ------------------------------------------------------------
  // RÉCUPÉRATION UNIQUEMENT DES FILMS
  // ------------------------------------------------------------

  const allMovies = MOVIES;

  // ------------------------------------------------------------
  // ÉTATS
  // ------------------------------------------------------------

  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("Tous");

  // ------------------------------------------------------------
  // GENRES
  // ------------------------------------------------------------

  const genres = [
    "Tous",
    ...new Set(
      allMovies.map((movie) => movie.genre)
    ),
  ];

  // ------------------------------------------------------------
  // FILTRAGE
  // ------------------------------------------------------------

  const filteredMovies = allMovies.filter(
    (movie) => {

      const matchesSearch =
        movie.title
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesGenre =
        genre === "Tous" ||
        movie.genre === genre;

      return (
        matchesSearch &&
        matchesGenre
      );
    }
  );

  // ------------------------------------------------------------
  // AFFICHAGE
  // ------------------------------------------------------------

  return (

    <div className="films-page">

      {/* ======================================================
          EN-TÊTE
      ====================================================== */}

      <div className="films-header">

        <h1>
          Tous les films 🎬
        </h1>

        <p>
          Retrouvez tous les films disponibles sur WatchNext.
        </p>

      </div>


      {/* ======================================================
          FILTRES
      ====================================================== */}

      <div className="films-filters">

        <div className="films-search">

          <input
            type="text"
            placeholder="Rechercher un film..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

        </div>


        <div className="films-genre">

          <label htmlFor="genre">
            Genre :
          </label>

          <select
            id="genre"
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

      <div className="films-count">

        {filteredMovies.length} film
        {filteredMovies.length > 1 ? "s" : ""}

      </div>


      {/* ======================================================
          CARTES
      ====================================================== */}

      {filteredMovies.length > 0 ? (

        <div className="films-grid">

          {filteredMovies.map((movie) => (

            <div
              className="film-card"
              key={movie.id}
              onClick={() =>
                navigate(`/film/${movie.id}`)
              }
            >

              <img
                src={getImagePath(movie.poster)}
                alt={movie.title}
                draggable="false"
                onError={(event) => {
                  console.error(
                    "Image introuvable :",
                    event.currentTarget.src
                  );
                }}
              />


              <div className="film-card-info">

                <h2>
                  {movie.title}
                </h2>

                <span>
                  {movie.genre}
                </span>

                <button
                  type="button"
                  onClick={(event) => {

                    event.stopPropagation();

                    navigate(
                      `/film/${movie.id}`
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

        <div className="no-results">

          <h2>
            Aucun film trouvé 😕
          </h2>

          <p>
            Aucun film ne correspond à votre recherche.
          </p>

        </div>

      )}

    </div>
  );
}

export default Films;