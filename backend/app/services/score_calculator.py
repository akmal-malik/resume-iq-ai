def calculate_ats_score(
    sections,
    keyword_result,
    semantic_score
):

    # -----------------------------
    # SECTION SCORE
    # -----------------------------
    section_score = 0

    important_sections = [
        "education",
        "skills",
        "projects",
        "experience"
    ]

    for section in important_sections:

        if (
            section in sections
            and sections[section].strip()
        ):

            section_score += 15

    # MAX SECTION SCORE = 60
    # -----------------------------

    # -----------------------------
    # KEYWORD MATCH SCORE
    # -----------------------------
    keyword_score = keyword_result.get(
        "match_score",
        0
    )

    # -----------------------------
    # HYBRID FINAL SCORE
    # -----------------------------
    final_score = (

        # SECTION QUALITY
        section_score * 0.3

        +

        # KEYWORD MATCHING
        keyword_score * 0.3

        +

        # SEMANTIC AI MATCHING
        semantic_score * 0.4
    )

    # SAFETY CAP
    final_score = min(
        round(final_score, 2),
        100
    )

    return final_score