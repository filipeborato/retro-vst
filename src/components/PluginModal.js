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

    // Normalize the parameter values to be between 0 and 1
    const normalizedParams = paramValues.map((val, i) => {
      const param = plugin.parameters[i];
      if (param.type === "slider") {
        return ((val - param.min) / (param.max - param.min)).toFixed(6);
      }
      return val;
    });

    const params = normalizedParams.map((val, i) => `p${i}=${val}`).join("&");

    const baseUrl =
      process.env.REACT_APP_API_BASE_URL || "http://localhost:18080";
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
        <h2>{plugin.name}</h2>
        <p>{plugin.description}</p>
        <div className="plugin-controls">
          <div className="scrollable-section">
            {plugin.parameters.map((param, i) =>
              renderParameterControl(param, i)
            )}
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
