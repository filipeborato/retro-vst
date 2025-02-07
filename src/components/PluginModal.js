// components/PluginModal.js
import React, { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "../styles/PluginModal.css";

import WaveformSelector from "./WaveformSelector"; // Componente para preview da waveform

function PluginModal({ plugin, onClose, paramValues, onParameterChange }) {
  const [file, setFile] = useState(null);
  const [previewStartTime, setPreviewStartTime] = useState(0);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    const allowedExtensions = ["wav", "mp3", "ogg", "flac", "aiff"];

    if (!uploadedFile) {
      alert("No file selected!");
      return;
    }

    const fileExtension = uploadedFile.name.split(".").pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      alert("Invalid file format. Please upload a valid audio file.");
      return;
    }
    if (uploadedFile.size > 80 * 1024 * 1024) {
      alert("The file is too large. The limit is 80MB.");
      return;
    }

    setFile(uploadedFile);
    alert(`File '${uploadedFile.name}' uploaded successfully!`);
  };

  const handleSend = async (preview = false) => {
    if (!file) {
      alert("Please upload a file before sending!");
      return;
    }

    const normalizedParams = paramValues.map((val, i) => {
      const param = plugin.parameters[i];
      if (param.type === "slider") {
        return ((val - param.min) / (param.max - param.min)).toFixed(6);
      }
      return val;
    });

    const params = normalizedParams.map((val, i) => `p${i}=${val}`).join("&");
    const baseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:18080";
    const url = `${baseUrl}/process?plugin=${plugin.name}&preview=${preview}&previewStartTime=${previewStartTime}&${params}`;

    const formData = new FormData();
    formData.append("audio_file", file);

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Server error: ${response.status} - ${errorText}`);
        alert(`Error processing the file: ${response.status}`);
        return;
      }

      const processedFile = await response.blob();
      if (processedFile.size === 0) {
        console.error("Received file is empty.");
        alert("Error: The received file is empty.");
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
          ? "Preview downloaded successfully!"
          : "File processed and downloaded successfully!"
      );
    } catch (error) {
      console.error("Error sending the file:", error);
      alert("Error processing the file. Please try again.");
    }
  };

  const renderParameterControl = (param, index) => {
    const value = paramValues[index];
    const displayLabel = param.label || param.name;
    switch (param.type) {
      case "slider":
        return (
          <div key={index} className="param-control slider-control">
            <label className="param-label">{displayLabel}</label>
            <Slider
              min={param.min}
              max={param.max}
              step={param.step}
              value={value}
              onChange={(val) => onParameterChange(index, val)}
            />
            <span className="param-value">{Number(value).toFixed(2)}</span>
          </div>
        );
      case "toggle":
        return (
          <div key={index} className="param-control toggle-control">
            <label className="param-label">{displayLabel}</label>
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
            <label className="param-label">{displayLabel}</label>
            <select
              value={value}
              onChange={(e) =>
                onParameterChange(index, parseFloat(e.target.value))
              }
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
    <div
      className="modal"
      onClick={(e) => e.target.classList.contains("modal") && onClose()}
    >
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          ✖
        </button>

        <div className="modal-body">
          <h2 className="modal-title">{plugin.name}</h2>
          <p className="modal-desc">{plugin.description}</p>

          {file && (
            <div className="waveform-section">
              <WaveformSelector
                file={file}
                previewStartTime={previewStartTime}
                setPreviewStartTime={setPreviewStartTime}
              />
            </div>
          )}

          <div className="plugin-controls">
            <h3 className="params-header">Parameters</h3>
            <div className="scrollable-section">
              {plugin.parameters.map((param, i) =>
                renderParameterControl(param, i)
              )}
            </div>
          </div>

          <div className="file-upload">
            <label className="file-label">
              Select Audio File:
              <input type="file" onChange={handleFileUpload} accept="audio/*" />
            </label>
          </div>
        </div>

        {/* Área fixa para botões e explicação */}
        <div className="modal-footer">
          <div className="button-info">
            <p>
              Choose "Preview" to listen to a short preview starting at the
              selected time, or "Process" to apply the effect and download the
              processed file.
            </p>
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
    </div>
  );
}

export default PluginModal;
