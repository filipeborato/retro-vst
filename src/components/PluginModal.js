// components/PluginModal.js
import React from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "../styles/PluginModal.css";

function PluginModal({ plugin, onClose, paramValues, onParameterChange }) {
  const [file, setFile] = React.useState(null);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    const allowedExtensions = ["wav", "mp3", "ogg", "flac", "aiff"];

    if (!uploadedFile) {
      alert("Nenhum arquivo selecionado!");
      return;
    }

    const fileExtension = uploadedFile.name.split(".").pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      alert("Formato de arquivo inválido. Por favor, envie um arquivo de áudio válido.");
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

    // Normaliza os valores para garantir que estejam entre 0 e 1
    const normalizedParams = paramValues.map((val, i) => {
      const param = plugin.parameters[i];
      if (param.type === "slider") {
        return ((val - param.min) / (param.max - param.min)).toFixed(6);
      }
      return val;
    });

    const params = normalizedParams.map((val, i) => `p${i}=${val}`).join("&");

    const baseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:18080";
    const url = `${baseUrl}/process?plugin=${plugin.name}&preview=${preview}&${params}`;

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

  const renderParameterControl = (param, index) => {
    const value = paramValues[index];
    switch (param.type) {
      case "slider":
        return (
          <div key={index} className="param-control slider-control">
            <label>{param.name}</label>
            <Slider
              min={param.min}
              max={param.max}
              step={param.step}
              value={value}
              onChange={(val) => onParameterChange(index, val)}
            />
            <span>{value.toFixed(2)}</span>
          </div>
        );
      case "toggle":
        return (
          <div key={index} className="param-control toggle-control">
            <label>{param.name}</label>
            <button
              onClick={() => {
                const toggledValue = value === 1.0 ? 0.0 : 1.0;
                onParameterChange(index, toggledValue);
              }}
              className={value === 1.0 ? "toggle-on" : "toggle-off"}
            >
              {value === 1.0 ? "ON" : "OFF"}
            </button>
          </div>
        );
      case "select":
        return (
          <div key={index} className="param-control select-control">
            <label>{param.name}</label>
            <select
              value={value}
              onChange={(e) => onParameterChange(index, parseFloat(e.target.value))}
            >
              {param.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="modal" onClick={(e) => e.target.classList.contains("modal") && onClose()}>
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>✖</button>
        <h2>{plugin.name}</h2>
        <p>{plugin.description}</p>
        <div className="plugin-controls">
          <div className="scrollable-section">
            {plugin.parameters.map((param, i) => renderParameterControl(param, i))}
          </div>
        </div>
        <div className="file-upload">
          <input type="file" onChange={handleFileUpload} />
        </div>
        <div className="action-buttons">
          <button className="preview-button" onClick={() => handleSend(true)}>Preview</button>
          <button className="process-button" onClick={() => handleSend(false)}>Process</button>
        </div>
      </div>
    </div>
  );
}

export default PluginModal;