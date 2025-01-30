import React, { useState } from "react";
import Navbar from "./components/Navbar";
import PluginGrid from "./components/PluginGrid";
import PluginModal from "./components/PluginModal";
import LoginModal from "./components/LoginModal";

import "./styles/App.css";
import { SpeedInsights } from "@vercel/speed-insights/react";

// Novo array de plugins com parâmetros de tipo slider, toggle e select
const plugins = [
  {
    id: 1,
    name: "TheFunction",
    description: "Plugin de espacialidade avançada",
    parameters: [
      {
        name: "Gain",
        type: "slider",
        min: 0.0,
        max: 1.0,
        step: 0.01,
        defaultValue: 0.5
      },
      {
        name: "Gain L",
        type: "slider",
        min: 0.0,
        max: 1.0,
        step: 0.01,
        defaultValue: 0.5
      },
      {
        name: "Gain R",
        type: "slider",
        min: 0.0,
        max: 1.0,
        step: 0.01,
        defaultValue: 0.5
      },
      {
        name: "Phase L",
        type: "slider",
        min: 0.0,
        max: 1.0,
        step: 0.01,
        defaultValue: 0.5
      },
      {
        name: "Phase R",
        type: "slider",
        min: 0.0,
        max: 1.0,
        step: 0.01,
        defaultValue: 0.5
      },
      {
        name: "Pan L",
        type: "slider",
        min: -1.0,
        max: 1.0,
        step: 0.01,
        defaultValue: 0.0
      },
      {
        name: "Pan R",
        type: "slider",
        min: -1.0,
        max: 1.0,
        step: 0.01,
        defaultValue: 0.0
      },
    ]
  },
  {
    id: 2,
    name: "CompMaster",
    description: "Controle dinâmico com compressão",
    parameters: [
      {
        name: "Threshold",
        type: "slider",
        min: -60,
        max: 0,
        step: 0.5,
        defaultValue: -24
      },
      {
        name: "Ratio",
        type: "slider",
        min: 1,
        max: 20,
        step: 0.5,
        defaultValue: 2
      },
      {
        name: "Attack",
        type: "slider",
        min: 0.0,
        max: 100.0,
        step: 1,
        defaultValue: 10
      },
      {
        name: "Release",
        type: "slider",
        min: 0.0,
        max: 500.0,
        step: 5,
        defaultValue: 50
      },
      {
        name: "Knee",
        type: "select",
        options: [
          { label: "Soft", value: 0.3 },
          { label: "Medium", value: 0.6 },
          { label: "Hard", value: 1.0 }
        ],
        defaultValue: 0.3
      },
      {
        name: "Gain",
        type: "slider",
        min: 0.0,
        max: 1.0,
        step: 0.01,
        defaultValue: 0.5
      },
    ]
  },
  {
    id: 3,
    name: "DelayLine",
    description: "Criação de ecos precisos e efeitos de atraso",
    parameters: [
      {
        name: "Delay Time",
        type: "slider",
        min: 0.0,
        max: 2000.0,
        step: 10,
        defaultValue: 500
      },
      {
        name: "Feedback",
        type: "slider",
        min: 0.0,
        max: 1.0,
        step: 0.01,
        defaultValue: 0.3
      },
      {
        name: "Mix",
        type: "slider",
        min: 0.0,
        max: 1.0,
        step: 0.01,
        defaultValue: 0.5
      },
      {
        name: "Width",
        type: "toggle",
        defaultValue: 1.0
      },
      {
        name: "Tone",
        type: "slider",
        min: 0.0,
        max: 1.0,
        step: 0.01,
        defaultValue: 0.5
      },
      {
        name: "Damping",
        type: "slider",
        min: 0.0,
        max: 1.0,
        step: 0.01,
        defaultValue: 0.2
      },
    ]
  },
  {
    id: 4,
    name: "GraphicEQ",
    description: "Equalizador gráfico com múltiplas bandas",
    parameters: [
      {
        name: "32Hz",
        type: "slider",
        min: -12,
        max: 12,
        step: 0.5,
        defaultValue: 0
      },
      {
        name: "64Hz",
        type: "slider",
        min: -12,
        max: 12,
        step: 0.5,
        defaultValue: 0
      },
      {
        name: "125Hz",
        type: "slider",
        min: -12,
        max: 12,
        step: 0.5,
        defaultValue: 0
      },
      {
        name: "250Hz",
        type: "slider",
        min: -12,
        max: 12,
        step: 0.5,
        defaultValue: 0
      },
      {
        name: "500Hz",
        type: "slider",
        min: -12,
        max: 12,
        step: 0.5,
        defaultValue: 0
      },
      {
        name: "1kHz",
        type: "slider",
        min: -12,
        max: 12,
        step: 0.5,
        defaultValue: 0
      },
    ]
  },
  {
    id: 5,
    name: "ChorusPlus",
    description: "Adicione modulação e profundidade",
    parameters: [
      {
        name: "Rate",
        type: "slider",
        min: 0.0,
        max: 5.0,
        step: 0.01,
        defaultValue: 1.0
      },
      {
        name: "Depth",
        type: "slider",
        min: 0.0,
        max: 1.0,
        step: 0.01,
        defaultValue: 0.5
      },
      {
        name: "Mix",
        type: "slider",
        min: 0.0,
        max: 1.0,
        step: 0.01,
        defaultValue: 0.5
      },
      {
        name: "Width",
        type: "slider",
        min: 0.0,
        max: 1.0,
        step: 0.01,
        defaultValue: 1.0
      },
      {
        name: "Feedback",
        type: "toggle",
        defaultValue: 0.0
      },
      {
        name: "Tone",
        type: "slider",
        min: 0.0,
        max: 1.0,
        step: 0.01,
        defaultValue: 0.5
      },
    ]
  },
  {
    id: 6,
    name: "DistortPro",
    description: "Adicione distorção com controle avançado",
    parameters: [
      {
        name: "Drive",
        type: "slider",
        min: 0.0,
        max: 1.0,
        step: 0.01,
        defaultValue: 0.5
      },
      {
        name: "Tone",
        type: "slider",
        min: 0.0,
        max: 1.0,
        step: 0.01,
        defaultValue: 0.5
      },
      {
        name: "Mix",
        type: "slider",
        min: 0.0,
        max: 1.0,
        step: 0.01,
        defaultValue: 0.5
      },
      {
        name: "Level",
        type: "slider",
        min: 0.0,
        max: 1.0,
        step: 0.01,
        defaultValue: 0.8
      },
      {
        name: "Bias",
        type: "slider",
        min: 0.0,
        max: 1.0,
        step: 0.01,
        defaultValue: 0.2
      },
      {
        name: "Color",
        type: "select",
        options: [
          { label: "Warm", value: 0.4 },
          { label: "Bright", value: 0.7 },
          { label: "Dark", value: 0.2 }
        ],
        defaultValue: 0.4
      },
    ]
  },
];

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
      // defaultValue é float
      return param.defaultValue || 0.0;
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
    updated[index] = parseFloat(newValue.toFixed(2));
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