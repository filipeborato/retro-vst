// components/PluginGrid.js
import React from 'react';
import '../styles/PluginGrid.css';

function PluginGrid({ plugins, onPluginClick }) {
  return (
    <div className="plugin-grid">
      {plugins.map((plugin) => (
        <div
          key={plugin.id}
          className="plugin-card"
          onClick={() => onPluginClick(plugin)}
        >
          <div className="plugin-card-header">
            <h2>{plugin.name}</h2>
          </div>
          <div className="plugin-card-body">
            <div className="plugin-knob"></div>
            <div className="plugin-knob"></div>
            <div className="plugin-knob"></div>
          </div>
          <div className="plugin-card-footer">
            <p>{plugin.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PluginGrid;