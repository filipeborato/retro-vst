import React from "react";
import "../styles/Navbar.css";

function Navbar({ user, credits, notifications = [], onLoginClick }) {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <div className="navbar-user">Conta: {user}</div>
        <div className="navbar-credits">Créditos: ${credits.toFixed(2)}</div>
      </div>
      <div className="navbar-right">
        <div className="navbar-notifications">
          {notifications.map((note, index) => (
            <div key={index} className="notification-item">
              {note}
            </div>
          ))}
        </div>
        <button className="login-btn" onClick={onLoginClick}>
          Login
        </button>
      </div>
    </div>
  );
}

export default Navbar;