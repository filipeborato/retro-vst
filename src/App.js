// Importações necessárias para o React
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import PluginGrid from './components/PluginGrid';
import PluginModal from './components/PluginModal';
import './styles/App.css';

// Dados dos plugins
const plugins = [
  { id: 1, name: 'SynthWave 90', description: 'Um sintetizador básico com design de equalizador analógico.' },
  { id: 2, name: 'EchoRider', description: 'Delay e reverb com design de neon.' },
  { id: 3, name: 'Distort-o-Matic', description: 'Plugin de distorção com estética de painel industrial.' },
  { id: 4, name: 'CyberBass', description: 'Sintetizador de baixo com luzes piscantes.' },
  { id: 5, name: 'RetroEQ', description: 'Equalizador gráfico com sliders coloridos.' },
  { id: 6, name: 'TapeMachine', description: 'Simulador de fita cassete com botões de rotação vintage.' },
];

function App() {
  const [selectedPlugin, setSelectedPlugin] = useState(null);

  const openModal = (plugin) => {
    setSelectedPlugin(plugin);
  };

  const closeModal = () => {
    setSelectedPlugin(null);
  };

  return (
    <div className="app retro-theme">
      <Navbar user="John Doe" credits={42.50} />
      <h1 className="title">Retro VST Plugins</h1>
      <PluginGrid plugins={plugins} onPluginClick={openModal} />

      {selectedPlugin && (
        <PluginModal plugin={selectedPlugin} onClose={closeModal} />
      )}
    </div>
  );
}

export default App;