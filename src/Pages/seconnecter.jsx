import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./seconnecter.css";

function SeConnecter() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Email ou mot de passe incorrect."
        );
        return;
      }

      // ========================================
      // SAUVEGARDER LE TOKEN JWT
      // ========================================

      localStorage.setItem("token", data.token);

      // Sauvegarder également les informations de l'utilisateur
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setMessage("Connexion réussie !");

      // Retour à l'accueil
      setTimeout(() => {
        navigate("/");
      }, 500);

    } catch (error) {
      console.error("Erreur connexion :", error);

      setMessage(
        "Impossible de contacter le serveur."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seconnecter-page">

      <div className="seconnecter-container">

        <h1>Se connecter</h1>

        <p className="seconnecter-description">
          Connecte-toi à ton compte WatchNext
        </p>

        <form onSubmit={handleSubmit}>

          {/* EMAIL */}

          <div className="form-group">

            <label htmlFor="email">
              Adresse email
            </label>

            <input
              id="email"
              type="email"
              placeholder="ton@email.com"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />

          </div>


          {/* MOT DE PASSE */}

          <div className="form-group">

            <label htmlFor="password">
              Mot de passe
            </label>

            <input
              id="password"
              type="password"
              placeholder="Ton mot de passe"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
            />

          </div>


          {/* BOUTON */}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading
              ? "Connexion..."
              : "Se connecter"}
          </button>

        </form>


        {/* MESSAGE */}

        {message && (
          <p className="login-message">
            {message}
          </p>
        )}

      </div>

    </div>
  );
}

export default SeConnecter;