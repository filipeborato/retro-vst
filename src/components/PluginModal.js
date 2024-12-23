// components/PluginModal.js
import React, { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "../styles/PluginModal.css";

function PluginModal({ plugin, onClose }) {
  const [knobValues, setKnobValues] = useState(Array(plugin.sliders).fill(0.5)); // Inicializa dinamicamente os sliders
  const [file, setFile] = useState(null);

  const handleKnobChange = (index, value) => {
    const updatedKnobs = [...knobValues];
    updatedKnobs[index] = parseFloat(value.toFixed(2)); // Garante precisão de 2 casas decimais
    setKnobValues(updatedKnobs);
  };

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    const allowedExtensions = ["wav", "mp3", "ogg", "flac", "aiff"];

    if (!uploadedFile) {
      alert("Nenhum arquivo selecionado!");
      return;
    }

    const fileExtension = uploadedFile.name.split(".").pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      alert(
        "Formato de arquivo inválido. Por favor, envie um arquivo de áudio válido."
      );
      return;
    }
    if (uploadedFile.size > 10 * 1024 * 1024) {
      alert("O arquivo é muito grande. O limite é de 10MB.");
      return;
    }

    setFile(uploadedFile);
    alert(`Arquivo '${uploadedFile.name}' carregado com sucesso!`);
  };

  const handleSend = async (preview = false) => {
    if (!file) {
      alert("Por favor, faça o upload de um arquivo antes de enviar!");
      return;
    }

    const params = knobValues
      .map((value, index) => `p${index}=${value}`)
      .join("&");
    const url = `https://ec2-52-67-58-213.sa-east-1.compute.amazonaws.com/process?plugin=${plugin.name}&preview=${preview}&${params}`;

    const formData = new FormData();
    formData.append("audio_file", file);

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Erro do servidor: ${response.status} - ${errorText}`);
        alert(`Erro ao processar o arquivo: ${response.status}`);
        return;
      }

      const processedFile = await response.blob();
      if (processedFile.size === 0) {
        console.error("Arquivo recebido está vazio.");
        alert("Erro: O arquivo recebido está vazio.");
        return;
      }

      const downloadUrl = URL.createObjectURL(processedFile);
      const link = document.createElement("a");
      link.href = downloadUrl;

      link.download = preview ? "preview_audio.wav" : "processed_audio.wav";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert(
        preview
          ? "Pré-visualização baixada com sucesso!"
          : "Arquivo processado e baixado com sucesso!"
      );
    } catch (error) {
      console.error("Erro ao enviar o arquivo:", error);
      alert("Erro ao processar o arquivo. Por favor, tente novamente.");
    }
  };

  return (
    <div
      className="modal"
      onClick={(e) => e.target.classList.contains("modal") && onClose()}
    >
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          ✖
        </button>
        <h2>{plugin.name}</h2>
        <p>{plugin.description}</p>
        <div className="plugin-controls">
          <div className="scrollable-section">
            {knobValues.map((value, index) => (
              <div key={index} className="plugin-slider">
                <Slider
                  min={0.01}
                  max={1}
                  step={0.01}
                  value={value}
                  onChange={(val) => handleKnobChange(index, val)}
                />
                <p>{`${plugin.sliderNames[index]}: ${value.toFixed(2)}`}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="file-upload">
          <input type="file" onChange={handleFileUpload} />
        </div>
        <div className="action-buttons">
          <button className="preview-button" onClick={() => handleSend(true)}>
            Preview
          </button>
          <button className="process-button" onClick={() => handleSend(false)}>
            Process
          </button>
        </div>
      </div>
    </div>
  );
}

export default PluginModal;
