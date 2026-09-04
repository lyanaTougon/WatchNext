import express from "express";
import pool from "../config/database.js";
import authMiddleware from "../middleware/auth.js";
import adminMiddleware from "../middleware/admin.js";

const router = express.Router();


// ============================================================
// VOIR TOUS LES UTILISATEURS
// ============================================================

router.get(
  "/users",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT id, username, email, role, created_at
         FROM users
         ORDER BY created_at DESC`
      );

      res.json({
        users: result.rows
      });

    } catch (error) {
      console.error("Erreur utilisateurs :", error);

      res.status(500).json({
        message: "Erreur serveur."
      });
    }
  }
);


// ============================================================
// SUPPRIMER UN UTILISATEUR
// ============================================================

router.delete(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const userId = req.params.id;

      // Empêche l'admin de supprimer son propre compte
      if (Number(userId) === Number(req.user.id)) {
        return res.status(400).json({
          message: "Tu ne peux pas supprimer ton propre compte."
        });
      }

      const result = await pool.query(
        `DELETE FROM users
         WHERE id = $1
         RETURNING id, username, email`,
        [userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "Utilisateur introuvable."
        });
      }

      res.json({
        message: "Utilisateur supprimé avec succès !",
        user: result.rows[0]
      });

    } catch (error) {
      console.error("Erreur suppression utilisateur :", error);

      res.status(500).json({
        message: "Erreur serveur."
      });
    }
  }
);


export default router;