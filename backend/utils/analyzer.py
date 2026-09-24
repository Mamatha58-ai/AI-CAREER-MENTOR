import re

SKILLS = [
    "Python",
    "Java",
    "C",
    "C++",
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Flask",
    "Django",
    "SQL",
    "Machine Learning",
    "Git"
]


def analyze_resume(text):

    score = 50

    found_skills = []

    text_lower = text.lower()

    for skill in SKILLS:
        if skill.lower() in text_lower:
            found_skills.append(skill)

    score += len(found_skills) * 5

    if score > 100:
        score = 100

    missing = [s for s in SKILLS if s not in found_skills]

    strengths = []

    if len(found_skills) >= 8:
        strengths.append("Excellent technical skillset")

    if "python" in text_lower:
        strengths.append("Python Programming")

    if "react" in text_lower:
        strengths.append("Frontend Development")

    if "sql" in text_lower:
        strengths.append("Database Knowledge")

    if len(strengths) == 0:
        strengths.append("Good foundation")

    suggestions = []

    if "Git" not in found_skills:
        suggestions.append("Learn Git & GitHub")

    if "SQL" not in found_skills:
        suggestions.append("Improve SQL knowledge")

    if "Machine Learning" not in found_skills:
        suggestions.append("Learn Machine Learning")

    if "React" not in found_skills:
        suggestions.append("Learn React")

    if score < 80:
        suggestions.append("Add more technical projects")

    return {
        "score": score,
        "skills": found_skills,
        "missing_skills": missing,
        "strengths": strengths,
        "suggestions": suggestions
    }


def recommend_careers(text):

    text = text.lower()

    careers = []

    if "python" in text:
        careers.append({"role": "Python Developer", "match": 92})

    if "machine learning" in text:
        careers.append({"role": "AI/ML Engineer", "match": 90})

    if "sql" in text:
        careers.append({"role": "Data Analyst", "match": 85})

    if "react" in text:
        careers.append({"role": "Frontend Developer", "match": 88})

    if "flask" in text or "django" in text:
        careers.append({"role": "Backend Developer", "match": 84})

    if "html" in text and "css" in text:
        careers.append({"role": "Full Stack Developer", "match": 86})

    if "java" in text:
        careers.append({"role": "Java Developer", "match": 82})

    if len(careers) == 0:
        careers.append({
            "role": "Software Engineer",
            "match": 70
        })

    return careers


