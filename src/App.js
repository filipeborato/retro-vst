// Importações necessárias para o React
import React, { useState } from 'react';

import Navbar from './components/Navbar';
import PluginGrid from './components/PluginGrid';
import PluginModal from './components/PluginModal';
import './styles/App.css';

// Dados dos plugins
const plugins = [
  { id: 1, name: 'ReverbFX', description: 'Adicione profundidade e ambiente ao seu áudio.' },
  { id: 2, name: 'CompMaster', description: 'Controle a dinâmica com compressão avançada.' },
  { id: 3, name: 'DelayLine', description: 'Crie ecos e efeitos de atraso com precisão.' },
  { id: 4, name: 'GraphicEQ', description: 'Ajuste frequências com este equalizador gráfico.' },
  { id: 5, name: 'ChorusPlus', description: 'Dê um toque de modulação ao seu som.' },
  { id: 6, name: 'DistortPro', description: 'Adicione distorção com controle e clareza.' },
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
      <h1 className="title">Retro VST Effects</h1>
      <PluginGrid plugins={plugins} onPluginClick={openModal} />

      {selectedPlugin && (
        <PluginModal plugin={selectedPlugin} onClose={closeModal} />
      )}
    </div>
  );
}

export default App;