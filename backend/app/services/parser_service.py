import pdfplumber
from docx import Document

def extract_text_from_pdf(file_path):

    text = ""

    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            extracted = page.extract_text()

            if extracted:
                text += extracted

    return text

def extract_text_from_docx(file_path):

    doc = Document(file_path)

    text = "\n".join(
        [para.text for para in doc.paragraphs]
    )

    return text