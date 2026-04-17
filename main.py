from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pymongo import MongoClient
from deep_translator import GoogleTranslator
from bson import ObjectId
import fitz  # PyMuPDF
import PyPDF2
import os, re
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from hugchat import hugchat
from hugchat.login import Login
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── MongoDB ──────────────────────────────────────────────────────────────────
client = MongoClient('mongodb://127.0.0.1:27017/')

formatted_text_collection   = client['formatted_data']['formatted_text']
sorted_field_values_collection = client['formatted_data']['sorted_field_values']
form_data_collection        = client['form_data']['submissions']

# ── Folders ──────────────────────────────────────────────────────────────────
UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = 'outputs'
COOKIE_DIR    = './cookies/'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# ── HugChat credentials (fill in or use env vars) ────────────────────────────
HUGCHAT_EMAIL  = os.getenv("HUGCHAT_EMAIL", "")
HUGCHAT_PASSWD = os.getenv("HUGCHAT_PASSWD", "")

def translate(text: str, src: str, dest: str) -> str:
    return GoogleTranslator(source=src, target=dest).translate(text)

# ── Helpers ──────────────────────────────────────────────────────────────────
def extract_text_pymupdf(filepath: str) -> str:
    try:
        doc = fitz.open(filepath)
        text = "".join(page.get_text() for page in doc)
        doc.close()
        return text
    except Exception as e:
        print(f"PyMuPDF error: {e}")
        return ""

def extract_text_pypdf2(filepath: str) -> str:
    text = ""
    try:
        with open(filepath, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                text += page.extract_text()
    except Exception as e:
        print(f"PyPDF2 error: {e}")
    return text

def format_text(text: str) -> str:
    return re.sub(r'\s+', ' ', text.strip().replace('\n', ' '))

def extract_field_value(text: str, field: str) -> str:
    pattern = re.compile(rf'{field}[:\-]?\s*(.*?)(?:\n|$)', re.IGNORECASE)
    match = pattern.search(text)
    return match.group(1).strip() if match else ""

def get_hugchat_response(prompt: str) -> str:
    if not HUGCHAT_EMAIL or not HUGCHAT_PASSWD:
        return "HugChat credentials not configured."
    try:
        sign = Login(HUGCHAT_EMAIL, HUGCHAT_PASSWD)
        cookies = sign.login(cookie_dir_path=COOKIE_DIR, save_cookies=True)
        chatbot = hugchat.ChatBot(cookies=cookies.get_dict())
        return str(chatbot.query(prompt, web_search=True))
    except Exception as e:
        return f"HugChat error: {e}"

def split_text_to_lines(text: str, c, max_width: float) -> list:
    lines, current_line = [], ""
    for word in text.split():
        if c.stringWidth(current_line + " " + word) <= max_width:
            current_line += " " + word
        else:
            lines.append(current_line.strip())
            current_line = word
    if current_line:
        lines.append(current_line.strip())
    return lines

FORM_FIELDS = [
    "Name","ContactNumber","DateOfBirth","Age","Gender","Email","Status",
    "HouseNo","Street","Landmark","PostalCode","City","State","District",
    "Country","Government_Id","AadharCard","VoterId","Passport","PanCard",
    "DrivingLicense","Government_Id_Number","DetailsOf","Father","Mother",
    "Sister","Brother","Spouse","FullName","male","female","other",
    "single","married","divorced","fullName"
]

LABELS = FORM_FIELDS + ["submit"]

# ── Routes ───────────────────────────────────────────────────────────────────

@app.get("/")
def index():
    return {"message": "Welcome to the Translation API!"}

# ---------- from formpage.py ----------

@app.get("/translateLabels")
def translate_labels(lang: str):
    result = {}
    for label in LABELS:
        try:
            result[label] = translate(label, src="en", dest=lang)
        except Exception as e:
            result[label] = f"Error: {e}"
    return result

class FormPayload(BaseModel):
    sourceLang: Optional[str] = "en"
    targetLang: Optional[str] = "en"
    # remaining keys are dynamic, handled via dict

@app.post("/submitForm")
async def submit_form(data: dict):
    source_lang = data.pop("sourceLang", "en")
    target_lang = data.get("targetLang", "en")
    translated_data = {}
    for key, value in data.items():
        try:
            translated_data[key] = {"original": value, "translated": translate(str(value), src=source_lang, dest=target_lang)}
        except Exception as e:
            translated_data[key] = {"original": value, "translated": f"Error: {e}"}
    try:
        result = form_data_collection.insert_one({"translated_data": translated_data})
        return {"status": "success", "message": "Data saved successfully", "objectId": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/getTranslatedData/{object_id}")
def get_translated_data(object_id: str):
    try:
        doc = form_data_collection.find_one({"_id": ObjectId(object_id)})
        if doc:
            td = doc.get("translated_data", {})
            return {k: v.get("translated", "") for k, v in td.items()}
        return {"error": "-"}
    except Exception:
        return {"error": "-"}

@app.post("/upload/pdf-fields")
async def upload_pdf_fields(file: UploadFile = File(...)):
    """From formpage.py — extract fields from PDF and save to MongoDB."""
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())

    text = extract_text_pypdf2(file_path)
    formatted = format_text(text)
    field_values = {field: extract_field_value(formatted, field) for field in FORM_FIELDS}

    formatted_text_collection.insert_one({"file_path": file_path, "formatted_text": formatted})
    sorted_field_values_collection.insert_one({"file_path": file_path, "field_values": field_values})

    return {
        "status": "success",
        "file_path": file_path,
        "formatted_text": formatted,
        "field_values": field_values
    }

# ---------- from file.py ----------

@app.post("/upload/pdf-chat")
async def upload_pdf_chat(
    file: UploadFile = File(...),
    prompt: str = Form(""),
    fromLang: str = Form("en"),
    toLang: str = Form("hi")
):
    """From file.py — extract PDF text, run HugChat, translate."""
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files accepted")

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())

    extracted_text = extract_text_pymupdf(file_path)
    if not extracted_text:
        raise HTTPException(status_code=500, detail="Failed to extract text from PDF")

    processed_data = get_hugchat_response(f"{prompt} from {extracted_text}") if prompt else "No prompt provided."

    try:
        translated_extracted = translate(extracted_text, src=fromLang, dest=toLang)
        translated_processed = translate(processed_data, src=fromLang, dest=toLang)
    except Exception:
        translated_extracted = extracted_text
        translated_processed = processed_data

    return {
        "extracted_text": extracted_text,
        "processed_data": processed_data,
        "translated_extracted_text": translated_extracted,
        "translated_processed_data": translated_processed,
    }

