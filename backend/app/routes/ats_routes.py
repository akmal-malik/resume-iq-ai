from fastapi import APIRouter
from pydantic import BaseModel

from app.services.ats_engine import analyze_resume

router = APIRouter()


class ATSRequest(BaseModel):
    resume_text: str
    job_description: str


@router.post("/analyze-resume")
def analyze(data: ATSRequest):

    result = analyze_resume(
        data.resume_text,
        data.job_description
    )

    return result