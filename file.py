from flask import Flask, request, jsonify
from flask_cors import CORS
import fitz  # PyMuPDF for PDF text extraction
import os
from hugchat import hugchat
from hugchat.login import Login
from googletrans import Translator
# Initialize the Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Hugging Face account credentials
EMAIL = ""
PASSWD = ""
cookie_path_dir = "./cookies/"

def translate_text(text, from_lang, to_lang):
    try:
        translator = Translator()
        translated = translator.translate(text, src=from_lang, dest=to_lang)
        return translated.text
    except Exception as e:
        print(f"Error during translation: {e}")
        return text
# Function to extract text from a PDF file
def extract_text_from_pdf(filepath):
    try:
        doc = fitz.open(filepath)
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()
        return text
    except Exception as e:
        print(f"Error extracting text: {e}")
        return ""

# Function to interact with Hugging Face chatbot
def get_data(data, user_prompt):
    try:
        sign = Login(EMAIL, PASSWD)
        cookies = sign.login(cookie_dir_path=cookie_path_dir, save_cookies=True)
        chatbot = hugchat.ChatBot(cookies=cookies.get_dict())
    except Exception as e:
        raise Exception(f"Failed to initialize chatbot: {e}")

    prompt = f"{user_prompt} from {data}"
    query_result = str(chatbot.query(prompt, web_search=True))
    
    return query_result

# Route to handle file upload and processing
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file and file.filename.endswith('.pdf'):
        filepath = f"./uploads/{file.filename}"
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        file.save(filepath)

        # Extract text from the PDF
        extracted_text = extract_text_from_pdf(filepath)
        if not extracted_text:
            return jsonify({"error": "Failed to extract text from PDF"}), 500

        # Get the user prompt and language settings
        user_prompt = request.form.get('prompt', '')
        from_lang = request.form.get('fromLang', 'en')  # Default to English
        to_lang = request.form.get('toLang', 'hi')  # Default to Spanish

        # Process the extracted text with the chatbot
        if user_prompt:
            processed_data = get_data(extracted_text, user_prompt)
        else:
            processed_data = "No prompt provided."

        # Translate texts
        translated_extracted_text = translate_text(extracted_text, from_lang, to_lang)
        translated_processed_data = translate_text(processed_data, from_lang, to_lang)

        return jsonify({
            "extracted_text": extracted_text,
            "processed_data": processed_data,
            "translated_extracted_text": translated_extracted_text,
            "translated_processed_data": translated_processed_data,
            "pdf_url": None  # PDF URL not handled
        })
    else:
        return jsonify({"error": "Invalid file type"}), 400


@app.route('/')
def home():
    return "Hello, World!"

if __name__ == '__main__':
    app.run(port=5002,debug=True)
