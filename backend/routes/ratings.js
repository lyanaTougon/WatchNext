import express from "express";
import pool from "../config/database.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();


// ========================================
// AJOUTER OU MODIFIER UNE NOTE
// ========================================

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { movie_id, rating } = req.body;
    const user_id = req.user.id;

    // Vérification des champs
    if (!movie_id || rating === undefined) {
      return res.status(400).json({
        message: "L'identifiant du film et la note sont obligatoires."
      });
    }

    const note = Number(rating);

    // Notes autorisées :
    // 0 / 0.5 / 1 / 1.5 / 2 / 2.5 / 3 / 3.5 / 4 / 4.5 / 5
    if (
      Number.isNaN(note) ||
      note < 0 ||
      note > 5 ||
      note % 0.5 !== 0
    ) {
      return res.status(400).json({
        message:
          "La note doit être comprise entre 0 et 5, par pas de 0.5."
      });
    }

    // Vérifier si l'utilisateur a déjà noté ce film
    const existingRating = await pool.query(
      `SELECT *
       FROM ratings
       WHERE user_id = $1 AND movie_id = $2`,
      [user_id, movie_id]
    );

    // ========================================
    // MODIFIER UNE NOTE EXISTANTE
    // ========================================

    if (existingRating.rows.length > 0) {
      const result = await pool.query(
        `UPDATE ratings
         SET rating = $1
         WHERE user_id = $2 AND movie_id = $3
         RETURNING *`,
        [note, user_id, movie_id]
      );

      return res.json({
        message: "Note modifiée avec succès !",
        rating: result.rows[0]
      });
    }

    // ========================================
    // AJOUTER UNE NOUVELLE NOTE
    // ========================================

    const result = await pool.query(
      `INSERT INTO ratings (user_id, movie_id, rating)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [user_id, movie_id, note]
    );

    res.status(201).json({
      message: "Note ajoutée avec succès !",
      rating: result.rows[0]
    });

  } catch (error) {
    console.error("Erreur ajout/modification note :", error);

    res.status(500).json({
      message: "Erreur serveur."
    });
  }
});


// ========================================
// RÉCUPÉRER LES NOTES DE L'UTILISATEUR
// ========================================

router.get("/", authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id;

    const result = await pool.query(
      `SELECT *
       FROM ratings
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [user_id]
    );

    res.json({
      ratings: result.rows
    });

  } catch (error) {
    console.error("Erreur récupération notes :", error);

    res.status(500).json({
      message: "Erreur serveur."
    });
  }
});


// ========================================
// RÉCUPÉRER LA MOYENNE D'UN FILM
// ========================================

router.get("/movie/:movie_id", async (req, res) => {
  try {
    const { movie_id } = req.params;

    const result = await pool.query(
      `SELECT
         COALESCE(AVG(rating), 0) AS average_rating,
         COUNT(*) AS rating_count
       FROM ratings
       WHERE movie_id = $1`,
      [movie_id]
    );

    const average = Number(result.rows[0].average_rating);

    res.json({
      movie_id: movie_id,
      average_rating: Number(average.toFixed(1)),
      rating_count: Number(result.rows[0].rating_count)
    });

  } catch (error) {
    console.error("Erreur moyenne du film :", error);

    res.status(500).json({
      message: "Erreur serveur."
    });
  }
});


// ========================================
// TOP 5 DES FILMS LES MIEUX NOTÉS
// ========================================

router.get("/top5", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         movie_id,
         ROUND(AVG(rating)::numeric, 1) AS average_rating,
         COUNT(*) AS rating_count
       FROM ratings
       GROUP BY movie_id
       ORDER BY AVG(rating) DESC, COUNT(*) DESC
       LIMIT 5`
    );

    res.json({
      top5: result.rows
    });

  } catch (error) {
    console.error("Erreur Top 5 :", error);

    res.status(500).json({
      message: "Erreur serveur."
    });
  }
});


// ========================================
// SUPPRIMER UNE NOTE
// ========================================

router.delete("/:movie_id", authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id;
    const { movie_id } = req.params;

    const result = await pool.query(
      `DELETE FROM ratings
       WHERE user_id = $1 AND movie_id = $2
       RETURNING *`,
      [user_id, movie_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Aucune note trouvée pour ce film."
      });
    }

    res.json({
      message: "Note supprimée avec succès !",
      rating: result.rows[0]
    });

  } catch (error) {
    console.error("Erreur suppression note :", error);

    res.status(500).json({
      message: "Erreur serveur."
    });
  }
});


export default router;