import React, { useState } from 'react';
import axios from 'axios';

export default function Toconvert(props) {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [file, setFile] = useState(null);
  const [fileSubmitted, setFileSubmitted] = useState(false);
  const [pdfURL, setPdfURL] = useState('');
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const [originalSummary, setOriginalSummary] = useState('');
  const [translatedSummary, setTranslatedSummary] = useState('');
  const [showOriginalText, setShowOriginalText] = useState(false);
  const [showProcessedData, setShowProcessedData] = useState(false);
  const [showOriginalTextOptions, setShowOriginalTextOptions] = useState(false);
  const [showProcessedTextOptions, setShowProcessedTextOptions] = useState(false);


  const handleInputChange = async (event) => {
    setInputText(event.target.value);
    if (event.target.value) {
      try {
        const response = await axios.post('http://127.0.0.1:5000/translate', {
          text: event.target.value,
          src_lang: props.fromLang,
          dest_lang: props.toLang,
        });
        setOutputText(response.data.translated_text);
      } catch (error) {
        console.error('Error translating text:', error);
        setError('Error translating text. Please try again.');
      }
    } else {
      setOutputText("");
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setFileSubmitted(false);
    setError('');
  };

  const handleSubmitFile = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('src_lang', 'en');  // Adjust source language as needed
      formData.append('dest_lang', props.toLang);
  
      try {
        const response = await axios.post('http://127.0.0.1:5000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setPdfURL(response.data.pdf_url);
        setOriginalSummary(response.data.original_summary);
        setTranslatedSummary(response.data.translated_summary);
        setFileSubmitted(true);
        setError('');
      } catch (error) {
        console.error('Error uploading file:', error);
        setError('Error uploading file. Please try again.');
      }
    }
  };
  const downloadOriginalSummary = () => {
    if (originalSummary) {
      const blob = new Blob([originalSummary], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'original-summary.txt';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const downloadTranslatedSummary = () => {
    if (translatedSummary) {
      const blob = new Blob([translatedSummary], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'translated-summary.txt';
      a.click();
      URL.revokeObjectURL(url);
    }
  };
  

  const downloadPDF = () => {
    if (pdfURL) {
      const link = document.createElement('a');
      link.href = pdfURL;
      link.download = 'translated-file.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error('PDF URL not set.');
    }
  };

  

  const showSummary = () => {
    if (originalSummary) {
      alert(originalSummary);
    }
  };

  const downloadSummary = () => {
    if (summary) {
      const blob = new Blob([summary], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'summary.txt';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="convert">
      {props.to && props.from && (
        <form className="row g-3">
          <div className="col-md-12">
            <label htmlFor="tolang" className="form-label">{props.from}:</label>
            <textarea
              className="form-control"
              id="tolang"
              rows="10"
              cols="20"
              style={{ width: '95%', height: '140px' }}
              value={inputText}
              onChange={handleInputChange}
            ></textarea>
          </div>
          <div className="col-md-12">
            <label htmlFor="fromlang" className="form-label">{props.to} {props.toLang ? `(${props.toLang})` : ''}:</label>
            <textarea
              className="form-control"
              id="fromlang"
              rows="10"
              cols="20"
              style={{ width: '95%', height: '140px' }}
              value={outputText}
              readOnly
            ></textarea>
          </div>
        </form>
      )}
  
      {props.file && (
        <form className="row g-3">
          <div className="col-md-6">
            <label htmlFor="upload" className="form-label">{props.file}</label>
            <input
              type="file"
              className="form-control"
              id="upload"
              accept='.pdf'
              onChange={handleFileChange}
            />
            <button
              type="button"
              className="btn-custom"
              onClick={handleSubmitFile}
            >
              Submit
            </button>
          </div>
        </form>
      )}
  
  {fileSubmitted && (
  <div className="button">
   <button
            type="button"
            className="btn-custom"
            onClick={() => setShowOriginalTextOptions(!showOriginalTextOptions)}
          >
            {showOriginalTextOptions ? 'Hide Original Language Options' : 'Show Original Language Options'}
          </button>
          <button
            type="button"
            className="btn-custom"
            onClick={() => setShowProcessedTextOptions(!showProcessedTextOptions)}
          >
            {showProcessedTextOptions ? 'Hide Translated Language Options' : 'Show Translated Language Options'}
          </button>
          {showOriginalTextOptions && (
            <div>
              <button
                type="button"
                className="btn-custom"
                onClick={() => setShowOriginalText(!showOriginalText)}
              >
                {showOriginalText ? 'Hide Original Summary' : 'Show Original Summary'}
              </button>
              
              {showOriginalText && (
                <div>
                  <pre style={{ whiteSpace: 'pre-wrap' }}>{originalSummary}</pre>
                  <button
                    type="button"
                    className="btn-custom"
                    onClick={downloadOriginalSummary}
                  >
                    Download Original Summary
                  </button>
                  </div>
              )}
              
            </div>
          )}









{showProcessedTextOptions && (
            <div>
              <button
              type="button"
              className="btn-custom"
              onClick= {downloadPDF}
              >
                Download Translated PDF
              </button>
               <button
                type="button"
                className="btn-custom"
                onClick={() => setShowOriginalText(!showOriginalText)}
              >
                {showOriginalText ? 'Hide Translated Summary' : 'Show Translated Summary'}
              </button>
             
              {showOriginalText && (
                <div>
                  <pre style={{ whiteSpace: 'pre-wrap' }}>{translatedSummary}</pre>
                  <button
                    type="button"
                    className="btn-custom"
                    onClick={downloadTranslatedSummary}
                  >
                    Download Translated Summary
                  </button>
                  </div>
              )}
              
            </div>
          )}







  </div>
)}
  
      {error && <div className="error">{error}</div>}
    </div>
  );
}

