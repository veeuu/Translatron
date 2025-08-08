import React, { useState, useEffect } from 'react';
import Inputform from './Inputform';
import '../App.css';
import Select from 'react-select';
import axios from 'axios';

const modeOptions = [
  { value: 'formfilling', label: 'Form Filling' },
  { value: 'pdffilling', label: 'Fill From PDF' },
];

const languageOptions = [
    { value: 'af', label: 'Afrikaans' },
    { value: 'sq', label: 'Albanian' },
    { value: 'am', label: 'Amharic' },
    { value: 'ar', label: 'Arabic' },
    { value: 'hy', label: 'Armenian' },
    { value: 'as', label: 'Assamese' },
    { value: 'ay', label: 'Aymara' },
    { value: 'az', label: 'Azerbaijani' },
    { value: 'bm', label: 'Bambara' },
    { value: 'eu', label: 'Basque' },
    { value: 'be', label: 'Belarusian' },
    { value: 'bn', label: 'Bengali' },
    { value: 'bho', label: 'Bhojpuri' },
    { value: 'bs', label: 'Bosnian' },
    { value: 'bg', label: 'Bulgarian' },
    { value: 'ca', label: 'Catalan' },
    { value: 'ceb', label: 'Cebuano' },
    { value: 'zh-CN', label: 'Chinese (Simplified)' },
    { value: 'zh-TW', label: 'Chinese (Traditional)' },
    { value: 'co', label: 'Corsican' },
    { value: 'hr', label: 'Croatian' },
    { value: 'cs', label: 'Czech' },
    { value: 'da', label: 'Danish' },
    { value: 'dv', label: 'Dhivehi' },
    { value: 'doi', label: 'Dogri' },
    { value: 'nl', label: 'Dutch' },
    { value: 'en', label: 'English' },
    { value: 'eo', label: 'Esperanto' },
    { value: 'et', label: 'Estonian' },
    { value: 'ee', label: 'Ewe' },
    { value: 'fil', label: 'Filipino (Tagalog)' },
    { value: 'fi', label: 'Finnish' },
    { value: 'fr', label: 'French' },
    { value: 'fy', label: 'Frisian' },
    { value: 'gl', label: 'Galician' },
    { value: 'ka', label: 'Georgian' },
    { value: 'de', label: 'German' },
    { value: 'el', label: 'Greek' },
    { value: 'gn', label: 'Guarani' },
    { value: 'gu', label: 'Gujarati' },
    { value: 'ht', label: 'Haitian Creole' },
    { value: 'ha', label: 'Hausa' },
    { value: 'haw', label: 'Hawaiian' },
    { value: 'he', label: 'Hebrew' },
    { value: 'hi', label: 'Hindi' },
    { value: 'hmn', label: 'Hmong' },
    { value: 'hu', label: 'Hungarian' },
    { value: 'is', label: 'Icelandic' },
    { value: 'ig', label: 'Igbo' },
    { value: 'ilo', label: 'Ilocano' },
    { value: 'id', label: 'Indonesian' },
    { value: 'ga', label: 'Irish' },
    { value: 'it', label: 'Italian' },
    { value: 'ja', label: 'Japanese' },
    { value: 'jv', label: 'Javanese' },
    { value: 'kn', label: 'Kannada' },
    { value: 'kk', label: 'Kazakh' },
    { value: 'km', label: 'Khmer' },
    { value: 'rw', label: 'Kinyarwanda' },
    { value: 'gom', label: 'Konkani' },
    { value: 'ko', label: 'Korean' },
    { value: 'kri', label: 'Krio' },
    { value: 'ku', label: 'Kurdish' },
    { value: 'ckb', label: 'Kurdish (Sorani)' },
    { value: 'ky', label: 'Kyrgyz' },
    { value: 'lo', label: 'Lao' },
    { value: 'la', label: 'Latin' },
    { value: 'lv', label: 'Latvian' },
    { value: 'ln', label: 'Lingala' },
    { value: 'lt', label: 'Lithuanian' },
    { value: 'lg', label: 'Luganda' },
    { value: 'lb', label: 'Luxembourgish' },
    { value: 'mk', label: 'Macedonian' },
    { value: 'mai', label: 'Maithili' },
    { value: 'mg', label: 'Malagasy' },
    { value: 'ms', label: 'Malay' },
    { value: 'ml', label: 'Malayalam' },
    { value: 'mt', label: 'Maltese' },
    { value: 'mi', label: 'Maori' },
    { value: 'mr', label: 'Marathi' },
    { value: 'mni-Mtei', label: 'Meiteilon (Manipuri)' },
    { value: 'lus', label: 'Mizo' },
    { value: 'mn', label: 'Mongolian' },
    { value: 'my', label: 'Myanmar (Burmese)' },
    { value: 'ne', label: 'Nepali' },
    { value: 'no', label: 'Norwegian' },
    { value: 'ny', label: 'Nyanja (Chichewa)' },
    { value: 'or', label: 'Odia (Oriya)' },
    { value: 'om', label: 'Oromo' },
    { value: 'ps', label: 'Pashto' },
    { value: 'fa', label: 'Persian' },
    { value: 'pl', label: 'Polish' },
    { value: 'pt', label: 'Portuguese (Portugal, Brazil)' },
    { value: 'pa', label: 'Punjabi' },
    { value: 'qu', label: 'Quechua' },
    { value: 'ro', label: 'Romanian' },
    { value: 'ru', label: 'Russian' },
    { value: 'sm', label: 'Samoan' },
    { value: 'sa', label: 'Sanskrit' },
    { value: 'gd', label: 'Scots Gaelic' },
    { value: 'nso', label: 'Sepedi' },
    { value: 'sr', label: 'Serbian' },
    { value: 'st', label: 'Sesotho' },
    { value: 'sn', label: 'Shona' },
    { value: 'sd', label: 'Sindhi' },
    { value: 'si', label: 'Sinhala (Sinhalese)' },
    { value: 'sk', label: 'Slovak' },
    { value: 'sl', label: 'Slovenian' },
    { value: 'so', label: 'Somali' },
    { value: 'es', label: 'Spanish' },
    { value: 'su', label: 'Sundanese' },
    { value: 'sw', label: 'Swahili' },
    { value: 'sv', label: 'Swedish' },
    { value: 'tl', label: 'Tagalog (Filipino)' },
    { value: 'tg', label: 'Tajik' },
    { value: 'ta', label: 'Tamil' },
    { value: 'tt', label: 'Tatar' },
    { value: 'te', label: 'Telugu' },
    { value: 'th', label: 'Thai' },
    { value: 'ti', label: 'Tigrinya' },
    { value: 'ts', label: 'Tsonga' },
    { value: 'tr', label: 'Turkish' },
    { value: 'tk', label: 'Turkmen' },
    { value: 'ak', label: 'Twi (Akan)' },
    { value: 'uk', label: 'Ukrainian' },
    { value: 'ur', label: 'Urdu' },
    { value: 'ug', label: 'Uyghur' },
    { value: 'uz', label: 'Uzbek' },
    { value: 'vi', label: 'Vietnamese' },
    { value: 'cy', label: 'Welsh' },
    { value: 'xh', label: 'Xhosa' },
    { value: 'yi', label: 'Yiddish' },
    { value: 'yo', label: 'Yoruba' },
    { 'value': 'zu', "label": 'Zulu' },
  ];

  export default function Form() {
    const [mode, setMode] = useState('');
    const [sourceLang, setSourceLang] = useState('');
    const [targetLang, setTargetLang] = useState('');
    const [translatedLabels, setTranslatedLabels] = useState({});
    const [formVisible, setFormVisible] = useState(false);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleModeChange = (selectedOption) => {
        const selectedMode = selectedOption.value;
        setMode(selectedMode);
        setSourceLang('');
        setTargetLang('');
        setFile(null);
        setFormVisible(false); // Hide the form initially
    };

    const handleSourceLangChange = async (selectedOption) => {
        const lang = selectedOption.value;
        setSourceLang(lang);
        if (targetLang) {
            try {
                const response = await axios.get(`http://127.0.0.1:5001/translateLabels?lang=${lang}`);
                setTranslatedLabels(response.data);
                if (mode === 'formfilling') {
                    setFormVisible(true); // Show the form after both languages are selected
                }
            } catch (error) {
                console.error('Error fetching translated labels:', error);
            }
        }
    };

    const handleTargetLangChange = (selectedOption) => {
        setTargetLang(selectedOption.value);
        if (sourceLang) {
            if (mode === 'formfilling') {
                setFormVisible(true); // Show the form after both languages are selected
            }
        }
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmitFile = async (event) => {
        event.preventDefault();
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('sourceLang', sourceLang);
        formData.append('targetLang', targetLang);

        try {
            await axios.post('http://127.0.0.1:5001/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setFormVisible(true); // Show the form after the file is successfully processed
            setFile(null);
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <div className="form1">
                <form className="row g-3">
                    <div className="col-md-12">
                        <label htmlFor="mode" className="form-label">Mode:</label>
                        <Select
                            id="mode"
                            className="form-select"
                            options={modeOptions}
                            onChange={handleModeChange}
                            placeholder="Select Mode"
                        />
                    </div>
                    {mode && (
                        <>
                            <div className="col-md-6">
                                <label htmlFor="Slang" className="form-label">Source Language:</label>
                                <Select
                                    id="Slang"
                                    className="form-select"
                                    options={languageOptions}
                                    onChange={handleSourceLangChange}
                                    isDisabled={!mode}
                                    placeholder="Select Source Language"
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="tlang" className="form-label">Target Language:</label>
                                <Select
                                    id="tlang"
                                    className="form-select"
                                    options={languageOptions}
                                    onChange={handleTargetLangChange}
                                    isDisabled={!mode}
                                    placeholder="Select Target Language"
                                />
                            </div>
                            {mode === 'pdffilling' && (
                                <div className="col-md-12">
                                    <label htmlFor="fileUpload" className="form-label">Upload File:</label>
                                    <input
                                        id="fileUpload"
                                        type="file"
                                        className="form-control"
                                        onChange={handleFileChange}
                                        disabled={uploading}
                                    />
                                    {file && !uploading && (
                                        <button
                                            type="submit"
                                            className="btn-custom"
                                            onClick={handleSubmitFile}
                                        >
                                            Submit
                                        </button>
                                    )}
                                    {uploading && <p>Uploading...</p>}
                                </div>
                            )}
                        </>
                    )}
                </form>
            </div>
            {formVisible && (mode === 'formfilling' || mode === 'pdffilling') && (
                <Inputform labels={translatedLabels} sourceLang={sourceLang} targetLang={targetLang}/>
            )}
        </>
    );
}
