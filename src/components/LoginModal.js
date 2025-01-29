// components/LoginModal.js
import React, { useState } from "react";
import "../styles/LoginModal.css";

function LoginModal({ onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  // Alterna modo entre Login e Signup
  const handleToggleMode = () => {
    setIsSignup((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Define rota com base se for cadastro ou login
    const endpoint = isSignup ? "/signup" : "/login";

    // Monta o body de acordo com a necessidade da rota
    // Signup: requer 'Name', 'Email' e 'Password'
    // Login: requer 'Email' e 'Password'
    let requestBody;
    if (isSignup) {
      requestBody = {
        Name: name,
        Email: email,
        Password: password,
      };
    } else {
      requestBody = {
        Email: email,
        Password: password,
      };
    }

    try {
      const url = process.env.REACT_APP_API_GO_URL + endpoint 
      console.log(url)
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      // Se a resposta for OK, processa como JSON
      const data = await response.json();

      if (response.ok) {
        // data.message e data.token vindo do servidor
        alert(`${data.message}\nToken: ${data.token || 'N/A'}`);
        onClose();
      } else {
        // Caso de erro, data pode conter { message: 'erro' }
        alert(`Erro: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao conectar ao servidor.");
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
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
        <button onClick={handleToggleMode} className="toggle-mode-button">
          {isSignup
            ? "Já tem uma conta? Faça Login"
            : "Não tem conta? Cadastre-se"}
        </button>
      </div>
    </div>
  );
}

export default LoginModal;
