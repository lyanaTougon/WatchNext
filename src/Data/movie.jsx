// data/movies.js

// ============================================================
// FILMS DU CAROUSEL (bandeau du haut, page Accueil)
// ============================================================
// Les images doivent être dans le dossier public/images/
// (donc le fichier réel est à : public/images/evil-dead-burn.jpeg)
// Le chemin ici commence par /images/... et PAS /public/images/...
//
// "id" sert à construire l'URL de la page détail (/film/:id).
// "trailer" est l'URL d'embed YouTube (format https://www.youtube.com/embed/XXXXXXXX).
export const CAROUSEL_MOVIES = [
  {
    id: "lodyssee",
    title: "L'odysée",
    genre: "Aventure",
    synopsis: "Un voyage épique à travers des mondes inconnus, entre péril et découverte.",
    poster: "/images/lodyssee.jpeg",
    banner: "/images/lodyssee-banner.png",
    background: "linear-gradient(to bottom, rgb(7, 7, 7), rgb(124, 74, 17))",
    trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ", // à remplacer par le vrai trailer
  },
  {
    id: "girl-from-nowhere",
    title: "Girl From Nowhere",
    genre: "Série",
    synopsis: "Une histoire captivante mêlant suspense, émotion et rebondissements.",
    poster: "/images/girl-from-nowhere.jpeg",
    banner: "/images/girl-from-nowhere-banner.jpeg",
    background: "linear-gradient(to bottom, rgb(140, 148, 180), rgb(100, 110, 185))",
    trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ", // à remplacer par le vrai trailer
  },
  {
    id: "evil-dead-burn",
    title: "Evil Dead Burn",
    genre: "Horreur",
    synopsis: "Une nuit de terreur où le mal ancien se réveille et ne laisse aucune chance à ses victimes.",
    poster: "/images/evil-dead-burn.jpeg",
    banner: "/images/evil-dead-burn-banner.jpeg",
    background: "linear-gradient(to bottom, rgb(120, 0, 0), rgb(0, 0, 0))",
    trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ", // à remplacer par le vrai trailer
  },
];

// ============================================================
// FILMS DES CARTES (grille en dessous du carousel, page Accueil)
// ============================================================
// Liste INDÉPENDANTE du carousel — ajoute ici tes propres films/séries,
// même s'ils sont différents de ceux du carousel.
export const CARD_MOVIES = [
  {
    id: "lodyssee",
    title: "L'odysée",
    genre: "Aventure",
    synopsis: "Un voyage épique à travers des mondes inconnus, entre péril et découverte.",
    poster: "/images/lodyssee.jpeg",
    trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "girl-from-nowhere",
    title: "Girl From Nowhere",
    genre: "Série",
    synopsis: "Une histoire captivante mêlant suspense, émotion et rebondissements.",
    poster: "/images/girl-from-nowhere.jpeg",
    trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "evil-dead-burn",
    title: "Evil Dead Burn",
    genre: "Horreur",
    synopsis: "Une nuit de terreur où le mal ancien se réveille et ne laisse aucune chance à ses victimes.",
    poster: "/images/evil-dead-burn.jpeg",
    trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  // Ajoute d'autres films/séries ici librement, sans toucher au carousel.
];

// Liste combinée utilisée uniquement pour retrouver un film par son id
// (nécessaire pour que la page détail fonctionne peu importe d'où vient le clic).
const ALL_MOVIES = [...CAROUSEL_MOVIES, ...CARD_MOVIES];

export function findMovieById(id) {
  return ALL_MOVIES.find((m) => m.id === id);
}