import React, { useState } from "react";
import Navbar from "./components/Navbar";
import PluginGrid from "./components/PluginGrid";
import PluginModal from "./components/PluginModal";
import LoginModal from "./components/LoginModal";

import "./styles/App.css";
import { SpeedInsights } from "@vercel/speed-insights/react";

// Importa o arquivo JSON diretamente
import plugins from './Plugin.json';

function App() {
  // Estado para plugin selecionado
  const [selectedPlugin, setSelectedPlugin] = useState(null);
  // Armazena valores de cada parâmetro do plugin selecionado
  const [paramValues, setParamValues] = useState([]);

  // Estado para login modal
  const [showLoginModal, setShowLoginModal] = useState(false);

  const openModal = (plugin) => {
    setSelectedPlugin(plugin);
    // Inicializa paramValues com base em parameters
    const initialValues = plugin.parameters.map((param) => {
      // defaultValue é float ou boolean para toggles
      return param.defaultValue !== undefined ? param.defaultValue : 0.0;
    });
    setParamValues(initialValues);
  };

  const closeModal = () => {
    setSelectedPlugin(null);
    setParamValues([]);
  };

  // Atualiza valor de um parâmetro
  const handleParameterChange = (index, newValue) => {
    const updated = [...paramValues];
    // Verifica se o parâmetro é um toggle (booleano)
    if (typeof plugins[selectedPlugin.id - 1].parameters[index].defaultValue === 'boolean') {
      updated[index] = newValue;
    } else {
      updated[index] = parseFloat(newValue.toFixed(2));
    }
    setParamValues(updated);
  };

  // Alterna a exibição da modal de login
  const toggleLoginModal = () => {
    setShowLoginModal((prev) => !prev);
  };

  return (
    <div className="app retro-theme full-height">
      <Navbar
        user="John Doe"
        credits={42.5}
        notifications={["Bem-vindo ao Retro VST!", "Atualização disponível para TheFunction"]}
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

        {showLoginModal && <LoginModal onClose={toggleLoginModal} />}
      </div>
    </div>
  );
}

export default App;
