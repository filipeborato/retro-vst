import React, { useEffect, useRef, useState } from "react";
import "../styles/PluginModal.css";

import Knob from "./Knob";
import WaveformSelector from "./WaveformSelector";
import { useToast } from "./Toast";

const ALLOWED = ["wav", "mp3", "ogg", "flac", "aiff"];
const MAX_BYTES = 80 * 1024 * 1024;

function PluginModal({ plugin, onClose, paramValues, onParameterChange }) {
  const toast = useToast();
  const [file, setFile] = useState(null);
  const [previewStartTime, setPreviewStartTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingKind, setLoadingKind] = useState(null); // "preview" | "process"
  const [result, setResult] = useState(null); // { url, name, isPreview }

  // close on Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // revoke object URLs on unmount / when replaced
  const resultRef = useRef(null);
  useEffect(() => {
    resultRef.current = result;
  }, [result]);
  useEffect(() => {
    return () => {
      if (resultRef.current?.url) URL.revokeObjectURL(resultRef.current.url);
    };
  }, []);

  const handleFileUpload = (event) => {
    const uploaded = event.target.files[0];
    if (!uploaded) return;

    const ext = uploaded.name.split(".").pop().toLowerCase();
    if (!ALLOWED.includes(ext)) {
      toast.err(`Unsupported format ".${ext}". Use ${ALLOWED.join(", ")}.`);
      return;
    }
    if (uploaded.size > MAX_BYTES) {
      toast.err("File too large — limit is 80 MB.");
      return;
    }
    setFile(uploaded);
    setResult(null);
    toast.ok(`Loaded "${uploaded.name}".`);
  };

  const handleSend = async (preview = false) => {
    if (!file) {
      toast.err("Load an audio file first.");
      return;
    }

    setIsLoading(true);
    setLoadingKind(preview ? "preview" : "process");

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
    const url = `${baseUrl}/process?plugin=${plugin.name}&preview=${preview}&previewStartTime=${previewStartTime}&${params}`;

    const formData = new FormData();
    formData.append("audio_file", file);

    try {
      const response = await fetch(url, { method: "POST", body: formData });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        console.error(`Server error: ${response.status} - ${errorText}`);
        toast.err(`Processing failed (${response.status}).`);
        return;
      }

      const blob = await response.blob();
      if (blob.size === 0) {
        toast.err("The server returned an empty file.");
        return;
      }

      // replace previous result (revoke old url)
      if (resultRef.current?.url) URL.revokeObjectURL(resultRef.current.url);
      const objectUrl = URL.createObjectURL(blob);
      setResult({
        url: objectUrl,
        name: preview ? "preview_audio.wav" : "processed_audio.wav",
        isPreview: preview,
      });
      toast.ok(preview ? "Preview ready — press play." : "Processed — press play.");
    } catch (error) {
      console.error("Error sending the file:", error);
      toast.err("Network error. Please try again.");
    } finally {
      setIsLoading(false);
      setLoadingKind(null);
    }
  };

  const renderControl = (param, index) => {
    const value = paramValues[index];
    const displayLabel = param.label || param.name;

    switch (param.type) {
      case "slider":
        return (
          <Knob
            key={index}
            label={displayLabel}
            value={value}
            min={param.min}
            max={param.max}
            step={param.step}
            defaultValue={param.defaultValue}
            disabled={isLoading}
            color={param.min < 0 ? "cyan" : "sodium"}
            onChange={(v) => onParameterChange(index, v)}
          />
        );

      case "toggle":
        return (
          <div key={index} className="hw-toggle">
            <span className="hw-toggle-label">{displayLabel}</span>
            <button
              type="button"
              className={`switch ${value === 1.0 ? "on" : "off"}`}
              onClick={() => onParameterChange(index, value === 1.0 ? 0.0 : 1.0)}
              disabled={isLoading}
              aria-pressed={value === 1.0}
            >
              <span className="switch-track">
                <span className="switch-thumb" />
              </span>
              <span className="switch-state">{value === 1.0 ? "ON" : "OFF"}</span>
            </button>
          </div>
        );

      case "select":
        return (
          <div key={index} className="hw-select">
            <span className="hw-select-label">{displayLabel}</span>
            <select
              value={value}
              onChange={(e) => onParameterChange(index, parseFloat(e.target.value))}
              disabled={isLoading}
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
      <div className="rack-panel">
        {/* panel head */}
        <div className="panel-head metal">
          <span className="screw" />
          <div className="panel-id">
            <span className="led" />
            <span className="panel-slug">{plugin.name}</span>
          </div>
          <h2 className="panel-title">{plugin.label}</h2>
          <button className="panel-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
          <span className="screw" />
        </div>

        <div className="panel-body">
          <p className="panel-desc">{plugin.description}</p>

          {/* CRT scope when a file is loaded */}
          {file && (
            <WaveformSelector
              file={file}
              previewStartTime={previewStartTime}
              setPreviewStartTime={setPreviewStartTime}
            />
          )}

          {/* control surface */}
          <div className="control-surface">
            <div className="surface-head">
              <span>PARAMETERS</span>
              <span className="surface-count">{plugin.parameters.length}</span>
            </div>
            <div className="knob-bank">
              {plugin.parameters.map((param, i) => renderControl(param, i))}
            </div>
          </div>

          {/* file slot */}
          <label className="file-slot">
            <input type="file" onChange={handleFileUpload} accept="audio/*" />
            <span className="file-slot-icon">⊕</span>
            <span className="file-slot-text">
              {file ? file.name : "Insert audio file (wav · mp3 · ogg · flac · aiff)"}
            </span>
          </label>

          {/* result player */}
          {result && (
            <div className={`result-bay ${result.isPreview ? "is-preview" : ""}`}>
              <div className="result-head">
                <span className="led cyan" />
                <span>{result.isPreview ? "PREVIEW OUT" : "PROCESSED OUT"}</span>
                <a className="result-dl" href={result.url} download={result.name}>
                  ▽ download
                </a>
              </div>
              <audio className="result-audio" src={result.url} controls autoPlay />
            </div>
          )}
        </div>

        {/* transport footer */}
        <div className="panel-foot metal">
          <p className="foot-hint">
            <strong>Preview</strong> renders a short window from the marker ·{" "}
            <strong>Process</strong> applies to the full file.
          </p>
          <div className="transport">
            <button
              className="xport-btn xport-preview"
              onClick={() => handleSend(true)}
              disabled={isLoading}
            >
              {loadingKind === "preview" ? "···" : "▸ Preview"}
            </button>
            <button
              className="xport-btn xport-process"
              onClick={() => handleSend(false)}
              disabled={isLoading}
            >
              {loadingKind === "process" ? "···" : "● Process"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PluginModal;
