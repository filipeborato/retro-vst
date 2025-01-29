// App.js
// Aplicação principal do React Audio Plugins com botão de Login na Navbar.

import React, { useState } from "react";
import Navbar from "./components/Navbar";
import PluginGrid from "./components/PluginGrid";
import PluginModal from "./components/PluginModal";
import LoginModal from "./components/LoginModal";

import "./styles/App.css";
import { SpeedInsights } from "@vercel/speed-insights/react";

// Dados dos plugins
const plugins = [
  {
    id: 1,
    name: "TheFunction",
    description: "Plugin de espacialidade avançada",
    sliders: 7,
    sliderNames: [
      "Gain",
      "Gain L",
      "Gain R",
      "Phase L",
      "Phase R",
      "Pan L",
      "Pan R",
    ],
  },
  {
    id: 2,
    name: "CompMaster",
    description: "Controle dinâmico com compressão",
    sliders: 6,
    sliderNames: ["Threshold", "Ratio", "Attack", "Release", "Knee", "Gain"],
  },
  {
    id: 3,
    name: "DelayLine",
    description: "Criação de ecos precisos e efeitos de atraso",
    sliders: 6,
    sliderNames: ["Delay Time", "Feedback", "Mix", "Width", "Tone", "Damping"],
  },
  {
    id: 4,
    name: "GraphicEQ",
    description: "Equalizador gráfico com múltiplas bandas",
    sliders: 6,
    sliderNames: ["32Hz", "64Hz", "125Hz", "250Hz", "500Hz", "1kHz"],
  },
  {
    id: 5,
    name: "ChorusPlus",
    description: "Adicione modulação e profundidade",
    sliders: 6,
    sliderNames: ["Rate", "Depth", "Mix", "Width", "Feedback", "Tone"],
  },
  {
    id: 6,
    name: "DistortPro",
    description: "Adicione distorção com controle avançado",
    sliders: 6,
    sliderNames: ["Drive", "Tone", "Mix", "Level", "Bias", "Color"],
  },
];

function App() {
  // Estado para plugin selecionado
  const [selectedPlugin, setSelectedPlugin] = useState(null);
  const [sliderValues, setSliderValues] = useState([]);

  // Estado para login modal
  const [showLoginModal, setShowLoginModal] = useState(false);

  const openModal = (plugin) => {
    setSelectedPlugin(plugin);
    const sliderCount = plugin.sliders || 6;
    setSliderValues(Array(sliderCount).fill(0.5));
  };

  const closeModal = () => {
    setSelectedPlugin(null);
    setSliderValues([]);
  };

  const handleSliderChange = (index, value) => {
    const newValues = [...sliderValues];
    newValues[index] = parseFloat(value.toFixed(2));
    setSliderValues(newValues);
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
            sliders={sliderValues}
            onSliderChange={handleSliderChange}
          />
        )}

        {showLoginModal && <LoginModal onClose={toggleLoginModal} />}
      </div>
    </div>
  );
}

export default App;