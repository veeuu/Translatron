from flask import Flask, request, jsonify, send_file, url_for
from flask_cors import CORS
from googletrans import Translator
import os
import fitz 
import PyPDF2
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from hugchat import hugchat
from hugchat.login import Login
import re

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend-backend communication

# HugChat credentials
EMAIL = ""  # Replace with your email
PASSWD = ""  # Replace with your password
cookie_path_dir = "./cookies/"

# Initialize HugChat client
sign = Login(EMAIL, PASSWD)
cookies = sign.login(cookie_dir_path=cookie_path_dir, save_cookies=True)
hugchat_client = hugchat.ChatBot(cookies=cookies.get_dict())

# Ensure the upload and output directories exist
UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = 'outputs'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

translator = Translator()
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


@app.route('/translate', methods=['POST'])
def translate_text():
    data = request.json
    text = data.get('text')
    src_lang = data.get('src_lang')
    dest_lang = data.get('dest_lang')
    
    if not text or not src_lang or not dest_lang:
        return jsonify({'error': 'Invalid input'}), 400
    
    try:
        translated = translator.translate(text, src=src_lang, dest=dest_lang)
        return jsonify({'translated_text': translated.text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file:
        src_lang = request.form.get('src_lang')
        dest_lang = request.form.get('dest_lang')
        
        if not src_lang or not dest_lang:
            return jsonify({'error': 'Missing language parameters'}), 400
        
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)
        
        translated_file_path, original_summary, translated_summary_text = process_and_translate_pdf(file_path, src_lang, dest_lang)
        
        # Create a URL for the translated PDF
        translated_file_url = url_for('download_file', filename=os.path.basename(translated_file_path), _external=True)
        
        return jsonify({
            'pdf_url': translated_file_url,
            'original_summary': original_summary,
            'translated_summary': translated_summary_text
        })
    
def process_and_translate_pdf(file_path, src_lang, dest_lang):
    # Extract text from the PDF
    text = extract_text_from_pdf(file_path)

    if not text.strip():
        return jsonify({'error': 'Failed to extract text from PDF'}), 500

    # Translate the extracted text
    try:
        translated_text = translator.translate(text, src=src_lang, dest=dest_lang)
        translated_text_content = translated_text.text
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    # Generate a PDF for the translated text
    translated_file_path = os.path.join(OUTPUT_FOLDER, 'translated_' + os.path.basename(file_path))
    c = canvas.Canvas(translated_file_path, pagesize=letter)
    
    # Register a standard font that supports Unicode characters
    pdfmetrics.registerFont(TTFont('Arial', 'Arial.ttf'))
    c.setFont('Arial', 12)

    # Handle long text with wrapping
    text_lines = translated_text_content.split('\n')
    text_object = c.beginText(1 * inch, 10.5 * inch)

    for line in text_lines:
        wrapped_lines = split_text_to_lines(line, c, 6.5 * inch)
        for wrapped_line in wrapped_lines:
            text_object.textLine(wrapped_line)

    c.drawText(text_object)
    c.save()
    
    return translated_file_path, text, translated_text_content




def read_pdf(file_path):
    text = ""
    try:
        with open(file_path, "rb") as file:
            reader = PyPDF2.PdfReader(file)
            for page_num in range(len(reader.pages)):
                page = reader.pages[page_num]
                text += page.extract_text()
    except Exception as e:
        print(f"Failed to read PDF file: {e}")
    return text

def get_data(data):
    """Use HugChat to summarize the given data."""
    try:
        sign = Login(EMAIL, PASSWD)
        cookies = sign.login(cookie_dir_path=cookie_path_dir, save_cookies=True)
        chatbot = hugchat.ChatBot(cookies=cookies.get_dict())
    except Exception as e:
        raise Exception(f"Failed to initialize chatbot: {e}")

    prompt = (
        f"Provide a summary of the following text:\n\n"
        f"Data:\n{data}"
    )
    
    query_result = str(chatbot.query(prompt, web_search=True))
   
    return query_result

def split_text_to_lines(text, canvas, max_width):
    """
    Splits text into lines that fit within the specified width.
    """
    lines = []
    words = text.split()
    current_line = ""
    
    for word in words:
        if canvas.stringWidth(current_line + " " + word) <= max_width:
            current_line += " " + word
        else:
            lines.append(current_line.strip())
            current_line = word
    
    if current_line:
        lines.append(current_line.strip())
    
    return lines


@app.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    file_path = os.path.join(OUTPUT_FOLDER, filename)
    if os.path.exists(file_path):
        return send_file(file_path, as_attachment=True)
    else:
        return jsonify({'error': 'File not found'}), 404

@app.route('/')
def home():
    return "Hello, World!"

if __name__== "__main__":
    app.run(debug=True)