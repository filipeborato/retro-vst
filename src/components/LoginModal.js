import React, { useState } from "react";
import "../styles/LoginModal.css";
import { useToast } from "./Toast";

function LoginModal({ onClose, onLogin }) {
  const toast = useToast();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const handleToggleMode = () => {
    setIsSignup((prev) => !prev);
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setBusy(true);

    const endpoint = isSignup ? "/signup" : "/login";
    const requestBody = isSignup
      ? { name: fullName, email, password }
      : { email, password };

    try {
      const url = process.env.REACT_APP_API_GO_URL + endpoint;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        toast.ok(data.message || (isSignup ? "Account created." : "Welcome back."));
        onLogin({ token: data.token });
        onClose();
      } else {
        setErrorMsg(data.error || data.message || "Unknown error");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Error connecting to the server.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="login-modal"
      onClick={(e) => e.target.classList.contains("login-modal") && onClose()}
    >
      <div className="login-panel">
        <button className="panel-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className="login-head">
          <span className="led" />
          <span className="login-kicker">
            {isSignup ? "// new credentials" : "// access terminal"}
          </span>
        </div>
        <h2 className="login-title">{isSignup ? "Sign Up" : "Login"}</h2>

        <form onSubmit={handleSubmit} className="login-form">
          {isSignup && (
            <label className="field">
              <span className="field-label">Full Name</span>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                autoFocus
              />
            </label>
          )}
          <label className="field">
            <span className="field-label">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="field">
            <span className="field-label">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {errorMsg && <p className="error-msg">{errorMsg}</p>}

          <button type="submit" className="login-submit" disabled={busy}>
            {busy ? "···" : isSignup ? "Create account" : "Authenticate"}
          </button>
        </form>

        <button onClick={handleToggleMode} className="toggle-mode">
          {isSignup
            ? "Already have an account? Login"
            : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
}

export default LoginModal;
