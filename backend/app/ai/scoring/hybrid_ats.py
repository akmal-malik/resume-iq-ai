import re
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# LOAD MODEL
model = SentenceTransformer("all-MiniLM-L6-v2")

# SAMPLE RESUME
resume = {
    "skills": [
        "python",
        "sql",
        "tableau",
        "machine learning",
        "power bi"
    ],
    "experience": 2,
    "education": "bachelor",
    "certifications": 1,
    "text": """
    Python SQL Tableau Power BI Machine Learning
    """
}

# SAMPLE JOB DESCRIPTION
job = {
    "required_skills": [
        "python",
        "sql",
        "tableau",
        "statistics",
        "power bi"
    ],
    "min_experience": 2,
    "education": "bachelor",
    "preferred_certifications": 1,
    "text": """
    Looking for a Data Analyst with Python,
    SQL, Tableau, statistics, Power BI,
    and machine learning knowledge.
    """
}

# -----------------------------
# 1. SEMANTIC SCORE
# -----------------------------
resume_embedding = model.encode([resume["text"]])

job_embedding = model.encode([job["text"]])

semantic_score = cosine_similarity(
    resume_embedding,
    job_embedding
)[0][0] * 100

# -----------------------------
# 2. SKILL MATCH SCORE
# -----------------------------
matched_skills = set(resume["skills"]).intersection(
    set(job["required_skills"])
)

skill_score = (
    len(matched_skills)
    / len(job["required_skills"])
) * 100

# -----------------------------
# 3. EXPERIENCE SCORE
# -----------------------------
if resume["experience"] >= job["min_experience"]:
    experience_score = 100
else:
    experience_score = (
        resume["experience"]
        / job["min_experience"]
    ) * 100

# -----------------------------
# 4. EDUCATION SCORE
# -----------------------------
education_score = 100 if (
    resume["education"]
    == job["education"]
) else 50

# -----------------------------
# 5. CERTIFICATION SCORE
# -----------------------------
if (
    resume["certifications"]
    >= job["preferred_certifications"]
):
    certification_score = 100
else:
    certification_score = 50

# -----------------------------
# FINAL HYBRID ATS SCORE
# -----------------------------
final_score = (
    semantic_score * 0.4
    + skill_score * 0.3
    + experience_score * 0.15
    + education_score * 0.1
    + certification_score * 0.05
)

print("\n========== ATS SCORE BREAKDOWN ==========")

print(f"\nSemantic Score: {semantic_score:.2f}%")

print(f"Skill Match Score: {skill_score:.2f}%")

print(f"Experience Score: {experience_score:.2f}%")

print(f"Education Score: {education_score:.2f}%")

print(f"Certification Score: {certification_score:.2f}%")

print(f"\nFINAL ATS SCORE: {final_score:.2f}%")