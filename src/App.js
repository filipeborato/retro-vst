// Importações necessárias para o React
import React, { useState } from 'react';

import Navbar from './components/Navbar';
import PluginGrid from './components/PluginGrid';
import PluginModal from './components/PluginModal';
import './styles/App.css';

// Dados dos plugins
const plugins = [
  { id: 1, name: 'TheFunction', description: 'Altera a espacialidade e cria noção de stereo', sliders: 7 },
  { id: 2, name: 'CompMaster', description: 'Controle a dinâmica com compressão avançada.', sliders: 6 },
  { id: 3, name: 'DelayLine', description: 'Crie ecos e efeitos de atraso com precisão.', sliders: 6 },
  { id: 4, name: 'GraphicEQ', description: 'Ajuste frequências com este equalizador gráfico.', sliders: 6 },
  { id: 5, name: 'ChorusPlus', description: 'Dê um toque de modulação ao seu som.', sliders: 6 },
  { id: 6, name: 'DistortPro', description: 'Adicione distorção com controle e clareza.', sliders: 6 },
];

function App() {
  const [selectedPlugin, setSelectedPlugin] = useState(null);
  const [sliderValues, setSliderValues] = useState([]); // Dinâmico com base no plugin

  const openModal = (plugin) => {
    setSelectedPlugin(plugin);
    const sliderCount = plugin.sliders || 6; // Padrão de 6 sliders
    setSliderValues(Array(sliderCount).fill(0.5)); // Inicializa sliders com valor 0.5
  };

  const closeModal = () => {
    setSelectedPlugin(null);
    setSliderValues([]); // Limpa os sliders
  };

  const handleSliderChange = (index, value) => {
    const newValues = [...sliderValues];
    newValues[index] = parseFloat(value.toFixed(2)); // Garante valores entre 0.01 e 1 com 2 casas decimais
    setSliderValues(newValues);
  };

  return (
    <div className="app retro-theme full-height">
      <Navbar user="John Doe" credits={42.50} />
      <div className="main-content">
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
      </div>
    </div>
  );
}

export default App;