import React, { useState } from 'react';
import axios from 'axios';
export default function Format(props) {
  const [inputText, setInputText] = useState("");
  const [file, setFile] = useState(null);
  const [fileSubmitted, setFileSubmitted] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [processedData, setProcessedData] = useState('');
  const [translatedExtractedText, setTranslatedExtractedText] = useState('');
  const [translatedProcessedData, setTranslatedProcessedData] = useState('');
  const [showOriginalTextOptions, setShowOriginalTextOptions] = useState(false);
  const [showProcessedTextOptions, setShowProcessedTextOptions] = useState(false);
  const [showOriginalText, setShowOriginalText] = useState(false);
  const [showProcessedData, setShowProcessedData] = useState(false);
  const [error, setError] = useState('');

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
      formData.append('prompt', inputText);  // Send user prompt
      formData.append('fromLang', props.fromLang);
      formData.append('toLang', props.toLang);
  
      try {
        const response = await axios.post('http://127.0.0.1:5002/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
  
        console.log('Response data:', response.data);  // Log the response data
          
        setExtractedText(response.data.extracted_text);
        setProcessedData(response.data.processed_data);
        setTranslatedExtractedText(response.data.translated_extracted_text);
        
        setTranslatedProcessedData(response.data.translated_processed_data);
        setFileSubmitted(true);
        setShowOriginalTextOptions(false);
        setShowProcessedTextOptions(false);
        setShowOriginalText(false);
        setShowProcessedData(false);
        setError('');
      } catch (error) {
        console.error('Error uploading file:', error);
        setError('Error uploading file. Please try again.');
      }
    }
  };



  
  const handleDownload = (data, filename) => {
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className='convert'>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="col-md-12">
          <label htmlFor="prompt" className="form-label">{props.to}:</label>
          <textarea
            className="form-control"
            id="prompt"
            rows="10"
            cols="20"
            style={{ width: '95%', height: '80px' }}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          ></textarea>
        </div>
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
  
      {fileSubmitted && (
        <div className='result'>
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
                {showOriginalText ? 'Hide Original Text' : 'Show Original Text'}
              </button>
              <button
                type="button"
                className="btn-custom"
                onClick={() => setShowProcessedData(!showProcessedData)}
              >
                {showProcessedData ? 'Hide Processed Data' : 'Show Processed Data'}
              </button>
              {showOriginalText && (
                <div>
                  <pre>{extractedText}</pre>
                  <button
                    type="button"
                    className="btn-custom"
                    onClick={() => handleDownload(extractedText, 'original_text.txt')}
                  >
                    Download Original Text
                  </button>
                  
                </div>
              )}
              {showProcessedData && (
                <div>
                  <pre>{processedData}</pre>
                  <button
                    type="button"
                    className="btn-custom"
                    onClick={() => handleDownload(processedData, 'processed_data.txt')}
                  >
                    Download Processed Data
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
                onClick={() => setShowOriginalText(!showOriginalText)}
              >
                {showOriginalText ? 'Hide Translated Text' : 'Show Translated Text'}
              </button>
              <button
                type="button"
                className="btn-custom"
                onClick={() => setShowProcessedData(!showProcessedData)}
              >
                {showProcessedData ? 'Hide Processed Data' : 'Show Processed Data'}
              </button>
              {showOriginalText && (
                <div>
                  <pre>{translatedExtractedText}</pre>
                  <button
                    type="button"
                    className="btn-custom"
                    onClick={() => handleDownload(translatedExtractedText, 'translated_extracted_text.txt')}
                  >
                    Download Translated Extracted Text
                  </button>
                </div>
              )}
              {showProcessedData && (
                <div>
                  <pre>{translatedProcessedData}</pre>
                  <button
                    type="button"
                    className="btn-custom"
                    onClick={() => handleDownload(translatedProcessedData, 'translated_processed_data.txt')}
                  >
                    Download Translated Processed Data
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
  
      {error && <p className="error">{error}</p>}
    </div>
  );
}
