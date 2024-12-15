import React, { useState } from 'react';
import '../styles/PluginControls.css';

function PluginControls({ plugin }) {
  const buttonCount = plugin.id === 1 ? 3 : 4;
  const [knobValues, setKnobValues] = useState(Array(buttonCount).fill(0));

  const handleKnobChange = (index, value) => {
    const updatedValues = [...knobValues];
    updatedValues[index] = value;
    setKnobValues(updatedValues);
  };

  const knobs = Array.from({ length: buttonCount }, (_, i) => (
    <div key={i} className="knob">
      <input
        type="range"
        min="0"
        max="1000"
        value={knobValues[i]}
        onChange={(e) => handleKnobChange(i, parseInt(e.target.value, 10))}
        className="slider"
      />
      <div>Knob {i + 1}: {knobValues[i]}</div>
    </div>
  ));

  return (
    <div className="plugin-controls">
      <h3>Controles do {plugin.name}</h3>
      <div className="knobs-container">{knobs}</div>
    </div>
  );
}

export default PluginControls;