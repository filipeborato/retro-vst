// components/PluginModal.js
import React, { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import '../styles/PluginModal.css';

function PluginModal({ plugin, onClose }) {
  const knobCount = 4; // Quantidade de sliders por plugin
  const [knobValues, setKnobValues] = useState(Array(knobCount).fill(500));
  const [file, setFile] = useState(null);

  const handleKnobChange = (index, value) => {
    const updatedKnobs = [...knobValues];
    updatedKnobs[index] = value;
    setKnobValues(updatedKnobs);
  };

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    const allowedTypes = ['audio/wav', 'audio/mp3', 'audio/ogg', 'audio/flac', 'audio/aiff', 'audio/x-wav', 'audio/x-aiff', 'audio/mpeg'];

    if (!uploadedFile) {
      alert('Nenhum arquivo selecionado!');
      return;
    }

    if (!allowedTypes.includes(uploadedFile.type)) {
      alert('Formato de arquivo inválido. Por favor, envie um arquivo de áudio válido (wav, mp3, ogg, flac, aiff).');
      return;
    }

    if (uploadedFile.size > 10 * 1024 * 1024) { // Limite de 10MB
      alert('O arquivo é muito grande. O limite é de 10MB.');
      return;
    }

    setFile(uploadedFile);
    alert(`Arquivo '${uploadedFile.name}' carregado com sucesso!`);
  };

  const handleSend = async () => {
    if (!file) {
      alert('Por favor, faça o upload de um arquivo antes de enviar!');
      return;
    }

    const url = `https://silver-trout-69jqgjwwpwvcxvqr-18080.app.github.dev/process?plugin=${plugin.name}&p0=${knobValues[0]}&p1=${knobValues[1]}&p2=${knobValues[2]}&p3=${knobValues[3]}`;

    const formData = new FormData();
    formData.append('audio_file', file);
    const headers = {
      'Content-Type': 'application/json',
      'Cookie': '.Tunnels.Relay.WebForwarding.Cookies=CfDJ8E0FHi1JCVNKrny-ARCYWxNRW3_GgQyjpXDAkcVImKGv8bmsNdD56MG6B23uUejNMfgZt6ORTvobWg-5Wl_6ngJNsMv15I_5p4CGimXKgzQiFXgDmyEKKJmXlmbOVfW4tKErSd6MpskVyu6y6BBM7UKJPFqxZ5_Vm4vBHmI5W9pcgBy-jAfjoirUjaMgp38PnEa8hN48BqgfKIkYWtjVt_HiPo7DiennrW7ZLOeJWs_yX75pJS9qezeSeLffGBpkWZ3JQMxIuiCrHhPSTO5W4t3uhZVcUOBF8RrzPe4WpAa389YFkUCtGURKRhEOBsOIUqECTEBvMeDjriZ1L3yavMFQecdQTgv-SZX82MDTOKu2d_JIhYK9clhs1piw9dwTBz_CgEljSxyIVIDtQrb9N0ulf24hNrWbJJlr8UzCndalkr5Lls16q2LsliVMh0AatkPhuR1W7M2QXeaHcinXONcBcPX9Vg6j9Bd4PqzWfJtHyVg2FEZIhpqN3jD30F2utK4C4ocmRaILA3o772Uw2Z1FtZdLVIaJqG5JlBwd6WY33xRCUIcTEwozHHLhqi_r8him9r4PjmACCL1DBlJ83ZpJoGm419k_1E5iSGjCGkZLD8lrnGdDQSNLP4jY6_N9y7A9WUEAXJ5SpLcc67AuXlbXkoextK6TArfxH6caId3HwC6l4Ox8PwBY7gPT3Wcjx--vWJR4eF_6VtF5qtIKNUEFkjA_dcYJtk-nqUJUzTP0rCypx1I3Q5fAIuCUS27750iZDRv5MgjKYrhEj5eH2ZFv1bT8BEOoIKv1W6suMuKhdhfNFe6Ga4ocvIQfFQM9ddHdtMhBjZWSYCxP3-Di8YCwKOMPhm3MuzAtWEzR60FDLqsiBpa9MnSsl1cJpBCsblo_roEM1YYJy2gpP5gQha0xx9fCJY3BclNeDZSher0okLxcQDAgBkcWKND-Zx8BpN_0FF9chLyKacpvcmN2taj69jN76VQH-kfZLiUErIhZbU4HEmJkVrqzglvOonICT_xxODWdXk3W0Mg9aR9qjZUBF06SyEwBtVQ3AFc9AiPZmSmNePheGvevXNd95R25I9v2JcrJeaWNQF0yufvOJwjmEcYNk5pAqRnd3F5ugcDwOQCMuti06H9ytUJQsBmgPiXT2GhlLu1IEficrTI1Q3Ovs-_uQ80wBlI4hwfQiZ3UBPi-6KSDrVutih7w-0FLpvaXDhPyqSgo6ogAih2i-CVJNQ1jpT4c_DKj-Y7bPJAzCW7IluUFt3210gfDcDAs4jAiHJtrdcAHjzXEiSnodJuaI2ODKZcXvBgMlxLEDS3v0yF8gZaqUAcHA0Hu6EhHUIKxHra1z5LSmMWQbBETpxPShc1MGvm0fcW-e5LM3AmPfWIza0t-sppwCUcLPE8h2CZRSZge98Jq0NzfLXMdeTjWegsb6604LB1v1XPORfyXbvt31YP58GHTBN2b3v2si30aeKaWyaSBvQYNWNBki_irE_bxqhsh_MWxtdhTTOoFuCslN6Ei_n3yBG5q86axFOBVBIZTKh58yWcSNoJxypG_E-mMonVIyMVLBvaK2QGqTwVnT_VBJWbt08zcr8mFow' // Truncado por limite de espaço."
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: headers,
      });

      if (!response.ok) {
        throw new Error('Erro ao processar o arquivo.');
      }

      const processedFile = await response.blob();
      const downloadUrl = URL.createObjectURL(processedFile);

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'processed_audio.wav';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert('Arquivo processado e baixado com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar o arquivo:', error);
      alert('Erro ao processar o arquivo. Por favor, tente novamente.');
    }
  };

  const handleBackdropClick = (event) => {
    if (event.target.classList.contains('modal')) {
      onClose();
    }
  };

  return (
    <div className="modal" onClick={handleBackdropClick}>
      <div className="modal-content">
        <h2>{plugin.name}</h2>
        <p>{plugin.description}</p>
        <div className="plugin-controls">
          {knobValues.map((value, index) => (
            <div key={index} className="plugin-slider">
              <Slider
                min={0}
                max={1000}
                value={value}
                onChange={(val) => handleKnobChange(index, val)}
              />
              <p>Slider {index + 1}: {value}</p>
            </div>
          ))}
        </div>
        <div className="file-upload">
          <input type="file" onChange={handleFileUpload} />
        </div>
        <div className="action-buttons">
          <button className="send-button" onClick={handleSend}>Enviar</button>
          <button className="close-button" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
}
export default PluginModal;