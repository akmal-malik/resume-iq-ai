import os
import shutil
import json

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    Depends
)

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.models.analysis import Analysis

from app.services.file_parser import (
    extract_text_from_pdf,
    extract_text_from_docx
)

from app.services.ats_engine import (
    analyze_resume
)

router = APIRouter()

UPLOAD_FOLDER = "uploads"

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)


# =========================================
# UPLOAD + ANALYZE
# =========================================

@router.post("/upload-and-analyze")
async def upload_and_analyze(

    db: Session = Depends(get_db),

    file: UploadFile = File(...),

    job_description: str = Form(...)
):

    # SAVE FILE

    file_path = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    with open(file_path, "wb") as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    # EXTRACT TEXT

    extracted_text = ""

    if file.filename.endswith(".pdf"):

        extracted_text = (
            extract_text_from_pdf(
                file_path
            )
        )

    elif file.filename.endswith(".docx"):

        extracted_text = (
            extract_text_from_docx(
                file_path
            )
        )

    else:

        return {
            "error":
            "Only PDF and DOCX supported"
        }

    # RUN ATS ENGINE

    result = analyze_resume(
        extracted_text,
        job_description
    )

    # SAVE ANALYSIS

    analysis = Analysis(

    filename=file.filename,

    ats_score=result["ats_score"],

    matched_keywords=", ".join(
        result["matched_keywords"]
    ),

    missing_keywords=", ".join(
        result["missing_keywords"]
    ),

    feedback=", ".join(
        result["feedback"]
    ),

    # NEW DATA

    job_description=
        job_description,

    resume_text=
        extracted_text,

    extracted_projects=json.dumps(
    result["projects"]
    )
)

    db.add(analysis)

    db.commit()

    db.refresh(analysis)

    # RETURN RESULT

    return {

    "id": analysis.id,

    "filename": analysis.filename,

    "ats_score": result["ats_score"],

    "semantic_score":
        result["semantic_score"],

    "matched_keywords":
        result["matched_keywords"],

    "missing_keywords":
        result["missing_keywords"],

    "feedback":
        result["feedback"],

    "projects":
        result["projects"],

    "sections_found":
        result["sections_found"]
}


# =========================================
# ANALYSIS HISTORY
# =========================================

@router.get("/analysis-history")
def get_analysis_history(

    db: Session = Depends(get_db)

):

    analyses = db.query(
        Analysis
    ).order_by(
        Analysis.created_at.desc()
    ).all()

    results = []

    for item in analyses:

        results.append({

            "id": item.id,

            "filename": item.filename,

            "ats_score": item.ats_score,

            "matched_keywords":
                item.matched_keywords,

            "missing_keywords":
                item.missing_keywords,

            "feedback":
                item.feedback,

            "created_at":
                item.created_at
        })

    return results


# =========================================
# SINGLE ANALYSIS DETAILS
# =========================================

@router.get("/analysis/{analysis_id}")
def get_analysis_by_id(

    analysis_id: int,

    db: Session = Depends(get_db)

):

    analysis = db.query(
        Analysis
    ).filter(
        Analysis.id == analysis_id
    ).first()

    if not analysis:

        return {
            "error":
            "Analysis not found"
        }

    return {

    "id":
        analysis.id,

    "filename":
        analysis.filename,

    # FRONTEND EXPECTED FORMAT

    "score":
        analysis.ats_score,

    "addedSkills":

        analysis.matched_keywords.split(",")

        if analysis.matched_keywords
        else [],

    "missingSkills":

        analysis.missing_keywords.split(",")

        if analysis.missing_keywords
        else [],

    "jobDescription":
        analysis.job_description,

    "aiSuggestions":

        analysis.feedback.split(",")

        if analysis.feedback
        else [],

    "projects":
        analysis.extracted_projects,

    # OPTIONAL EXTRA DATA

    "resumeText":
        analysis.resume_text,

    "createdAt":
        analysis.created_at
}
# =========================================
# DASHBOARD STATS
# =========================================

@router.get("/dashboard-stats")
def get_dashboard_stats(

    db: Session = Depends(get_db) 

):

    analyses = db.query(
        Analysis
    ).all()

    total_analyses = len(analyses)

    if total_analyses == 0:

        return {

            "total_analyses": 0,

            "average_score": 0,

            "highest_score": 0,

            "lowest_score": 0
        }

    scores = [
        item.ats_score
        for item in analyses
    ]

    average_score = round(
        sum(scores) / len(scores),
        2
    )

    highest_score = max(scores)

    lowest_score = min(scores)

    return {

        "total_analyses":
            total_analyses,

        "average_score":
            average_score,

        "highest_score":
            highest_score,

        "lowest_score":
            lowest_score
    }
