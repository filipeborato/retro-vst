// components/WaveformSelector.js
import React, { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.js";
import "../styles/WaveformSelector.css";

function WaveformSelector({ file, previewStartTime, setPreviewStartTime }) {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);

  const PREVIEW_WINDOW = 10; // Janela fixa de 10 segundos

  useEffect(() => {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      // Destrói a instância anterior, se houver
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }

      // Cria a instância do WaveSurfer com o plugin de regiões
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "rgba(57, 255, 158, 0.45)",   // dim phosphor
        progressColor: "#39ff9e",                  // bright phosphor
        cursorColor: "#ff7a18",                    // sodium marker
        cursorWidth: 1,
        barWidth: 2,
        barGap: 1,
        responsive: true,
        height: 96,
        backend: "WebAudio",
        plugins: [
          RegionsPlugin.create({
            dragSelection: false, // Desativa o arraste livre para criação de novas regiões
          }),
        ],
      });

      // Converte o ArrayBuffer em Blob e carrega o áudio
      const blob = new Blob([event.target.result], { type: file.type });
      wavesurfer.current.loadBlob(blob);

      wavesurfer.current.on("ready", () => {
        const totalDuration = wavesurfer.current.getDuration();
        const effectiveWindow = Math.min(PREVIEW_WINDOW, totalDuration);
        setPreviewStartTime(0);

        // Cria a região inicial com largura fixa de 10s e sem redimensionamento
        const region = wavesurfer.current.addRegion({
          start: 0,
          end: effectiveWindow,
          color: "rgba(255, 122, 24, 0.18)",
          drag: true,
          resize: false, // Desabilita o redimensionamento para manter a janela fixa
        });

        // Atualiza a posição da região enquanto ela é arrastada
        region.on("update", () => {
          // Usa a própria região para obter a posição atual
          let newStart = region.start;

          // Aplica restrições para não ultrapassar os limites do áudio
          if (newStart < 0) newStart = 0;
          if (newStart + PREVIEW_WINDOW > totalDuration) {
            newStart = totalDuration - PREVIEW_WINDOW;
          }

          // Se os limites atuais estiverem fora do esperado, atualiza a região
          if (
            Math.abs(region.start - newStart) > 0.001 ||
            Math.abs(region.end - (newStart + PREVIEW_WINDOW)) > 0.001
          ) {
            region.update({
              start: newStart,
              end: newStart + PREVIEW_WINDOW,
            });
          }

          // Atualiza o estado para refletir o novo tempo de início
          setPreviewStartTime(newStart);
        });
      });
    };

    // Lê o arquivo como ArrayBuffer
    reader.readAsArrayBuffer(file);

    // Cleanup: destrói a instância do WaveSurfer ao desmontar ou quando o arquivo mudar
    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }
    };
  }, [file, setPreviewStartTime]);

  return (
    <div className="scope">
      <div className="scope-screen">
        <div className="waveform" ref={waveformRef}></div>
        <div className="scope-glass" aria-hidden="true" />
      </div>
      <div className="scope-readout">
        <span className="led" />
        <span>MARKER&nbsp;{Number(previewStartTime || 0).toFixed(2)}s</span>
        <span className="scope-sep">·</span>
        <span>WINDOW&nbsp;{PREVIEW_WINDOW}s</span>
      </div>
    </div>
  );
}

export default WaveformSelector;
