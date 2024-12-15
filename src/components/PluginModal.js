// components/PluginModal.js
import React, { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import '../styles/PluginModal.css';

function PluginModal({ plugin, onClose }) {
  const knobCount = 4; // Quantidade de sliders por plugin
  const [knobValues, setKnobValues] = useState(Array(knobCount).fill(500));
  const [file, setFile] = useState(null);

  const handleKnobChange = (index, value) => {
    const updatedKnobs = [...knobValues];
    updatedKnobs[index] = value;
    setKnobValues(updatedKnobs);
  };

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
    alert(`Arquivo '${uploadedFile.name}' carregado com sucesso!`);
  };

  const handleSend = () => {
    if (!file) {
      alert('Por favor, faça o upload de um arquivo antes de enviar!');
      return;
    }
    const payload = {
      plugin: plugin.name,
      knobs: knobValues,
      fileName: file.name,
    };
    console.log('Enviando para o servidor:', payload);
    alert('Parâmetros enviados com sucesso!');
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{plugin.name}</h2>
        <p>{plugin.description}</p>
        <div className="plugin-controls">
          {knobValues.map((value, index) => (
            <div key={index} className="plugin-slider">
              <Slider
                min={0}
                max={1000}
                value={value}
                onChange={(val) => handleKnobChange(index, val)}
              />
              <p>Slider {index + 1}: {value}</p>
            </div>
          ))}
        </div>
        <div className="file-upload">
          <input type="file" onChange={handleFileUpload} />
        </div>
        <div className="action-buttons">
          <button className="send-button" onClick={handleSend}>Enviar</button>
          <button className="close-button" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
}

export default PluginModal;
