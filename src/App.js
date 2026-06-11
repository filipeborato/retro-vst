import React, { useState, useEffect, useCallback } from "react";
import Cookie from "js-cookie"; // Importa a biblioteca js-cookie
import Navbar from "./components/Navbar";
import PluginGrid from "./components/PluginGrid";
import PluginModal from "./components/PluginModal";
import LoginModal from "./components/LoginModal";
import { useToast } from "./components/Toast";
import "./styles/App.css";
import { SpeedInsights } from "@vercel/speed-insights/react";
import staticPlugins from "./Plugin.json";

function App() {
  const toast = useToast();
  const [loadedPlugins, setLoadedPlugins] = useState(staticPlugins);
  const [selectedPlugin, setSelectedPlugin] = useState(null);
  const [paramValues, setParamValues] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchPlugins = async () => {
      const baseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:18080";
      try {
        const response = await fetch(`${baseUrl}/plugins`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setLoadedPlugins(data);
          }
        }
      } catch (error) {
        console.warn("Failed to fetch plugins from server, using local fallback:", error);
      }
    };
    fetchPlugins();
  }, []);

  // Busca o profile a partir do token; usada no boot e logo após o login,
  // evitando o window.location.reload() que existia antes.
  const fetchProfile = useCallback(async () => {
    const token = Cookie.get("authToken");
    if (!token) return;
    try {
      const response = await fetch(
        process.env.REACT_APP_API_GO_URL + "/api/profile",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        setProfile(await response.json());
      } else if (response.status === 401) {
        // token expirado/inválido — limpa silenciosamente
        Cookie.remove("authToken");
        setProfile(null);
      } else {
        console.error("Error fetching profile data", response.status);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

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
    const pluginMeta = loadedPlugins.find((p) => p.id === selectedPlugin.id);
    if (
      pluginMeta &&
      typeof pluginMeta.parameters[index].defaultValue === "boolean"
    ) {
      updated[index] = newValue;
    } else {
      updated[index] = parseFloat(newValue.toFixed(2));
    }
    setParamValues(updated);
  };

  const openLoginModal = () => setShowLoginModal(true);
  const closeLoginModal = () => setShowLoginModal(false);

  // Ao fazer login/signup: salva o token e busca o profile sem reload.
  // O fechamento da modal fica a cargo do onClose do LoginModal (evita
  // dois setState concorrentes que reabriam a modal).
  const handleLogin = ({ token }) => {
    Cookie.set("authToken", token);
    fetchProfile();
  };

  const handleLogout = () => {
    Cookie.remove("authToken");
    setProfile(null);
    toast.info("Signed out.");
  };

  return (
    <div className="app">
      {/* atmospheric layers (behind content) */}
      <div className="atmosphere" aria-hidden="true" />
      <div className="rain" aria-hidden="true" />

      <Navbar
        profile={profile}
        onLogout={handleLogout}
        credits={profile ? profile.current_balance : 42.5}
        onLoginClick={openLoginModal}
      />

      <main className="main-content">
        <SpeedInsights />

        <header className="hero">
          <div className="hero-kicker">analog ghosts · vst host</div>
          <h1 className="title" data-text="RETRO·VST">
            RETRO<span className="accent">·</span>VST
          </h1>
          <p className="hero-sub">
            Run your audio through legacy VST effects, hosted on the wire.
            Rack them up. Dial them in. Hear the rain.
          </p>
        </header>

        <div className="section-rule">{"// effects rack"}</div>

        <PluginGrid plugins={loadedPlugins} onPluginClick={openModal} />

        {selectedPlugin && (
          <PluginModal
            plugin={selectedPlugin}
            onClose={closeModal}
            paramValues={paramValues}
            onParameterChange={handleParameterChange}
          />
        )}

        {showLoginModal && (
          <LoginModal onClose={closeLoginModal} onLogin={handleLogin} />
        )}
      </main>

      {/* foreground film/CRT layers (never block input) */}
      <div className="grain" aria-hidden="true" />
      <div className="crt-overlay" aria-hidden="true" />
    </div>
  );
}

export default App;