def recommend_careers_from_profile(profile):
    text = profile.get("skills", []) + profile.get("interests", [])
    full_text = " ".join(text).lower()
    goal = profile.get("goal", "job")

    if goal == "higher_studies":
        career_profiles = [
            {
                "role": "AI Research Scientist",
                "match": 0,
                "keywords": ["ai", "machine learning", "data science", "python", "research"],
                "reason": "Strong fit for advanced study, research, and AI-based innovation.",
                "required_skills": ["Python", "Machine Learning", "Research", "Statistics"],
                "salary": "₹10–25 LPA after higher studies"
            },
            {
                "role": "Data Science Research Path",
                "match": 0,
                "keywords": ["data science", "python", "sql", "analytics", "statistics"],
                "reason": "Best for students who want deeper research and analysis skills.",
                "required_skills": ["Python", "SQL", "Statistics", "Analytics"],
                "salary": "₹8–20 LPA after MSc/MTech"
            },
            {
                "role": "M.Tech / MS Study Path",
                "match": 0,
                "keywords": ["computer science", "ai", "web development", "data science", "research"],
                "reason": "Useful for students who want to specialize in a focused technical field.",
                "required_skills": ["Core Subjects", "Research", "Academic Projects", "Presentation"],
                "salary": "Higher studies pathway"
            },
            {
                "role": "Research Analyst",
                "match": 0,
                "keywords": ["analysis", "sql", "python", "research", "problem solving"],
                "reason": "Suitable for students who enjoy structured thinking and in-depth analysis.",
                "required_skills": ["Analysis", "SQL", "Python", "Reports"],
                "salary": "₹6–14 LPA"
            },
            {
                "role": "Cybersecurity Research",
                "match": 0,
                "keywords": ["cybersecurity", "security", "network", "linux", "research"],
                "reason": "Ideal if you like secure systems, networking, and advanced technical exploration.",
                "required_skills": ["Networking", "Security", "Linux", "Research"],
                "salary": "₹7–18 LPA"
            }
        ]
    else:
        career_profiles = [
            {
                "role": "AI Engineer",
                "match": 0,
                "keywords": ["python", "ai", "machine learning", "ml", "data science", "problem solving"],
                "reason": "Strong match for AI-focused problem solving and coding.",
                "required_skills": ["Python", "Machine Learning", "Deep Learning", "TensorFlow"],
                "salary": "₹8–15 LPA fresher"
            },
            {
                "role": "Data Scientist",
                "match": 0,
                "keywords": ["python", "sql", "data analysis", "statistics", "machine learning", "analytics"],
                "reason": "Great fit for analytical thinking and data-based decision making.",
                "required_skills": ["Python", "Pandas", "SQL", "Statistics"],
                "salary": "₹7–20 LPA"
            },
            {
                "role": "Full Stack Developer",
                "match": 0,
                "keywords": ["javascript", "react", "html", "css", "node", "web development"],
                "reason": "Best fit for students who enjoy building complete web applications.",
                "required_skills": ["HTML", "CSS", "JavaScript", "React", "Node.js"],
                "salary": "₹6–18 LPA"
            },
            {
                "role": "Frontend Developer",
                "match": 0,
                "keywords": ["html", "css", "javascript", "react", "ui", "ux", "design"],
                "reason": "Suitable for students who enjoy user interface and web design.",
                "required_skills": ["HTML", "CSS", "JavaScript", "React"],
                "salary": "₹5–15 LPA"
            },
            {
                "role": "Backend Developer",
                "match": 0,
                "keywords": ["python", "java", "sql", "flask", "django", "api", "backend"],
                "reason": "Good fit for students who like building application logic and APIs.",
                "required_skills": ["Python", "Flask", "Django", "SQL", "APIs"],
                "salary": "₹6–16 LPA"
            },
            {
                "role": "Cybersecurity Analyst",
                "match": 0,
                "keywords": ["cybersecurity", "ethical hacking", "network", "security", "linux"],
                "reason": "Fits students interested in protecting systems and data.",
                "required_skills": ["Networking", "Security Basics", "Linux", "Ethical Hacking"],
                "salary": "₹6–18 LPA"
            },
            {
                "role": "Cloud Engineer",
                "match": 0,
                "keywords": ["cloud", "aws", "azure", "devops", "docker", "linux"],
                "reason": "A strong option for students interested in scalable infrastructure.",
                "required_skills": ["Cloud", "AWS", "Azure", "Docker"],
                "salary": "₹7–20 LPA"
            }
        ]

    for career in career_profiles:
        score = 0
        for keyword in career["keywords"]:
            if keyword in full_text:
                score += 20

        if profile.get("likes_coding"):
            if career["role"] in ["AI Engineer", "Data Scientist", "Full Stack Developer", "Backend Developer", "Frontend Developer", "AI Research Scientist", "Data Science Research Path", "Research Analyst"]:
                score += 15

        if profile.get("likes_logic"):
            if career["role"] in ["AI Engineer", "Data Scientist", "Cybersecurity Analyst", "Cloud Engineer", "AI Research Scientist", "Data Science Research Path", "Research Analyst"]:
                score += 15

        if profile.get("likes_design"):
            if career["role"] in ["Frontend Developer", "Full Stack Developer"]:
                score += 10

        if goal == "job":
            if career["role"] in ["AI Engineer", "Data Scientist", "Full Stack Developer", "Backend Developer", "Frontend Developer"]:
                score += 15
        elif goal == "higher_studies":
            if career["role"] in ["AI Research Scientist", "Data Science Research Path", "M.Tech / MS Study Path", "Research Analyst"]:
                score += 20

        if profile.get("work_style") == "hybrid" and career["role"] in ["AI Engineer", "Data Scientist", "Full Stack Developer", "Cloud Engineer"]:
            score += 5

        career["match"] = min(score, 100)

    careers = sorted(career_profiles, key=lambda x: x["match"], reverse=True)
    return careers[:5]


