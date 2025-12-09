Project Overview

This project is a simple full-stack patient portal that allows users to:

Upload PDF medical documents

View a list of uploaded documents

Download files in raw/original PDF form

Delete documents

Store metadata (filename, size, created_at) in a SQLite database

Store actual PDF files in a local uploads/ directory

The application uses Next.js App Router for both frontend and backend, and better-sqlite3 for database storage.

🚀 Tech Stack
Component	Technology
Frontend	Next.js (React) App Router
Backend	Next.js Route Handlers
Database	SQLite (better-sqlite3)
File Storage	Local filesystem (uploads/)
🏗️ Folder Structure
app/
 ├─ page.tsx                → Frontend UI
 └─ api/
     ├─ upload/route.ts     → POST Upload file
     ├─ files/route.ts      → GET List files
     └─ files/[id]/route.ts → GET Download + DELETE file
lib/
 └─ db.ts                   → SQLite database helper
uploads/                    → PDF storage
data.sqlite                 → SQLite file
README.md
design.md

🛠️ How to Run the Project Locally
1. Clone the repository
git clone https://github.com/saurabhkr66/INI8.git
cd INI8

2. Install dependencies
npm install

3. Run the development server
npm run dev

4. Open the app

👉 http://localhost:3000

No database setup required

SQLite DB is created automatically as:

data.sqlite


Uploads directory is also created automatically:

uploads/

📡 API Reference + Example Calls

Below are curl commands you can use to test the backend API.

📤 1. Upload a PDF
POST /documents/upload


Sample Response
{
  "id": 1,
  "filename": "1733738201295-test.pdf",
  "original_name": "test.pdf",
  "size": 204800
}

📄 2. List All Documents
GET /documents


Sample Response
[
  {
    "id": 1,
    "filename": "1733738201295-test.pdf",
    "original_name": "test.pdf",
    "size": 204800,
    "created_at": "2025-01-01T12:00:00Z"
  }
]

📥 3. Download a Document
GET /documents/:id



This saves the file locally as downloaded.pdf

❌ 4. Delete a Document
DELETE /documents/:id


Sample Response:
{
  "success": true
}

📝 Assumptions

Only PDF files are allowed

No authentication (single-user system)

Upload size expected to be small (e.g., <10MB)

SQLite is suitable for local/small scale use

File storage is local (uploads/ directory)
