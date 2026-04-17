from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# CORS hardening:
# - Browsers reject wildcard origins when credentials are enabled.
# - Keep credentials disabled for a permissive local/dev setup.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

skills_db = [
    "python", "java", "spring boot", "react", "angular", "sql",
    "aws", "fastapi", "html", "css", "javascript", "git",
    "rest api", "docker", "kubernetes", "mongodb", "communication",
    "teamwork", "problem solving"
]

class CompareRequest(BaseModel):
    resume_text: str
    job_description: str

@app.post("/match-resume")
def match_resume(data: CompareRequest):
    resume = data.resume_text.lower()
    jd = data.job_description.lower()

    resume_skills = [skill for skill in skills_db if skill in resume]
    jd_skills = [skill for skill in skills_db if skill in jd]

    matched_skills = [skill for skill in jd_skills if skill in resume_skills]
    missing_skills = [skill for skill in jd_skills if skill not in resume_skills]

    match_score = 0
    if len(jd_skills) > 0:
        match_score = round((len(matched_skills) / len(jd_skills)) * 100, 2)

    suggestions = []

    if missing_skills:
        suggestions.append(f"Consider adding or building experience around: {', '.join(missing_skills)}")

    if "aws" in missing_skills:
        suggestions.append("Try doing a small AWS project or certification")

    if "communication" in missing_skills:
        suggestions.append("Highlight teamwork or communication experience in your resume")

    return {
        "resume_skills": resume_skills,
        "jd_skills": jd_skills,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "match_score": match_score,
        "suggestions": suggestions
    }