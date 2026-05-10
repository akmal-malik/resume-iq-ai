import re

SECTION_HEADERS = {
    "skills": [
        "skills",
        "technical skills",
        "core competencies"
    ],
    "education": [
        "education",
        "academic background",
        "qualification"
    ],
    "experience": [
        "experience",
        "work experience",
        "employment"
    ],
    "projects": [
        "projects",
        "personal projects",
        "academic projects"
    ],
    "certifications": [
        "certifications",
        "licenses"
    ]
}


def extract_sections(text):
    text = text.lower()

    sections = {}
    current_section = "other"

    lines = text.split("\n")

    for line in lines:
        clean_line = line.strip()

        matched = False

        for section, keywords in SECTION_HEADERS.items():
            if clean_line in keywords:
                current_section = section
                sections[current_section] = []
                matched = True
                break

        if not matched:
            sections.setdefault(
                current_section,
                []
            ).append(clean_line)

    for key in sections:
        sections[key] = "\n".join(
            sections[key]
        ).strip()

    sections = {
        key: value
        for key, value in sections.items()
        if value.strip()
    }

    return sections