# ---------- from convert.py ----------

class TranslateTextRequest(BaseModel):
    text: str
    src_lang: str
    dest_lang: str

@app.post("/translate")
def translate_text_route(body: TranslateTextRequest):
    """From convert.py — translate plain text."""
    try:
        result = translate(body.text, src=body.src_lang, dest=body.dest_lang)
        return {"translated_text": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload/pdf-translate")
async def upload_pdf_translate(
    file: UploadFile = File(...),
    src_lang: str = Form(...),
    dest_lang: str = Form(...)
):
    """From convert.py — translate full PDF and return downloadable file."""
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())

    text = extract_text_pymupdf(file_path)
    if not text.strip():
        raise HTTPException(status_code=500, detail="Failed to extract text from PDF")

    try:
        translated_text = translate(text, src=src_lang, dest=dest_lang)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    out_path = os.path.join(OUTPUT_FOLDER, f"translated_{file.filename}")
    c = canvas.Canvas(out_path, pagesize=letter)
    try:
        pdfmetrics.registerFont(TTFont('Arial', 'Arial.ttf'))
        c.setFont('Arial', 12)
    except Exception:
        c.setFont('Helvetica', 12)

    text_obj = c.beginText(1 * inch, 10.5 * inch)
    for line in translated_text.split('\n'):
        for wrapped in split_text_to_lines(line, c, 6.5 * inch):
            text_obj.textLine(wrapped)
    c.drawText(text_obj)
    c.save()

    return {
        "original_summary": text,
        "translated_summary": translated_text,
        "pdf_url": f"/download/{os.path.basename(out_path)}"
    }

@app.get("/download/{filename}")
def download_file(filename: str):
    file_path = os.path.join(OUTPUT_FOLDER, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type='application/pdf', filename=filename)
    raise HTTPException(status_code=404, detail="File not found")
