import { useEffect, useState } from "react";
import "./seconnecter.css";

function SeConnecter() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  // ============================================================
  // RÉCUPÉRER L'UTILISATEUR CONNECTÉ
  // ============================================================

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        const utilisateur = JSON.parse(savedUser);
        setUser(utilisateur);
      } catch (error) {
        console.error("Erreur utilisateur :", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  // ============================================================
  // RÉCUPÉRER LES UTILISATEURS SI ADMIN
  // ============================================================

  useEffect(() => {
    if (user?.role === "admin") {
      loadUsers();
    }
  }, [user]);

  async function loadUsers() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUsers(data.users);
      } else {
        setMessage(
          data.message ||
            "Impossible de récupérer les utilisateurs."
        );
      }
    } catch (error) {
      console.error("Erreur utilisateurs :", error);

      setMessage(
        "Impossible de contacter le serveur."
      );
    }
  }

  // ============================================================
  // CONNEXION
  // ============================================================

  async function handleSubmit(event) {
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
          data.message ||
            "Email ou mot de passe incorrect."
        );
        return;
      }

      // Enregistrer le token
      localStorage.setItem(
        "token",
        data.token
      );

      // Enregistrer l'utilisateur
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // Mettre à jour l'état
      setUser(data.user);

      // Vider le formulaire
      setEmail("");
      setPassword("");

      setMessage("Connexion réussie !");

      // Charger les utilisateurs si admin
      if (data.user.role === "admin") {
        loadUsers();
      }
    } catch (error) {
      console.error("Erreur connexion :", error);

      setMessage(
        "Impossible de contacter le serveur."
      );
    } finally {
      setLoading(false);
    }
  }

  // ============================================================
  // DÉCONNEXION
  // ============================================================

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setUsers([]);

    // Retour à l'accueil
    window.location.href = "/";
  }

  // ============================================================
  // SUPPRIMER UN UTILISATEUR
  // ============================================================

  async function deleteUser(id) {
    if (
      !window.confirm(
        "Voulez-vous vraiment supprimer cet utilisateur ?"
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage(
          "Vous devez être connecté."
        );
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/admin/users/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Impossible de supprimer l'utilisateur."
        );
        return;
      }

      setMessage(
        "Utilisateur supprimé avec succès !"
      );

      // Recharger la liste
      loadUsers();
    } catch (error) {
      console.error(
        "Erreur suppression :",
        error
      );

      setMessage(
        "Impossible de contacter le serveur."
      );
    }
  }

  // ============================================================
  // UTILISATEUR CONNECTÉ
  // ============================================================

  if (user) {
    const admin = user.role === "admin";

    return (
      <div className="connexion-page">

        {/* ==================================================
            COMPTE
        ================================================== */}

        <div className="account-box">

          <h2>
            {admin
              ? "👑 Administration"
              : "👤 Mon compte"}
          </h2>

          <div className="account-info">
            <h3>
              Bonjour {user.username} 👋
            </h3>
          </div>

          <button
            type="button"
            className="logout-button"
            onClick={logout}
          >
            Se déconnecter
          </button>

        </div>

        {/* ==================================================
            ADMINISTRATION
        ================================================== */}

        {admin && (
          <div className="admin-users-box">

            <h2>
              👥 Liste des utilisateurs
            </h2>

            {users.length === 0 ? (
              <p>
                Aucun utilisateur trouvé.
              </p>
            ) : (
              <div className="users-list">

                {users.map((utilisateur) => (
                  <div
                    className="user-row"
                    key={utilisateur.id}
                  >

                    <div className="user-info">

                      <strong>
                        {utilisateur.username}
                      </strong>

                      <span>
                        ID : {utilisateur.id}
                      </span>

                    </div>

                    {/* L'admin ne peut pas
                        supprimer son propre compte */}

                    {Number(utilisateur.id) !==
                      Number(user.id) && (
                      <button
                        type="button"
                        className="delete-user-button"
                        onClick={() =>
                          deleteUser(
                            utilisateur.id
                          )
                        }
                      >
                        🗑️ Supprimer
                      </button>
                    )}

                  </div>
                ))}

              </div>
            )}

          </div>
        )}

        {/* ==================================================
            MESSAGE
        ================================================== */}

        {message && (
          <p className="connexion-message">
            {message}
          </p>
        )}

      </div>
    );
  }

  // ============================================================
  // FORMULAIRE DE CONNEXION
  // ============================================================

  return (
    <div className="connexion-page">

      <div className="seconnecter-container">

        <h1>
          Se connecter
        </h1>

        <p className="seconnecter-description">
          Connectez-vous à votre compte WatchNext
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
              placeholder="Votre adresse email"
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
              placeholder="Votre mot de passe"
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