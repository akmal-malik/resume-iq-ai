import os

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException
)

from app.services.parser_service import (
    extract_text_from_pdf,
    extract_text_from_docx
)

router = APIRouter()

UPLOAD_DIR = "uploads"

@router.post("/upload-resume")
async def upload_resume(
    file: UploadFile = File(...)
):

    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    extracted_text = ""

    if file.filename.endswith(".pdf"):
        extracted_text = extract_text_from_pdf(
            file_path
        )

    elif file.filename.endswith(".docx"):
        extracted_text = extract_text_from_docx(
            file_path
        )

    else:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file format"
        )

    return {
        "filename": file.filename,
        "extracted_text": extracted_text[:1000]
    }