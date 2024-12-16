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
      'Cookie': '.Tunnels.Relay.WebForwarding.Cookies=CfDJ8E0FHi1JCVNKrny-ARCYWxOCaU9ah93gm0S-dHy08mCQ0L4eWisO8xZY2iIYd8KyvvxLl9pTP18rHEbRwrZ7LpGLgv0ipn6uc_23MxUEfsmv5SBmuh0l-qZTt0n3wlsQqGriKjgoiBjIAXY83KY6_2AYqiIwc8QJ3ZEyj8pNt5izkxXmkhB_N5YoRBceqWNPNeOZNJSy-GROnwqm1TDbFwVUBPfh5W1gm-EhxjTik2hOmvfQjgb17wnB9bqnRyXf78l_NYDoaJMa41EWYDiddUP9dhOJvkp6B0VkONc1ENlF94KBDHEpwJ-EtJaI4p5YvKUcTW80wt2zYOWScKjw8otB_f00-K8EeslNqXbSavi0Yzm0ABjYa1_rpDS3Bd4PAzWdthR1Gy-kK3ni0Csy9zabyyooTizl8QzlfFGtXqhAoV2LaZ5eVY4HnSdfFLo10tWoU_d5YgG5Jp3UpBVIeCMzDEHLI0ycH5PAEP5FGtUcKLKc_YXTWaBtLcZ2hPsXZKivm4uKVW_s6QLAk8PcfhQE9qbdL45s36BsdlB9QT87LZefvY38dEJlp9azbK2t3M0Wo0rqoYEBn8he8JCb2KzZDGwK3HxbsgpLvxaK1B09SjYkwU8pAr3GfoS0ON1kaRjhnGw2vK9NcC5btxSof9d2YHSEzMHzl12KAC2vyN5tbspUVtTaJ3yU4iTDfR-UlrfIWhCRIF-fvjhQv9sZYpopB47dt0Rr3D1HyYFAQapMJmIgYgZeyTHARTpQ5l-XFMTY6tvMFKXZHZzLvGJ0QEfW4yhZqowgn-7h65AxVlMbHUW5NHaKfgLtze03GqNhUSZvSleYn1mNG_kEnZuW7FOc9dRI4tuWwj5rGfbQSxbuNmkE3dnlu0Z0pdHSlnMGWFfgg4OgW0DrqJ4L-m5lT78saA1kYxfHXoVfn0nIXVEqA8ClViUyEQgwEwcArAb-D9xxndlJdCnrvntqn3V0xE9--nCtbma15NhfSWpJjLworwhpMEzXa1fncywAbsNOwB6wPm4RKXlNg2GW1a1acEtR6Otzc9GfByAcEGwsJUyQ58N9tzkM2Vdpg2Uxzbn8UyQErTgG1MuyaoUTIEl_apfUrXDxjA9OQNzkfU1FR2RIrNNufJbGebaDAsu0XrrZlvXy61TQxwMs4AWNnkUeuJy6_zr-ZaL4bPCp4mAbAAcL3D5PnGynDEvNtKMktq6MIVe729yHhhc0a4GPThbzF7_8H0pLKT6d0h3jclnekkJKm7Ct4H8XCNRHhjtR0ktQqQL-jpEeHxRYz2Ur9Punc1XfwiBZ0vs3HvA3qpbEyl_ejsvTN5LvoXTlFVJe0voZtZvo2C-Ri7OJtHeeI9yT0VPesaVzLR9huJ3Lmw7PXwQETn9fx4x6QDaDVRHalGHFozF5lzyJ7s01fFQ2Jgm0bIjPrYmZPv_DQwhwCZDq7IqX0YK7H50fDhc3l98hqgTCFA2IZxGTgmXQTf62CVSSWVPNxwgzXLpu48D9eoIwuZqi_1d2fs-1HWRsGUnoYW-O__IwCFZB8paEvKi4r5fq64-fs0gsaNPqTGPksxHObOGaiSvuibsUmM9FdTxH_3OmJQ',      
    };
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: headers,
        credentials: 'include',        
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