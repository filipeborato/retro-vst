// components/PluginModal.js
import React, { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "../styles/PluginModal.css";

function PluginModal({ plugin, onClose }) {
  const [knobValues, setKnobValues] = useState(Array(plugin.sliders).fill(0.5)); // Inicializa dinamicamente os sliders
  const [file, setFile] = useState(null);

  const handleKnobChange = (index, value) => {
    const updatedKnobs = [...knobValues];
    updatedKnobs[index] = parseFloat(value.toFixed(2)); // Garante precisão de 2 casas decimais
    setKnobValues(updatedKnobs);
  };

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    // Lista de extensões permitidas
    const allowedExtensions = ["wav", "mp3", "ogg", "flac", "aiff"];

    if (!uploadedFile) {
      alert("Nenhum arquivo selecionado!");
      return;
    }

    // Verifica a extensão do arquivo
    const fileExtension = uploadedFile.name.split(".").pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      alert(
        "Formato de arquivo inválido. Por favor, envie um arquivo de áudio válido."
      );
      return;
    }
    if (uploadedFile.size > 10 * 1024 * 1024) {
      alert("O arquivo é muito grande. O limite é de 10MB.");
      return;
    }

    setFile(uploadedFile);
    alert(`Arquivo '${uploadedFile.name}' carregado com sucesso!`);
  };

  const handleSend = async () => {
    if (!file) {
      alert("Por favor, faça o upload de um arquivo antes de enviar!");
      return;
    }

    const params = knobValues
      .map((value, index) => `p${index}=${value}`)
      .join("&");
    const url = `https://ec2-15-228-250-220.sa-east-1.compute.amazonaws.com/process?plugin=${plugin.name}&${params}`;

    const formData = new FormData();
    formData.append("audio_file", file);
    // const headers = {
    //   'Access-Control-Allow-Origin': '*',
    //   //'Cookie': '.Tunnels.Relay.WebForwarding.Cookies=CfDJ8E0FHi1JCVNKrny-ARCYWxOxKsyV2cVVsZIl81HWHp7fDgH1sApBVVRa-NHr4_2LH5ldxvh_yGqIZUOYW_LtUwpp3NSVJO3nuCmvOTe8SDEVjsYlhrKa5gbxjH8zwJs4xRyFsvP4ehLaEv5_iCUbmAohSC1sLcAIatZwbGXAjLRfxLk6t5pKg-6zBMfYl-xGqswrMxIeJ0aaJ_JxMjt0LHTG8vao4X7yHIV5-bl9huVGPTiBiw5pmCwkYKnG1Ri1T4qWoxT4LGo0E0MKXzh2Ndhn5UNr5bR8QpoTfBw8GjWaYFL5vzH0jJ3UAnRA0KjTAoaubM1NhVeFpRjpdRp7ermDypBcB4L_CFKYkqpDp-MWZOvKjpVIiCHwAuQAquRNwgHWXUEZwndqoG1P5vFKDMFW1LihNkkTMRZyql1vg7vdVc1R_fUpbxB2QkTDtr0UML3WIvkIUDFwYOfAPnDEQkqErrSnS8dbiMpR450kwLNFtwqco3oCbzDufn5MUSi-IAblSRE9_IAo5h7j7k5YtImMbIeC8Ry42DYSFUJ6Pqnrka27_JmjaJ5TzbhDanpqThrjPm-mbuAnCQZaTBzyNqUUgEz5YP57A1I5b0U77oyeaBmC4QXx_KT7bFPU1Nd9bAjwFM2nvYP5wP3Gdia9mUmP_DZ9aU4p4iM3fZRAC9gzMGUqqeMXBRA4RjP4undrACAktMe5w-AM4GLxJOXDOla4SR3V_uyTevcScwV03N8Bd5R9x-lmfhsbnQtFEqnau92hv6QJpvWOeBgVqr7h18RkhdcOc3f2m1wntRfhipqwqYtqZKbdvpzI-emydh011OzUlb75rK7Jbb75Wh559VU-yY2SZ2l1CPX1yyysWeEWbuzXyUYCeTPxz2x0AHp5MfYaabK_YUaoadrs3ljzo4sDfQQMHB6pYPq2bJ9gVGZlOW4NCGVQYzJGnyufq_dB0x0u2AYZg48FLAdcGM03L_ImKJ6b3s2meb60ltg_mFvLkfnJDYZEPLARhxqIdfJIt8P7WKvt9YScl6LZa9HMsVweZdjF2IsusAdZ8r_-F4VaZHiHeTQRPAYjUh0orZJwEhgp2AyAbK0FMwYIr_LoP-39kWg5fc3r_-kr4zAW-ldrBPF6pgK8Y4SCd1pgu80aF37fnX7ItZVvIfJ3-M1wNkNHuchT_vPdtV0_zHM3_vUKZZ3AcmwGd93mI7BjU9xEnNZ23_zMtsF5aRMYoz7SwEHy_LCXiUSMZEE0qB1oXSSmqgtNcnyey0bRXgPwuQIEha7zKYeIU4RjGWpTvvbJERfO4bNY_6JnKCEQrgd3EMN2TK41krBrtPpwEx3746X4-t2YJo6NR_g8DugDS61UHpPA2P5oEA4uVIIcW8EseKBjQIds_188zFkf0dkpxLAlm907XSufk1XeGRSAEwj8SUlDVtNsusqm1xdye55zjrpkmBN8Ih4b38t-bBHLSLsYuPr1Fd5C4L3bm7m_db4N6fjM5toCDclHzO8owtPHIj_IWSvFCqyXzW0HIxONkOImxpoEsB15S5mlnYuMZsyfy_rQaglZb6H3fs38r4uctNtYIRS90hUl9CAKPUp2gQlU9kDR9B5xcUbuURuizZp8IENbczrEYJNGHynOaUboex8r',
    // };

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
        //headers: headers,
        //credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Erro do servidor: ${response.status} - ${errorText}`);
        alert(`Erro ao processar o arquivo: ${response.status}`);
        return;
      }

      // Recebe o arquivo como Blob
      const processedFile = await response.blob();

      if (processedFile.size === 0) {
        console.error("Arquivo recebido está vazio.");
        alert("Erro: O arquivo recebido está vazio.");
        return;
      }

      // Cria o link para download
      const downloadUrl = URL.createObjectURL(processedFile);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "processed_audio.wav";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert("Arquivo processado e baixado com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar o arquivo:", error);
      alert("Erro ao processar o arquivo. Por favor, tente novamente.");
    }
  };

  return (
    <div
      className="modal"
      onClick={(e) => e.target.classList.contains("modal") && onClose()}
    >
      <div className="modal-content">
        <h2>{plugin.name}</h2>
        <p>{plugin.description}</p>
        <div className="plugin-controls">
          {knobValues.map((value, index) => (
            <div key={index} className="plugin-slider">
              <Slider
                min={0.01}
                max={1}
                step={0.01}
                value={value}
                onChange={(val) => handleKnobChange(index, val)}
              />
              <p>{`p${index}: ${value.toFixed(2)}`}</p>
            </div>
          ))}
        </div>
        <div className="file-upload">
          <input type="file" onChange={handleFileUpload} />
        </div>
        <div className="action-buttons">
          <button className="send-button" onClick={handleSend}>
            Enviar
          </button>
          <button className="close-button" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

export default PluginModal;
