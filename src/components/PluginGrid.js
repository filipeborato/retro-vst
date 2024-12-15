// components/PluginGrid.js
import React from 'react';
import '../styles/PluginGrid.css';

function PluginGrid({ plugins, onPluginClick }) {
  return (
    <div className="plugin-grid">
      {plugins.map((plugin) => (
        <div key={plugin.id} className="plugin-card" onClick={() => onPluginClick(plugin)}>
          <h2>{plugin.name}</h2>
          <p>{plugin.description}</p>
        </div>
      ))}
    </div>
  );
}

export default PluginGrid;