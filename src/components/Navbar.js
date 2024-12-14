// components/Navbar.js
import React from 'react';
import '../styles/Navbar.css';

function Navbar({ user, credits }) {
  return (
    <div className="navbar">
      <div className="navbar-user">Conta: {user}</div>
      <div className="navbar-credits">Créditos: ${credits.toFixed(2)}</div>
    </div>
  );
}

export default Navbar;