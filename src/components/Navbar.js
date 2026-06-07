import React from "react";
import "../styles/Navbar.css";

function Navbar({ profile, onLogout, credits, onLoginClick }) {
  return (
    <nav className="navbar metal">
      <div className="navbar-inner">
        {/* Brand — small neon wordmark + power LED */}
        <div className="navbar-brand">
          <span className="led" />
          <span className="brand-mark">RETRO<span>·</span>VST</span>
          <span className="brand-tag">{"// vst host"}</span>
        </div>

        {/* Right — credits readout + auth */}
        <div className="navbar-right">
          {profile ? (
            <>
              <div className="credits-readout" title="Account balance">
                <span className="credits-label">CR</span>
                <span className="credits-value">
                  {Number(credits ?? 0).toFixed(2)}
                </span>
              </div>
              <div className="profile-chip">
                <span className="led cyan" />
                <span className="profile-name">{profile.full_name}</span>
              </div>
              <button className="hw-btn" onClick={onLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <div className="profile-chip guest">
                <span className="led off" />
                <span className="profile-name">Guest</span>
              </div>
              <button className="hw-btn hw-btn-amber" onClick={onLoginClick}>
                Login / Signup
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
