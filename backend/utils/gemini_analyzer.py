import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")


def analyze_resume_ai(resume_text):

    prompt = f"""
You are an expert AI Resume Reviewer.

Analyze the resume below.

Return ONLY valid JSON.

Do not add markdown.
Do not add explanations.
Do not write ```json.

JSON Format:

{{
  "resume_score": 0,
  "ats_score": 0,
  "skills": [],
  "missing_skills": [],
  "strengths": [],
  "weaknesses": [],
  "suggestions": [],
  "career_recommendation": []
}}

Resume:

{resume_text}
"""

    response = model.generate_content(prompt)

    text = response.text.strip()

    if text.startswith("```json"):
        text = text.replace("```json", "").replace("```", "").strip()

    return json.loads(text)