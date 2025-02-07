import React from "react";
import "../styles/Navbar.css";

function Navbar({ profile, onLogout, credits, onLoginClick }) {
  return (
    <nav className="navbar">
      {/* Lado esquerdo: exibe o nome e os créditos do usuário (em duas linhas) ou "Guest" se não estiver logado */}
      <div className="navbar-left">
        {profile ? (
          <div className="profile-info">
            <div className="profile-name">{profile.full_name}</div>
            <div className="profile-credits">Credits: {profile.current_balance}</div>
          </div>
        ) : (
          <div className="guest-info">
            <span className="navbar-user">Guest</span>
          </div>
        )}
      </div>

      {/* Centro: Título da aplicação */}
      <div className="navbar-center">Retro VST Effects</div>

      {/* Lado direito: exibe o botão de logout se estiver logado; caso contrário, exibe o botão de Login/Signup */}
      <div className="navbar-right">
        {profile ? (
          <button className="login-btn" onClick={onLogout}>
            Logout
          </button>
        ) : (
          <button className="login-btn" onClick={onLoginClick}>
            Login / Signup
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
