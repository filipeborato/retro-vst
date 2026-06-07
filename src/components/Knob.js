import React, { useCallback, useEffect, useRef, useState } from "react";
import "../styles/Knob.css";

/*
 * Skeuomorphic analog knob — metal/bakelite body with an amber LED arc.
 * Drag vertically (up = increase) or use the mouse wheel. Double-click resets
 * to defaultValue. Replaces the flat rc-slider for that hardware feel.
 */

const SWEEP = 270;          // total rotation arc in degrees
const START = -135;         // pointer angle at min value
const DRAG_RANGE = 180;     // px of vertical drag for full min→max travel

// SVG arc geometry
const R = 42;
const C = 50;
const CIRC = 2 * Math.PI * R;

function describeArc(ratio) {
  // length of the lit portion of the ring (sweep is 270° of the full circle)
  const lit = (SWEEP / 360) * CIRC * ratio;
  const gap = CIRC - lit;
  return { dash: `${lit} ${gap}` };
}

function Knob({
  value,
  min = 0,
  max = 1,
  step = 0.01,
  defaultValue,
  onChange,
  label,
  unit = "",
  disabled = false,
  format,
  color = "sodium", // sodium | cyan | blood
}) {
  const ratio = Math.min(1, Math.max(0, (value - min) / (max - min || 1)));
  const angle = START + ratio * SWEEP;
  const { dash } = describeArc(ratio);

  const [dragging, setDragging] = useState(false);
  const drag = useRef({ startY: 0, startVal: 0 });

  const clampStep = useCallback(
    (raw) => {
      const clamped = Math.min(max, Math.max(min, raw));
      const snapped = Math.round((clamped - min) / step) * step + min;
      return parseFloat(snapped.toFixed(6));
    },
    [min, max, step]
  );

  const onPointerDown = (e) => {
    if (disabled) return;
    e.preventDefault();
    drag.current = { startY: e.clientY, startVal: value };
    setDragging(true);
  };

  useEffect(() => {
    if (!dragging) return;
    const move = (e) => {
      const dy = drag.current.startY - e.clientY; // up is positive
      const deltaRatio = dy / DRAG_RANGE;
      const raw = drag.current.startVal + deltaRatio * (max - min);
      onChange(clampStep(raw));
    };
    const up = () => setDragging(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [dragging, max, min, onChange, clampStep]);

  const onWheel = (e) => {
    if (disabled) return;
    e.preventDefault();
    const dir = e.deltaY < 0 ? 1 : -1;
    onChange(clampStep(value + dir * step));
  };

  const onDoubleClick = () => {
    if (disabled || defaultValue === undefined) return;
    onChange(clampStep(defaultValue));
  };

  const display = format ? format(value) : Number(value).toFixed(2);

  return (
    <div
      className={`knob knob-${color} ${disabled ? "is-disabled" : ""} ${
        dragging ? "is-dragging" : ""
      }`}
    >
      {label && <div className="knob-label">{label}</div>}

      <div
        className="knob-dial"
        onPointerDown={onPointerDown}
        onWheel={onWheel}
        onDoubleClick={onDoubleClick}
        role="slider"
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "ArrowUp" || e.key === "ArrowRight")
            onChange(clampStep(value + step));
          if (e.key === "ArrowDown" || e.key === "ArrowLeft")
            onChange(clampStep(value - step));
        }}
      >
        {/* LED arc ring */}
        <svg className="knob-ring" viewBox="0 0 100 100">
          <circle
            className="knob-ring-track"
            cx={C}
            cy={C}
            r={R}
            transform={`rotate(${START - 90} ${C} ${C})`}
            strokeDasharray={`${(SWEEP / 360) * CIRC} ${CIRC}`}
          />
          <circle
            className="knob-ring-lit"
            cx={C}
            cy={C}
            r={R}
            transform={`rotate(${START - 90} ${C} ${C})`}
            strokeDasharray={dash}
          />
        </svg>

        {/* metal cap with pointer */}
        <div className="knob-cap" style={{ transform: `rotate(${angle}deg)` }}>
          <span className="knob-pointer" />
        </div>
      </div>

      <div className="knob-readout">
        {display}
        {unit && <span className="knob-unit">{unit}</span>}
      </div>
    </div>
  );
}

export default Knob;
