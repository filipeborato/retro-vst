// components/PluginGrid.js
import React from "react";
import "../styles/PluginGrid.css";

function PluginGrid({ plugins, onPluginClick }) {
  return (
    <div className="plugin-grid">
      {plugins.map((plugin) => {
        const paramCount = plugin.parameters ? plugin.parameters.length : 0;
        return (
          <button
            key={plugin.id}
            className="rack-unit"
            onClick={() => onPluginClick(plugin)}
            type="button"
          >
            {/* corner screws */}
            <span className="screw screw-tl" />
            <span className="screw screw-tr" />
            <span className="screw screw-bl" />
            <span className="screw screw-br" />

            <div className="rack-head">
              <span className="led" />
              <span className="rack-id">
                UNIT&nbsp;{String(plugin.id).padStart(2, "0")}
              </span>
              <span className="rack-slug">{plugin.name}</span>
            </div>

            <h2 className="rack-title">{plugin.label}</h2>
            <p className="rack-desc">{plugin.description}</p>

            <div className="rack-foot">
              <span className="rack-params">
                {paramCount} {paramCount === 1 ? "param" : "params"}
              </span>
              <span className="rack-engage">ENGAGE ▸</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default PluginGrid;
