from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import fitz  # PyMuPDF
import json
import os
import re

from utils.analyzer import (
    analyze_resume,
    recommend_careers,
    recommend_careers_from_profile,
    skill_gap_detection,
)

# Try to import Gemini-powered analyzer; fall back to rule-based if not configured
try:
    from utils.gemini_analyzer import analyze_resume_ai
    GEMINI_AVAILABLE = True
except Exception:
    GEMINI_AVAILABLE = False

app = Flask(__name__)
CORS(app)

# ── DATABASE ────────────────────────────────────────────────────────────────
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{os.path.join(BASE_DIR, 'career_mentor.db')}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

class User(db.Model):
    id            = db.Column(db.Integer, primary_key=True)
    name          = db.Column(db.String(200), nullable=False)
    email         = db.Column(db.String(200), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class ResumeRecord(db.Model):
    id          = db.Column(db.Integer, primary_key=True)
    email       = db.Column(db.String(200), unique=True, nullable=False)
    filename    = db.Column(db.String(300), nullable=False)
    score       = db.Column(db.Integer, nullable=False)
    result_json = db.Column(db.Text, nullable=False)

with app.app_context():
    db.create_all()


# ── HELPERS ────────────────────────────────────────────────────────────────

def extract_pdf_text(file_stream) -> str:
    """Extract plain text from an uploaded PDF file stream."""
    pdf = fitz.open(stream=file_stream.read(), filetype="pdf")
    return "".join(page.get_text() for page in pdf)


# ── ROUTES ─────────────────────────────────────────────────────────────────

# ── AUTH ROUTES ─────────────────────────────────────────────────────────────

@app.route("/auth/register", methods=["POST"])
def register():
    """Create a new user account."""
    payload = request.get_json()
    if not payload:
        return jsonify({"error": "No data provided"}), 400

    name     = payload.get("name",     "").strip()
    email    = payload.get("email",    "").strip().lower()
    password = payload.get("password", "").strip()

    if not name or not email or not password:
        return jsonify({"error": "Name, email and password are required"}), 400

    if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email):
        return jsonify({"error": "Invalid email address"}), 400

    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "An account with that email already exists"}), 409

    user = User(name=name, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "Account created successfully",
        "user": {"name": user.name, "email": user.email}
    }), 201


@app.route("/auth/login", methods=["POST"])
def login():
    """Authenticate a user and return their details."""
    payload = request.get_json()
    if not payload:
        return jsonify({"error": "No data provided"}), 400

    email    = payload.get("email",    "").strip().lower()
    password = payload.get("password", "").strip()

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Incorrect email or password"}), 401

    return jsonify({
        "message": "Login successful",
        "user": {"name": user.name, "email": user.email}
    })


@app.route("/auth/user/<email>", methods=["GET"])
def get_user(email):
    """Return stored user details by email (used to restore session)."""
    user = User.query.filter_by(email=email.strip().lower()).first()
    if not user:
        return jsonify({"found": False}), 200
    return jsonify({"found": True, "user": {"name": user.name, "email": user.email}})


@app.route("/")
def home():
    return jsonify({
        "service": "AI Career Mentor Backend",
        "status":  "running",
        "gemini":  GEMINI_AVAILABLE,
    })


@app.route("/upload", methods=["POST"])
def upload_resume():
    """
    Accept a PDF resume, extract text, and return an analysis.
    Uses Gemini AI if configured; falls back to rule-based analysis.
    """
    if "resume" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["resume"]

    try:
        text = extract_pdf_text(file)
    except Exception as e:
        return jsonify({"error": f"Could not read PDF: {str(e)}"}), 422

    if not text.strip():
        return jsonify({"error": "PDF appears to be empty or image-only."}), 422

    # Prefer Gemini AI analysis
    if GEMINI_AVAILABLE:
        try:
            result = analyze_resume_ai(text)
            # Normalise field names so frontend always gets the same shape
            result.setdefault("score",          result.pop("resume_score", result.pop("ats_score", 0)))
            result.setdefault("skills",          [])
            result.setdefault("missing_skills",  [])
            result.setdefault("strengths",        [])
            result.setdefault("suggestions",      [])
            careers = recommend_careers(text)
            result["career"] = careers
            return jsonify(result)
        except Exception as ai_err:
            # AI failed — fall through to rule-based
            app.logger.warning(f"Gemini analysis failed, using fallback: {ai_err}")

    # Rule-based fallback
    result  = analyze_resume(text)
    careers = recommend_careers(text)
    result["career"] = careers
    return jsonify(result)


@app.route("/career-recommendation", methods=["POST"])
def career_recommendation():
    """Return ranked career recommendations based on user profile."""
    payload = request.get_json()
    if not payload:
        return jsonify({"error": "No profile data provided"}), 400

    profile = {
        "name":         payload.get("name", "Student"),
        "education":    payload.get("education", ""),
        "branch":       payload.get("branch", ""),
        "current_year": payload.get("current_year", ""),
        "cgpa":         payload.get("cgpa", ""),
        "skills":       payload.get("skills", []),
        "interests":    payload.get("interests", []),
        "likes_coding": payload.get("likes_coding", False),
        "likes_logic":  payload.get("likes_logic", False),
        "likes_design": payload.get("likes_design", False),
        "goal":         payload.get("goal", "job"),
        "work_style":   payload.get("work_style", "hybrid"),
    }

    recommendations = recommend_careers_from_profile(profile)
    return jsonify({"name": profile["name"], "recommendations": recommendations})


@app.route("/skill-gap", methods=["POST"])
def skill_gap():
    """Return skill gap analysis for a target role."""
    payload = request.get_json()
    if not payload:
        return jsonify({"error": "No skill profile provided"}), 400

    role   = payload.get("role",   "Full Stack Developer")
    skills = payload.get("skills", [])

    result = skill_gap_detection(role, skills)
    return jsonify(result)



# ── RESUME DATABASE ROUTES ───────────────────────────────────────────────────

@app.route("/resume/save", methods=["POST"])
def save_resume():
    """Save or update a resume analysis record for a user."""
    payload = request.get_json()
    if not payload:
        return jsonify({"error": "No data provided"}), 400
    email    = payload.get("email", "").strip()
    filename = payload.get("filename", "resume.pdf").strip()
    result   = payload.get("result", {})
    if not email:
        return jsonify({"error": "email is required"}), 400
    record = ResumeRecord.query.filter_by(email=email).first()
    if record:
        record.filename    = filename
        record.score       = result.get("score", 0)
        record.result_json = json.dumps(result)
    else:
        record = ResumeRecord(
            email=email,
            filename=filename,
            score=result.get("score", 0),
            result_json=json.dumps(result),
        )
        db.session.add(record)
    db.session.commit()
    return jsonify({"message": "saved", "score": record.score})


@app.route("/resume/<email>", methods=["GET"])
def get_resume(email):
    """Fetch saved resume analysis for a user."""
    record = ResumeRecord.query.filter_by(email=email).first()
    if not record:
        return jsonify({"found": False}), 200
    return jsonify({
        "found":    True,
        "filename": record.filename,
        "score":    record.score,
        "result":   json.loads(record.result_json),
    })


@app.route("/resume/<email>", methods=["DELETE"])
def delete_resume(email):
    """Delete a user's saved resume record."""
    record = ResumeRecord.query.filter_by(email=email).first()
    if not record:
        return jsonify({"error": "No record found"}), 404
    db.session.delete(record)
    db.session.commit()
    return jsonify({"message": "deleted"})


# ── ENTRY POINT ─────────────────────────────────────────────────────────────

if __name__ == "__main__":
    app.run(debug=True, port=5000)
