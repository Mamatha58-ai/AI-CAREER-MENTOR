# AI Career Mentor

AI Career Mentor is a simple full-stack application that helps users plan their careers. Users can create an account, upload a resume, review their skills, find missing skills, explore career recommendations, and follow a learning roadmap.

## Main Features

- User registration and login
- Resume upload and analysis
- Resume score and ATS-style feedback
- Skill gap detection
- Career recommendations
- Learning roadmap suggestions
- Mock interview practice
- Optional Gemini AI resume analysis

## Technologies Used

- Frontend: React and Vite
- Backend: Python and Flask
- Database: SQLite with Flask-SQLAlchemy
- Resume reading: PyMuPDF
- AI analysis: Google Gemini API (optional)

## Project Structure

```text
AI-Project/
|-- backend/       Flask API and database code
|-- frontend/      React web application
|-- .gitignore
|-- README.md
```

## Requirements

Install these tools before starting:

- Python 3.10 or newer
- Node.js 18 or newer
- npm

## Run the Backend

Open a terminal in the project folder and run:

### Windows PowerShell

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

The backend will run at `http://localhost:5000`.

If PowerShell blocks activation, run this once in PowerShell as your user:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

## Run the Frontend

Open a second terminal in the project folder and run:

```powershell
cd frontend
npm install
npm run dev
```

Open the URL shown by Vite, usually `http://localhost:5173`.

## Optional Gemini AI Setup

The application can use Google Gemini for improved resume analysis. Create a file named `.env` inside the `backend` folder:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Keep this key private. Do not commit the `.env` file to GitHub. The application can use its built-in rule-based analyzer when Gemini is not configured.

## Useful Commands

From the `frontend` folder:

```powershell
npm run dev       # Start the development server
npm run build     # Create a production build
npm run lint      # Check the frontend code
```

## Notes

- The SQLite database is created automatically in the `backend` folder.
- Uploaded resumes are stored locally and are excluded from Git.
- Start the backend before using frontend features that call the API.