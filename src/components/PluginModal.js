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
    const allowedTypes = ['audio/wav', 'audio/mp3', 'audio/ogg', 'audio/flac', 'audio/aiff', 'audio/x-wav', 'audio/x-aiff', 'audio/mpeg'];

    if (!uploadedFile) {
      alert('Nenhum arquivo selecionado!');
      return;
    }

    if (!allowedTypes.includes(uploadedFile.type)) {
      alert('Formato de arquivo inválido. Por favor, envie um arquivo de áudio válido (wav, mp3, ogg, flac, aiff).');
      return;
    }

    if (uploadedFile.size > 10 * 1024 * 1024) { // Limite de 10MB
      alert('O arquivo é muito grande. O limite é de 10MB.');
      return;
    }

    setFile(uploadedFile);
    alert(`Arquivo '${uploadedFile.name}' carregado com sucesso!`);
  };

  const handleSend = async () => {
    if (!file) {
      alert('Por favor, faça o upload de um arquivo antes de enviar!');
      return;
    }

    const url = `https://silver-trout-69jqgjwwpwvcxvqr-18080.app.github.dev/process?plugin=${plugin.name}&p0=${knobValues[0]}&p1=${knobValues[1]}&p2=${knobValues[2]}&p3=${knobValues[3]}`;

    const formData = new FormData();
    formData.append('audio_file', file);
    const headers = {
      'Access-Control-Allow-Origin': '*',      
    };
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: headers,        
      });

      if (!response.ok) {
        throw new Error('Erro ao processar o arquivo.');
      }

      const processedFile = await response.blob();
      const downloadUrl = URL.createObjectURL(processedFile);

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'processed_audio.wav';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert('Arquivo processado e baixado com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar o arquivo:', error);
      alert('Erro ao processar o arquivo. Por favor, tente novamente.');
    }
  };

  const handleBackdropClick = (event) => {
    if (event.target.classList.contains('modal')) {
      onClose();
    }
  };

  return (
    <div className="modal" onClick={handleBackdropClick}>
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