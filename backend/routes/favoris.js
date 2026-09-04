import express from "express";
import pool from "../config/database.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();


// ========================================
// AJOUTER UN FILM AUX FAVORIS
// ========================================

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { movie_id } = req.body;
    const user_id = req.user.id;

    // Vérifier que movie_id existe
    if (!movie_id) {
      return res.status(400).json({
        message: "L'identifiant du film est obligatoire."
      });
    }

    // Vérifier si le film est déjà dans les favoris
    const existingFavorite = await pool.query(
      `SELECT * FROM favorites
       WHERE user_id = $1 AND movie_id = $2`,
      [user_id, movie_id]
    );

    if (existingFavorite.rows.length > 0) {
      return res.status(409).json({
        message: "Ce film est déjà dans vos favoris."
      });
    }

    // Ajouter le film aux favoris
    const result = await pool.query(
      `INSERT INTO favorites (user_id, movie_id)
       VALUES ($1, $2)
       RETURNING *`,
      [user_id, movie_id]
    );

    res.status(201).json({
      message: "Film ajouté aux favoris !",
      favorite: result.rows[0]
    });

  } catch (error) {
    console.error("Erreur ajout favori :", error);

    res.status(500).json({
      message: "Erreur serveur."
    });
  }
});


// ========================================
// RÉCUPÉRER LES FAVORIS
// ========================================

router.get("/", authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id;

    const result = await pool.query(
      `SELECT * FROM favorites
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [user_id]
    );

    res.json({
      favorites: result.rows
    });

  } catch (error) {
    console.error("Erreur récupération favoris :", error);

    res.status(500).json({
      message: "Erreur serveur."
    });
  }
});


// ========================================
// SUPPRIMER UN FAVORI
// ========================================

router.delete("/:movie_id", authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id;
    const { movie_id } = req.params;

    const result = await pool.query(
      `DELETE FROM favorites
       WHERE user_id = $1 AND movie_id = $2
       RETURNING *`,
      [user_id, movie_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Ce film n'est pas dans vos favoris."
      });
    }

    res.json({
      message: "Film retiré des favoris !",
      favorite: result.rows[0]
    });

  } catch (error) {
    console.error("Erreur suppression favori :", error);

    res.status(500).json({
      message: "Erreur serveur."
    });
  }
});


export default router;