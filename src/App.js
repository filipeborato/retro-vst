import React, { useState, useEffect } from "react";
import Cookie from "js-cookie"; // Importa a biblioteca js-cookie
import Navbar from "./components/Navbar";
import PluginGrid from "./components/PluginGrid";
import PluginModal from "./components/PluginModal";
import LoginModal from "./components/LoginModal";
import "./styles/App.css";
import { SpeedInsights } from "@vercel/speed-insights/react";
import plugins from "./Plugin.json";

function App() {
  const [selectedPlugin, setSelectedPlugin] = useState(null);
  const [paramValues, setParamValues] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [profile, setProfile] = useState(null);

  // Ao carregar a página, verifica se existe token no cookie
  // Se existir, faz uma requisição para a rota /profile para obter os dados do usuário
  useEffect(() => {
    const token = Cookie.get("authToken");
    if (token) {
      const fetchProfile = async () => {
        try {
          // Alterado de "/profile" para "/api/profile"
          const response = await fetch(
            process.env.REACT_APP_API_GO_URL + "/api/profile",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              }
            }
          );
          if (response.ok) {
            const profileData = await response.json();
            setProfile(profileData);
          } else {
            console.error("Error fetching profile data", response.status);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      };
      fetchProfile();
    }
  }, []);

  const openModal = (plugin) => {
    setSelectedPlugin(plugin);
    const initialValues = plugin.parameters.map((param) =>
      param.defaultValue !== undefined ? param.defaultValue : 0.0
    );
    setParamValues(initialValues);
  };

  const closeModal = () => {
    setSelectedPlugin(null);
    setParamValues([]);
  };

  const handleParameterChange = (index, newValue) => {
    const updated = [...paramValues];
    if (
      typeof plugins[selectedPlugin.id - 1].parameters[index].defaultValue ===
      "boolean"
    ) {
      updated[index] = newValue;
    } else {
      updated[index] = parseFloat(newValue.toFixed(2));
    }
    setParamValues(updated);
  };

  const toggleLoginModal = () => {
    setShowLoginModal((prev) => !prev);
  };

  // Ao fazer login ou signup, salva o token no cookie e recarrega a página
  const handleLogin = ({ profile, token }) => {
    Cookie.set("authToken", token);
    // Recarrega a página para disparar a lógica de carregamento do profile
    window.location.reload();
  };

  // Logout: remove o token do cookie e recarrega a página
  const handleLogout = () => {
    Cookie.remove("authToken");
    window.location.reload();
  };

  return (
    <div className="app retro-theme full-height">
      <Navbar
        profile={profile}
        onLogout={handleLogout}
        credits={profile ? profile.current_balance : 42.5}
        onLoginClick={toggleLoginModal}
      />
      <div className="main-content">
        <SpeedInsights />
        <h1 className="title">Retro VST Effects</h1>
        <PluginGrid plugins={plugins} onPluginClick={openModal} />

        {selectedPlugin && (
          <PluginModal
            plugin={selectedPlugin}
            onClose={closeModal}
            paramValues={paramValues}
            onParameterChange={handleParameterChange}
          />
        )}

        {showLoginModal && (
          <LoginModal onClose={toggleLoginModal} onLogin={handleLogin} />
        )}
      </div>
    </div>
  );
}

export default App;