# =========================================
# SCORE TREND DATA
# =========================================

@router.get("/score-trends")
def get_score_trends(

    db: Session = Depends(get_db)

):

    analyses = db.query(
        Analysis
    ).order_by(
        Analysis.created_at.asc()
    ).all()

    results = []

    for item in analyses:

        results.append({

            "id":
        item.id,

    "filename":
        item.filename,

    "score":
        item.ats_score
        })

    return results
# =========================================
# RECENT ANALYSES
# =========================================

@router.get("/recent-analyses")
def get_recent_analyses(

    db: Session = Depends(get_db)

):

    analyses = db.query(
        Analysis
    ).order_by(
        Analysis.created_at.desc()
    ).limit(5).all()

    results = []

    for item in analyses:

        results.append({

            "filename":
                item.filename,

            "score":
                item.ats_score,

            "created_at":
                item.created_at
        })

    return results

# =========================================
# KEYWORD ANALYTICS
# =========================================

@router.get("/keyword-analytics")
def get_keyword_analytics(

    db: Session = Depends(get_db)

):

    analyses = db.query(
        Analysis
    ).all()

    matched_counts = {}

    missing_counts = {}

    for item in analyses:

        # MATCHED KEYWORDS

        matched_keywords = (
            item.matched_keywords.split(",")
            if item.matched_keywords
            else []
        )

        for keyword in matched_keywords:

            keyword = keyword.strip()

            if keyword:

                matched_counts[keyword] = (
                    matched_counts.get(keyword, 0)
                    + 1
                )

        # MISSING KEYWORDS

        missing_keywords = (
            item.missing_keywords.split(",")
            if item.missing_keywords
            else []
        )

        for keyword in missing_keywords:

            keyword = keyword.strip()

            if keyword:

                missing_counts[keyword] = (
                    missing_counts.get(keyword, 0)
                    + 1
                )

    # SORT RESULTS

    top_matched = sorted(

        matched_counts.items(),

        key=lambda x: x[1],

        reverse=True

    )[:5]

    top_missing = sorted(

        missing_counts.items(),

        key=lambda x: x[1],

        reverse=True

    )[:5]

    return {

        "top_matched":
            top_matched,

        "top_missing":
            top_missing
    }

# =========================================
# AI INSIGHTS
# =========================================

@router.get("/ai-insights")
def get_ai_insights(

    db: Session = Depends(get_db)

):

    analyses = db.query(
        Analysis
    ).all()

    insights = []

    if not analyses:

        return {
            "insights": []
        }

    # AVERAGE SCORE

    scores = [
        item.ats_score
        for item in analyses
    ]

    average_score = round(
        sum(scores) / len(scores),
        2
    )

    insights.append(
        f"Average ATS score across all resumes is {average_score}."
    )

    # BEST RESUME

    highest = max(
        analyses,
        key=lambda x: x.ats_score
    )

    insights.append(
        f'Highest ATS score achieved is {highest.ats_score} in "{highest.filename}".'
    )

    # MOST COMMON MISSING SKILL

    missing_counts = {}

    for item in analyses:

        missing_keywords = (
            item.missing_keywords.split(",")
            if item.missing_keywords
            else []
        )

        for keyword in missing_keywords:

            keyword = keyword.strip()

            if keyword:

                missing_counts[keyword] = (
                    missing_counts.get(keyword, 0)
                    + 1
                )

    if missing_counts:

        top_missing = max(
            missing_counts,
            key=missing_counts.get
        )

        insights.append(
            f'"{top_missing}" is the most frequently missing skill.'
        )

    # MOST COMMON MATCHED SKILL

    matched_counts = {}

    for item in analyses:

        matched_keywords = (
            item.matched_keywords.split(",")
            if item.matched_keywords
            else []
        )

        for keyword in matched_keywords:

            keyword = keyword.strip()

            if keyword:

                matched_counts[keyword] = (
                    matched_counts.get(keyword, 0)
                    + 1
                )

    if matched_counts:

        top_matched = max(
            matched_counts,
            key=matched_counts.get
        )

        insights.append(
            f'"{top_matched}" appears most often in successful resumes.'
        )

    return {

        "insights":
            insights
    }