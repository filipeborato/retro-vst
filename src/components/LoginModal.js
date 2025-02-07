import React, { useState } from "react";
import "../styles/LoginModal.css";

function LoginModal({ onClose, onLogin }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Alterna entre Login e Signup e limpa mensagens de erro
  const handleToggleMode = () => {
    setIsSignup((prev) => !prev);
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignup ? "/signup" : "/login";

    // Para o signup, envia as chaves em minúsculas conforme o esperado pela API
    let requestBody;
    if (isSignup) {
      requestBody = {
        name: fullName,       // Alterado de "Name" para "name"
        email: email,
        password: password,
      };
    } else {
      requestBody = {
        email: email,
        password: password,
      };
    }

    try {
      const url = process.env.REACT_APP_API_GO_URL + endpoint;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.token;
        alert(`${data.message}\nToken: ${token || "N/A"}`);
        onLogin({ profile: data.profile, token });
        onClose();
      } else {
        const errorMessage = data.error || data.message || "Unknown error";
        setErrorMsg(errorMessage);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Error connecting to the server.");
    }
  };

  return (
    <div className="login-modal">
      <div className="login-modal-content">
        <button className="close-button" onClick={onClose}>
          ✖
        </button>
        <h2>{isSignup ? "Sign Up" : "Login"}</h2>
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">{isSignup ? "Sign Up" : "Login"}</button>
        </form>

        {/* Exibe a mensagem de erro, se houver */}
        {errorMsg && <p className="error-msg">{errorMsg}</p>}

        <button onClick={handleToggleMode} className="toggle-mode-button">
          {isSignup
            ? "Already have an account? Login"
            : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
}

export default LoginModal;
