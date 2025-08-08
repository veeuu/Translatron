from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from googletrans import Translator
import os
import PyPDF2
import re
import requests
from bson import ObjectId

app = Flask(__name__)
CORS(app)

# MongoDB setup for formatted_data
formatted_data_client = MongoClient('mongodb://127.0.0.1:27017/')
formatted_data_db = formatted_data_client['formatted_data']
formatted_text_collection = formatted_data_db['formatted_text']
sorted_field_values_collection = formatted_data_db['sorted_field_values']

# MongoDB setup for form_data
form_data_client = MongoClient('mongodb://127.0.0.1:27017/')
form_data_db = form_data_client['form_data']
form_data_collection = form_data_db['submissions']

# Directory to save uploaded files
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/', methods=['GET'])
def index():
    return "Welcome to the Translation API!"

@app.route('/translateLabels', methods=['GET'])
def translate_labels():
    lang = request.args.get('lang')
    labels = [
        "Name", "ContactNumber", "DateOfBirth", "Age", "Gender", "Email", "Status",
        "HouseNo", "Street", "Landmark", "PostalCode", "City", "State",
        "District", "Country", "Government_Id", "AadharCard", "VoterId", "Passport", "PanCard",
        "DrivingLicense", "Government_Id_Number", "DetailsOf", "Father", "Mother", "Sister", "Brother",
        "Spouse", "male", "female", "other", "single", "married", "divorced", "fullName", "submit"
    ]

    translator = Translator()
    translated_labels = {}
    for label in labels:
        try:
            translated = translator.translate(label, dest=lang)
            translated_labels[label] = translated.text
        except Exception as e:
            translated_labels[label] = f"Error: {str(e)}"
    
    return jsonify(translated_labels)

@app.route('/submitForm', methods=['POST'])
def submit_form():
    data = request.json
    source_lang = data.get('sourceLang', 'en')
    target_lang = data.get('targetLang', 'en')
    translator = Translator()

    translated_data = {}
    for key, value in data.items():
        if key != 'sourceLang':
            try:
                translated = translator.translate(value, dest=target_lang, src=source_lang)
                translated_data[key] = {
                    'original': value,
                    'translated': translated.text
                }
            except Exception as e:
                translated_data[key] = {
                    'original': value,
                    'translated': f"Error: {str(e)}"
                }

    try:
        # Save only the translated_data with the unique ObjectId
        result = form_data_collection.insert_one({
            'translated_data': translated_data
        })

        return jsonify({
            "status": "success",
            "message": "Data saved successfully",
            "objectId": str(result.inserted_id)
        }), 201
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/getTranslatedData/<object_id>', methods=['GET'])
def get_translated_data(object_id):
    try:
        # Fetch the document from MongoDB using the ObjectId
        data = form_data_collection.find_one({'_id': ObjectId(object_id)})
        
        if data:
            # Extract the translated_data
            translated_data = data.get('translated_data', {})
            
            # Extract only the translated values
            translated_values = {key: value.get('translated', '') for key, value in translated_data.items()}
            
            return jsonify(translated_values)
        else:
            return jsonify({'error': '-'})  # Changed error message to '-'
    except Exception as e:
        return jsonify({'error': '-'})  # Changed error message to '-'

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"status": "error", "message": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"status": "error", "message": "No selected file"}), 400

    if file:
        filename = file.filename
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        # Process the uploaded PDF file
        formatted_text, field_values = extract_data_from_pdf(file_path)
        
        # Save the formatted text and field values to MongoDB
        formatted_text_collection.insert_one({"file_path": file_path, "formatted_text": formatted_text})
        sorted_field_values_collection.insert_one({"file_path": file_path, "field_values": field_values})
        
        return jsonify({
            "status": "success",
            "message": "File uploaded and data processed successfully",
            "file_path": file_path,
            "formatted_text": formatted_text,
            "field_values": field_values
        }), 200

def extract_data_from_pdf(file_path):
    """Extract text from a PDF file, format it, and sort field values."""
    text = ""
    try:
        with open(file_path, "rb") as file:
            reader = PyPDF2.PdfReader(file)
            for page_num in range(len(reader.pages)):
                page = reader.pages[page_num]
                text += page.extract_text()
    except Exception as e:
        return f"Failed to read PDF file: {e}", {}

    formatted_text = format_text(text)
    print(f"Formatted Text: {formatted_text}")

    # Define the fields you want to extract and sort
    fields = [
        "Name", "ContactNumber", "DateOfBirth", "Age", "Gender", "Email", "Status",
        "HouseNo", "Street", "Landmark", "PostalCode", "City", "State",
        "District", "Country", "Government_Id", "AadharCard", "VoterId", "Passport", "PanCard",
        "DrivingLicense", "Government_Id_Number", "DetailsOf", "Father", "Mother", "Sister", "Brother",
        "Spouse", "FullName", "male", "female", "other", "single", "married", "divorced", "fullName"
    ]

    field_values = {field: extract_field_value(formatted_text, field) for field in fields}
    return formatted_text, field_values

def format_text(text):
    """Format the extracted text."""
    formatted_text = text.strip().replace('\n', ' ')
    formatted_text = re.sub(r'\s+', ' ', formatted_text)  # Replace multiple spaces with a single space
    return formatted_text

def extract_field_value(text, field):
    """Extract field value from text based on field name."""
    pattern = re.compile(rf'{field}[:\-]?\s*(.*?)(?:\n|$)', re.IGNORECASE)
    match = pattern.search(text)
    return match.group(1).strip() if match else ""

if __name__ == "__main__":
    app.run(port=5001, debug=True)