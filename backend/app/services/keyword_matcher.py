TECH_SKILLS = [

    "python",
    "java",
    "javascript",
    "react",
    "node",
    "express",
    "sql",
    "mysql",
    "postgresql",
    "mongodb",
    "fastapi",
    "django",
    "flask",
    "html",
    "css",
    "tailwind",
    "docker",
    "kubernetes",
    "aws",
    "azure",
    "git",
    "github",
    "tableau",
    "power bi",
    "excel",
    "machine learning",
    "data analysis",
    "api",
    "rest",
    "firebase",
    "typescript",
    "c++",
    "c",
    "javafx"
]


def match_keywords(

    resume_text,
    job_description

):

    resume_text = (
        resume_text.lower()
    )

    job_description = (
        job_description.lower()
    )

    matched_keywords = []

    missing_keywords = []

    # CHECK ONLY TECH SKILLS

    for skill in TECH_SKILLS:

        # SKILL EXISTS IN JD

        if skill in job_description:

            # SKILL EXISTS IN RESUME

            if skill in resume_text:

                matched_keywords.append(
                    skill
                )

            else:

                missing_keywords.append(
                    skill
                )

    # MATCH SCORE

    total_keywords = (
        len(matched_keywords)
        +
        len(missing_keywords)
    )

    match_score = 0

    if total_keywords > 0:

        match_score = round(

            (
                len(matched_keywords)
                /
                total_keywords
            ) * 100,

            2
        )

    return {

        "match_score":
            match_score,

        "matched_keywords":
            matched_keywords,

        "missing_keywords":
            missing_keywords
    }