import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    // Récupérer le header Authorization
    const authHeader = req.headers.authorization;

    // Vérifier que le token existe
    if (!authHeader) {
      return res.status(401).json({
        message: "Accès refusé. Token manquant."
      });
    }

    // Vérifier le format : Bearer TOKEN
    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        message: "Format du token invalide."
      });
    }

    const token = parts[1];

    // Vérifier le token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Ajouter les informations de l'utilisateur à la requête
    req.user = decoded;

    // Autoriser la suite
    next();

  } catch (error) {
    console.error("Erreur JWT :", error);

    return res.status(401).json({
      message: "Token invalide ou expiré."
    });
  }
};

export default authMiddleware;