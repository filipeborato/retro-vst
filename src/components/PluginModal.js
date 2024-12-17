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
      'Access-Control-Allow-Origin': '*',
      'Cookie': '.Tunnels.Relay.WebForwarding.Cookies=CfDJ8E0FHi1JCVNKrny-ARCYWxP70DX1XSjIEQF9vJRL7oT6HW-7kS9VWzxwOBMHu3EgtMGPItYPc2kgmI4j1cenP9rahOXgZCxHgk0OWcdqSqveJ9RQmJYsw2v7_AkDMzOhxrfSawvUOAoNKGearX9cZYSVC6836YBqY9AzjG8D_n9hE6_DiyTQFz-AON5UauBmlaD_iEeaLZAFxWIynJS8dRsQw-gGaisjccSzNjS2Nt7ejh4HOe2SpljM4SgMkrXSD9eYfwPrgJSEGWPRWkpOHkqetXw8TTWQBynI6eutfdprwfKx1L463pqOwyj19zron-R6L5WtF2xBsIGBFqLfwmeVtYuUXahP0N7nyHhuNeRyiZezFQ9QSFTFixQYmgkSvL7qfNYpf1QuVgv9Z3HIOcJ-U3qic1hvMeuOX1F6cAhZcPF00uvUSiqVBUh1FV5lrYDq29PS3iAmKXL6dn147_ksaAoUuDXjObphQmQqNP8x5e8fmdoKBN63o5yNdwdwyyu3Kx8B8dHFKkHX8RmGDzV3aTt_LtVk_kQdmwqQpbJOqta3zRYbUTV-ZbyL5SRAkMFi7lV2HfLBK_QympsEeVrZ1YcTbOPRNi8MRHvj_0JP3bKuVFiCCzzMHqWGYmbqHDX2vgDp7t5kc3Rv2w61a-tkDiClTlWFXQqFO-OF7QRMKj8c7r7Yc3v0b5UdpT-vNiTV0f42mA6HeBvxHjWYVMUl_jiFrFxjTwNB2p5BgKUeLl12hdtIAI6HA-9D-0GwDq6Zc1LlAweX1d8the4k2NXrX7SpmNDHZaOJvtzhXZZwh37kMoxSzY9gMS45N9bHin6xDQ4TVemCRw4hAVgk2NQXkuXFG0OF2cr9B_eP8XerOoyzw9DaXbOKhpl8YofAfK-t7o32UGn7z08sIJfQJpcFymcGV6JDzYBFavN3h-_u2gmdSAqIq_rDz328xXnUOazpDCT-Ia-hKu31Y1-Z50drFsYhI-yuMGRcw0vyL_b8oha9k8MZB0D5rumlWG1gd4UGO3bYnG_sgP_7Yyl7hEXTbDlZBEtNG_IiXV2BULejDbowN5aIX08jlVdqUYdozWY1d9j-Mq2vjH6X5i10lgItrCGzL8YEWeOVQtIC4N6mqLtsRxE4m2SumHE0rh8Sf_34U1J8R_FSFY3vcjGC_OkJCtFO--KaWI3wThbdggpqd-mlgM4WcZfUi2lGdmfeEBYmkathk6_5CsJT3pUZX95IKWEXkNu6XMdYelxb472KHN0XQdaQVrRTTeSqihZ-bkOKinlWfS0BuxAVB1ECjFEfYV0FqFV3J5cRkb8DJiq1QTr3YsOCvJn5A7qtuPtBsMsvBPE2rhyFgPjzZqGpQHYigQAUr7T15zbYD7l70qsB_FQz_t7HmAmFeqLp71eS4McK3t5vNGFuK37J6oxHYaF9-zr8cX5qv-kPfeGMpplxRk6ZcqNWTgPFh6jGLR9yLLJlP_EsTsZAPYrOlD3-wk2-JBLGV9UWBWLiwGLbRbqYS3QUdBzPmMP-SlfKrRHozcYET2QaPf8wm8kNOBldB8KSHg_ga_ObtbGXYIAmk4KTS2kaTeqVVQBeJcydJC9cJYX9vgRwGbj2QK9q-N24Uu8',      
    };
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: headers,
        credentials: 'include',        
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