from app.services.section_parser import extract_sections
from app.services.keyword_matcher import match_keywords
from app.services.score_calculator import calculate_ats_score
from app.services.feedback_generator import generate_feedback
from app.services.project_extractor import (
    extract_projects
)
from app.services.semantic_matcher import (
    semantic_similarity
)


def analyze_resume(resume_text, job_description):
    
    # Step 1: Extract sections
    sections = extract_sections(resume_text)
    print("RAW RESUME TEXT:")
    print(resume_text)

    projects = extract_projects(resume_text)
    print("EXTRACTED PROJECTS:")
    print(projects)

    # Step 2: Keyword matching
    keyword_result = match_keywords(
        resume_text,
        job_description
    )

    # Step 2.5: Semantic similarity
    semantic_score = semantic_similarity(
    resume_text,
    job_description
    )

    # Step 3: ATS score
    ats_score = calculate_ats_score(
    sections,
    keyword_result,
    semantic_score
   )

    # Step 4: Feedback generation
    feedback = generate_feedback(
        sections,
        keyword_result,
        ats_score
    )

    return {

    "ats_score": float(ats_score),

    "semantic_score": float(semantic_score),

    "sections_found":
        list(sections.keys()),

    "matched_keywords":
        keyword_result["matched_keywords"],

    "missing_keywords":
        keyword_result["missing_keywords"],

    "feedback":
        feedback,

    "projects":
        projects
}