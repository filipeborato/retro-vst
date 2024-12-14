// components/PluginModal.js
import React from 'react';
import PluginControls from './PluginControls.js';
import '../styles/PluginModal.css';

function PluginModal({ plugin, onClose }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{plugin.name}</h2>
        <p>{plugin.description}</p>
        <PluginControls plugin={plugin} />
        <button onClick={onClose} className="close-button">Fechar</button>
      </div>
    </div>
  );
}

export default PluginModal;