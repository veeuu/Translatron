# Translatron

Translatron is a full-stack application that streamlines file uploads, text extraction, translation, and verification. The project features a modern React frontend and a robust Flask backend, with MongoDB for data storage.

---

## 🚀 Features

- **File Uploads**: Easily upload documents for processing.
- **Text Extraction**: Extracts text from uploaded files.
- **Translation**: Translate extracted text into multiple languages.
- **Verification Pages**: Review and verify translated content.
- **Modern UI**: Built with React for a smooth user experience.
- **RESTful Backend**: Flask API with MongoDB integration.

---

## 🗂️ Project Structure

```
translatron-main/
│
├── my-app/                  # React frontend
│   ├── public/              # Static assets
│   └── src/
│       ├── components/      # React components
│       └── images/          # Image assets
│
├── convert.py               # Flask backend: conversion logic
├── file.py                  # Flask backend: file handling
├── formpage.py              # Flask backend: main API endpoints
├── package.json             # Node.js project config
└── readme.txt               # Additional documentation
```

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js & npm](https://nodejs.org/)
- [Python](https://www.python.org/)
- [MongoDB](https://www.mongodb.com/)

---

### 1. Frontend Setup

```powershell
cd my-app
npm install
npm run start
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

---

### 2. Backend Setup

```powershell
cd ..
```

- Open `formpage.py`, `convert.py`, and `file.py` in your editor.
- Update credentials (MongoDB URI, HugChat login, etc.) as needed.
- Ensure MongoDB is running and accessible.

Start the backend services:

```powershell
python formpage.py
python convert.py
python file.py
```

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

This project is licensed under the MIT License.

---

## ✨ Credits

- Frontend: React
- Backend: Flask
- Database: MongoDB

---

Enjoy using **Translatron** – your all-in-one translation and