def skill_gap_detection(role, skills):
    role_requirements = {
        "Full Stack Developer":      ["HTML", "CSS", "JavaScript", "React", "Node.js", "SQL", "Git"],
        "Frontend Developer":        ["HTML", "CSS", "JavaScript", "React", "TypeScript", "Git"],
        "Backend Developer":         ["Python", "Flask", "Django", "SQL", "Java", "REST APIs", "Git"],
        "Data Scientist":            ["Python", "SQL", "Machine Learning", "Statistics", "Pandas", "Git"],
        "AI Engineer":               ["Python", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Git"],
        "Cybersecurity Analyst":     ["Networking", "Security", "Linux", "Python", "Ethical Hacking", "Git"],
        "Cloud Engineer":            ["AWS", "Azure", "Docker", "Kubernetes", "Linux", "Terraform", "Git"],
        "DevOps Engineer":           ["Docker", "Kubernetes", "CI/CD", "Linux", "Ansible", "Git"],
        "Mobile Developer":          ["React Native", "Flutter", "Java", "Swift", "Firebase", "Git"],
        "UI/UX Designer":            ["Figma", "Adobe XD", "Wireframing", "Prototyping", "CSS", "User Research"],
        "Database Administrator":    ["SQL", "PostgreSQL", "MongoDB", "Redis", "Database Design", "Git"],
        "Machine Learning Engineer": ["Python", "Machine Learning", "Deep Learning", "MLflow", "Docker", "Git"],
        "Game Developer":            ["C++", "Unity", "Unreal Engine", "3D Math", "OpenGL", "Git"],
        "Blockchain Developer":      ["Solidity", "Web3.js", "Ethereum", "Smart Contracts", "JavaScript", "Git"],
    }

    required_skills = role_requirements.get(role, ["Python", "SQL", "Git"])
    normalized_skills = []

    for skill in skills:
        if isinstance(skill, str):
            cleaned = skill.strip()
            if cleaned:
                normalized_skills.append(cleaned)

    normalized_set = {skill.lower() for skill in normalized_skills}
    known_skills = []
    missing_skills = []

    for skill in required_skills:
        if skill.lower() in normalized_set:
            known_skills.append(skill)
        else:
            missing_skills.append(skill)

    score = round((len(known_skills) / len(required_skills)) * 100) if required_skills else 100

    suggestions = []
    if missing_skills:
        suggestions.append(f"Start with: {', '.join(missing_skills[:3])}")
    if "Python" not in known_skills and "Python" in required_skills:
        suggestions.append("Practice Python through mini projects and coding exercises")
    if "SQL" not in known_skills and "SQL" in required_skills:
        suggestions.append("Improve SQL by working on joins, queries, and database design")
    if "Git" not in known_skills and "Git" in required_skills:
        suggestions.append("Learn Git version control and GitHub workflows")
    if "Docker" not in known_skills and "Docker" in required_skills:
        suggestions.append("Get hands-on with Docker by containerising a small project")
    if "Machine Learning" not in known_skills and "Machine Learning" in required_skills:
        suggestions.append("Build a basic ML model using scikit-learn to get started")

    if not suggestions:
        suggestions.append("Your skill set is already aligned with this role — great work!")

    return {
        "role": role,
        "score": score,
        "known_skills": known_skills,
        "missing_skills": missing_skills,
        "suggestions": suggestions,
        "required_skills": required_skills,
    }


def get_role_skills(role):
    """Return the required skills list for a given role (used by frontend hints)."""
    from utils.analyzer import skill_gap_detection  # avoid circular — reuse the map
    role_requirements = {
        "Full Stack Developer":      ["HTML", "CSS", "JavaScript", "React", "Node.js", "SQL", "Git"],
        "Frontend Developer":        ["HTML", "CSS", "JavaScript", "React", "TypeScript", "Git"],
        "Backend Developer":         ["Python", "Flask", "Django", "SQL", "Java", "REST APIs", "Git"],
        "Data Scientist":            ["Python", "SQL", "Machine Learning", "Statistics", "Pandas", "Git"],
        "AI Engineer":               ["Python", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Git"],
        "Cybersecurity Analyst":     ["Networking", "Security", "Linux", "Python", "Ethical Hacking", "Git"],
        "Cloud Engineer":            ["AWS", "Azure", "Docker", "Kubernetes", "Linux", "Terraform", "Git"],
        "DevOps Engineer":           ["Docker", "Kubernetes", "CI/CD", "Linux", "Ansible", "Git"],
        "Mobile Developer":          ["React Native", "Flutter", "Java", "Swift", "Firebase", "Git"],
        "UI/UX Designer":            ["Figma", "Adobe XD", "Wireframing", "Prototyping", "CSS", "User Research"],
        "Database Administrator":    ["SQL", "PostgreSQL", "MongoDB", "Redis", "Database Design", "Git"],
        "Machine Learning Engineer": ["Python", "Machine Learning", "Deep Learning", "MLflow", "Docker", "Git"],
        "Game Developer":            ["C++", "Unity", "Unreal Engine", "3D Math", "OpenGL", "Git"],
        "Blockchain Developer":      ["Solidity", "Web3.js", "Ethereum", "Smart Contracts", "JavaScript", "Git"],
    }
    return role_requirements.get(role, [])