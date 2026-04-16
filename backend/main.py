from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ResumeRequest(BaseModel):
    resume_text: str
    job_description: str


# ---------------------------
# Helper Functions
# ---------------------------

def extract_skills(text, skill_list):
    found_skills = []
    for skill in skill_list:
        if skill in text:
            found_skills.append(skill)
    return found_skills


def compare_skills(resume_text, job_description, skill_list):
    matched_skills = []
    missing_skills = []

    for skill in skill_list:
        if skill in resume_text and skill in job_description:
            matched_skills.append(skill)
        elif skill in job_description and skill not in resume_text:
            missing_skills.append(skill)

    return matched_skills, missing_skills


def generate_suggestions(resume_text, missing_skills):
    suggestions = []

    if len(resume_text.split()) < 80:
        suggestions.append("Resume is too short. Add more details about your work and projects.")

    if len(missing_skills) > 0:
        suggestions.append("Try adding relevant missing skills if you have worked on them.")

    return suggestions

# Detect missing sections
def check_sections(text):
    sections = ["skills", "projects", "experience", "education", "summary"]
    missing_sections = []

    for section in sections:
        if section not in text:
            missing_sections.append(section)

    return missing_sections

#Strong suggestions (AI-like)
def advanced_suggestions(resume_text, missing_skills, missing_sections):
    suggestions = []

    if missing_sections:
        suggestions.append(f"Consider adding sections: {', '.join(missing_sections)}")

    if missing_skills:
        suggestions.append(f"Missing important skills: {', '.join(missing_skills)}")

    suggestions.append("Use strong action verbs like Developed, Designed, Implemented.")

    suggestions.append("Add measurable achievements (e.g., improved performance by 30%).")

    suggestions.append("Keep bullet points concise and impactful.")

    return suggestions


# ---------------------------
# API Endpoints
# ---------------------------

@app.get("/")
def home():
    return {"message": "Resume Analyzer Backend Running"}


@app.post("/analyze")
def analyze_resume(data: ResumeRequest):
    resume_text = data.resume_text.lower()
    job_description = data.job_description.lower()

    skill_list = [
        "python",
        "java",
        "react",
        "angular",
        "sql",
        "aws",
        "api",
        "javascript",
        "spring boot"
    ]

    # Use helper functions
    found_skills = extract_skills(resume_text, skill_list)
    matched_skills, missing_skills = compare_skills(resume_text, job_description, skill_list)
    suggestions = generate_suggestions(resume_text, missing_skills)
    
    missing_sections = check_sections(resume_text)
    ai_suggestions = advanced_suggestions(resume_text, missing_skills, missing_sections)


    return {
    "found_skills": found_skills,
    "matched_skills": matched_skills,
    "missing_skills": missing_skills,
    "suggestions": suggestions,
    "ai_suggestions": ai_suggestions,
    "missing_sections": missing_sections,
    "word_count": len(resume_text.split())
    }
