import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/database.js";

const router = express.Router();

/* =========================================
   INSCRIPTION
========================================= */

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Tous les champs sont obligatoires."
      });
    }

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "Cette adresse email est déjà utilisée."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users
       (username, email, password, role)
       VALUES ($1, $2, $3, 'user')
       RETURNING id, username, email, role, created_at`,
      [username, email, hashedPassword]
    );

    res.status(201).json({
      message: "Compte créé avec succès !",
      user: result.rows[0]
    });

  } catch (error) {
    console.error("Erreur inscription :", error);

    res.status(500).json({
      message: "Erreur serveur."
    });
  }
});


/* =========================================
   CONNEXION
========================================= */

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérification des champs
    if (!email || !password) {
      return res.status(400).json({
        message: "L'email et le mot de passe sont obligatoires."
      });
    }

    // Recherche de l'utilisateur
    const result = await pool.query(
      `SELECT id, username, email, password, role
       FROM users
       WHERE email = $1`,
      [email]
    );

    // Utilisateur introuvable
    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect."
      });
    }

    const user = result.rows[0];

    // Vérification du mot de passe
    const passwordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordCorrect) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect."
      });
    }

    // Création du token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    // Réponse
    res.json({
      message: "Connexion réussie !",
      token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Erreur connexion :", error);

    res.status(500).json({
      message: "Erreur serveur."
    });
  }
});


export default router;