1. Tech Stack Choices

### Q1. What frontend framework did you use and why?

        Frontend: Next.js (React) – App Router
        Built-in routing + server components
        Supports file uploads without extra libraries
        Easy integration of API routes and UI in one project
        Modern, fast, and widely adopted

### Q2. What backend framework did you choose and why?

        Backend: Next.js Route Handlers 
        No need for a separate backend server
        Route Handlers allow direct file uploads using req.formData()
        Seamless communication between frontend and backend
        Simpler deployment and single codebase

### Q3. What database did you choose and why?

        Database: SQLite with better-sqlite3
        Reasons: Lightweight and embedded (no server setup required)
        Ideal for small apps and local assignments
        Fast performance for simple CRUD operations
        Stores data in a single file (data.sqlite)
        Perfect for a single-user or small-scale system

### Q4. If you were to support 1,000+ users, what changes would you consider?

    1.To scale this system:
        Move database to PostgreSQL
        Better concurrency
        Handles high read/write load

    2.Move file storage to cloud (e.g., AWS S3)
        Eliminates local disk limits
        Improves durability

    3.Introduce authentication (e.g., JWT or OAuth)
        Allow multiple users to upload their own documents

4.Use a backend framework (Express/Nest.js) if complexity grows
    More modularity
    Background jobs, microservices support

### 2.System Flow Diagram 

        [Frontend Page] 
            |
            | (HTTP Request: upload, list, download, delete)
            v
        [Next.js API Route Handlers]
            |
            |--- Write File --->  /uploads/<filename>.pdf
            |
            |--- Write Metadata → SQLite (data.sqlite)
            |
            v
        [Response Sent Back to Frontend]

 Flow

        The frontend sends requests (upload, list, delete, download).
        Backend (Route Handlers) processes the HTTP request.
        PDF files are stored in uploads/ directory.
        Metadata (filename, original name, size, created_at) is stored in SQLite.
        Responses return JSON or file streams to the frontend.

### 3. API Specification
### 1. Upload Document

POST /documents/upload

Request
Multipart Form Data:
file: <PDF file>
Response
{
  "id": 1,
  "filename": "1733738201295-report.pdf",
  "original_name": "report.pdf",
  "size": 204800
}

Description:
Uploads a PDF, stores it in /uploads, and saves metadata in SQLite.

### 2. List All Documents

GET /documents
Response
[
  {
    "id": 1,
    "filename": "1733738201295-report.pdf",
    "original_name": "report.pdf",
    "size": 204800,
    "created_at": "2025-01-01T12:00:00Z"
  }
]

### 3. Download Document

GET /documents/:id

    Response
    Binary PDF file stream with headers:
    Content-Type: application/pdf
    Content-Disposition: attachment; filename="report.pdf"

### 4. Delete Document

    DELETE /documents/:id
    Response
    {
    "success": true
    }
    Description:
    Deletes both the database entry and the actual file in uploads/.

4. Data Flow Description
### Q5. Step-by-step process when a file is uploaded
Upload Flow

        User selects a PDF file on the frontend.
        Frontend validates file type (application/pdf).
        Frontend sends file using FormData to backend POST /documents/upload.
        Route Handler reads file using:
        Backend writes file to uploads/<uniqueName>.pdf.
        Backend inserts metadata into SQLite:
            id
            filename
            original_name
            size
            created_at
        Backend returns success JSON.
        Frontend refreshes the document list.

Download Flow

        Frontend requests /documents/:id.
        Backend fetches metadata from SQLite.
        Backend reads file from /uploads/<filename>.
        Backend streams file to browser with:
        User downloads the file in its original form.


### Q6. What assumptions were made?

Single user system
No authentication implemented.
Assumed normal medical PDFs (<10 MB).No explicit max limit enforced.
Local storage is acceptable
Files stored in /uploads folder.
SQLite supports low concurrency, suitable for a single-user system.
Documents are only PDFs
No versioning, tags, or categories needed.