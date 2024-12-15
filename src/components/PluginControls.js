// components/PluginControls.js
import React, { useState } from 'react';
import '../styles/PluginControls.css';

function PluginControls({ plugin }) {
  const buttonCount = plugin.id === 1 ? 3 : 4;
  const [knobValues, setKnobValues] = useState(Array(buttonCount).fill(0));
  const [bucketLink, setBucketLink] = useState('');

  const handleKnobChange = (index, value) => {
    const updatedValues = [...knobValues];
    updatedValues[index] = value;
    setKnobValues(updatedValues);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['audio/wav', 'audio/mpeg', 'audio/ogg', 'audio/flac', 'audio/aiff'];
      if (!allowedTypes.includes(file.type)) {
        alert('Formato de arquivo inválido. Por favor, envie um arquivo de áudio válido (wav, mp3, ogg, flac, aiff).');
        return;
      }

      const simulatedLink = `https://bucket.example.com/${file.name}`;
      setBucketLink(simulatedLink);
      alert(`Arquivo '${file.name}' enviado para o bucket com sucesso!`);
    }
  };

  const handleSend = () => {
    if (!bucketLink) {
      alert('Por favor, faça o upload antes de enviar!');
      return;
    }

    const payload = {
      plugin: plugin.name,
      knobs: knobValues,
      bucketLink: bucketLink,
    };

    // Simula o envio do payload para o servidor
    console.log('Enviando para o servidor:', payload);
    alert('Parâmetros enviados para o servidor com sucesso!');
  };

  const knobs = Array.from({ length: buttonCount }, (_, i) => (
    <div key={i} className="knob">
      <input
        type="range"
        min="0"
        max="1000"
        value={knobValues[i]}
        onChange={(e) => handleKnobChange(i, parseInt(e.target.value, 10))}
        className="slider"
      />
      <div>Knob {i + 1}: {knobValues[i]}</div>
    </div>
  ));

  return (
    <div className="plugin-controls">
      <h3>Controles do {plugin.name}</h3>
      <div className="knobs-container">{knobs}</div>
      <div className="button-container">
        <input
          type="file"
          accept=".wav,.mp3,.ogg,.flac,.aiff"
          onChange={handleFileUpload}
          className="upload-input"
        />
        <button className="send-button" onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default PluginControls;