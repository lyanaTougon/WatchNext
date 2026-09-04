// ============================================================
// DATA / MOVIE.JSX
// ============================================================


// ============================================================
// FILMS
// ============================================================

export const MOVIES = [

  {
    id: "lodyssee",
    type: "film",
    title: "L'Odyssée",
    genre: "Aventure",
    synopsis:
      "Un voyage épique à travers des mondes inconnus, entre péril et découverte.",
    poster: "/images/lodyssee.jpeg",
    banner: "/images/lodyssee-banner.png",
    background:
      "linear-gradient(to bottom, rgb(7, 7, 7), rgb(36, 42, 110))",
    trailer:
      "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },

  {
    id: "ballerina",
    type: "film",
    title: "Ballerina",
    genre: "Action / Thriller",
    synopsis:
      "Une ballerine-assassin cherche à venger le meurtre de sa famille en traquant les coupables.",
    poster: "/images/ballerina.jpeg",
    banner: "/images/ballerina-banner.jpeg",
    background:
      "linear-gradient(to bottom, rgb(27, 10, 27), rgb(129, 26, 155))",
    trailer:
      "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },

  {
    id: "evil-dead-burn",
    type: "film",
    title: "Evil Dead Burn",
    genre: "Horreur",
    synopsis:
      "Une nouvelle menace surnaturelle plonge plusieurs personnes dans un cauchemar terrifiant.",
    poster: "/images/evil-dead-burn.jpeg",
    banner: "/images/evil-dead-burn.jpeg",
    background:
      "linear-gradient(to bottom, rgb(20, 5, 5), rgb(110, 20, 20))",
    trailer:
      "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },

  {
    id: "bubble",
    type: "film",
    title: "Bubble",
    genre: "Drame / Romance",
    synopsis:
      "Dans un Tokyo bouleversé par un phénomène mystérieux, un jeune homme rencontre une fille énigmatique.",
    poster: "/images/bubble.webp",
    banner: "/images/bubble.webp",
    background:
      "linear-gradient(to bottom, rgb(20, 35, 70), rgb(100, 30, 120))",
    trailer:
      "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },

  {
    id: "la-demoiselle-et-le-dragon",
    type: "film",
    title: "La Demoiselle et le Dragon",
    genre: "Fantasy",
    synopsis:
      "Une jeune femme découvre que son mariage royal cache un terrible secret.",
    poster: "/images/demoiselle-dragon.jpeg",
    banner: "/images/demoiselle-dragon.jpeg",
    background:
      "linear-gradient(to bottom, rgb(30, 15, 10), rgb(120, 55, 20))",
    trailer:
      "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },

];


// ============================================================
// SÉRIES
// ============================================================

export const SERIES = [

  {
    id: "girl-from-nowhere",
    type: "serie",
    title: "Girl From Nowhere",
    genre: "Thriller",
    synopsis:
      "Une lycéenne mystérieuse et immortelle change d'école à chaque épisode pour exposer et punir cruellement les vices de ses camarades et professeurs.",
    poster: "/images/girl-from-nowhere.jpeg",
    banner: "/images/girl-from-nowhere-banner.jpeg",
    background:
      "linear-gradient(to bottom, rgb(140, 148, 180), rgb(100, 110, 185))",
    trailer:
      "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },

  {
    id: "arcane",
    type: "serie",
    title: "Arcane",
    genre: "Action / Thriller",
    synopsis:
      "Une scientifique et sa sœur s'affrontent au cœur d'une guerre technologique et sociale entre la riche cité de Piltover et les bas-fonds de Zaun.",
    poster: "/images/arcane.jpeg",
    banner: "/images/arcane-banner.jpeg",
    background:
      "linear-gradient(to bottom, rgb(191, 191, 191), rgb(19, 19, 19))",
    trailer:
      "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },

  {
    id: "the-glory",
    type: "serie",
    title: "The Glory",
    genre: "Drame",
    synopsis:
      "Une femme prépare sa vengeance contre ceux qui l'ont profondément blessée durant sa jeunesse.",
    poster: "/images/the-glory.jpeg",
    banner: "/images/the-glory.jpeg",
    background:
      "linear-gradient(to bottom, rgb(30, 30, 40), rgb(100, 70, 80))",
    trailer:
      "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },

];


// ============================================================
// CARROUSEL
// ============================================================

export const CAROUSEL_MOVIES = [

  MOVIES.find(
    (movie) => movie.id === "lodyssee"
  ),

  SERIES.find(
    (serie) => serie.id === "girl-from-nowhere"
  ),

  SERIES.find(
    (serie) => serie.id === "arcane"
  ),

  MOVIES.find(
    (movie) => movie.id === "ballerina"
  ),

].filter(Boolean);


// ============================================================
// DERNIERS FILMS / SÉRIES
// ============================================================

export const CARD_MOVIES = [

  SERIES.find(
    (serie) => serie.id === "the-glory"
  ),

  MOVIES.find(
    (movie) => movie.id === "bubble"
  ),

  MOVIES.find(
    (movie) => movie.id === "evil-dead-burn"
  ),

  MOVIES.find(
    (movie) => movie.id === "la-demoiselle-et-le-dragon"
  ),

].filter(Boolean);


// ============================================================
// TOUS LES CONTENUS
// ============================================================

const ALL_MOVIES = [
  ...MOVIES,
  ...SERIES,
];


// ============================================================
// RECHERCHE PAR ID
// ============================================================

export function findMovieById(id) {

  return ALL_MOVIES.find(
    (movie) => movie.id === id
  );

}