def generate_feedback(sections, keyword_result, ats_score):
    feedback = []

    # Missing sections
    important_sections = [
        "education",
        "skills",
        "projects",
        "experience"
    ]

    for section in important_sections:
        if (
            section not in sections
            or not sections[section].strip()
        ):
            feedback.append(
                f"Add a strong {section} section."
            )

    # Keyword suggestions
    missing_keywords = keyword_result.get(
        "missing_keywords",
        []
    )

    if missing_keywords:
        feedback.append(
            "Include missing keywords: "
            + ", ".join(missing_keywords[:5])
        )

    # ATS score analysis
    if ats_score < 50:
        feedback.append(
            "Your resume needs major improvements for ATS systems."
        )

    elif ats_score < 75:
        feedback.append(
            "Your resume is moderately ATS optimized."
        )

    else:
        feedback.append(
            "Your resume is well optimized for ATS screening."
        )

    return feedback