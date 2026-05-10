import re


TECH_KEYWORDS = [

    "react",
    "javascript",
    "typescript",
    "python",
    "fastapi",
    "flask",
    "django",
    "node",
    "express",
    "mongodb",
    "postgresql",
    "mysql",
    "firebase",
    "tailwind",
    "docker",
    "aws",
    "azure",
    "html",
    "css",
    "java",
    "c++",
    "tableau",
    "power bi",
    "machine learning",
    "tensorflow",
    "pandas",
    "numpy",
    "sql",
    "git"
]


PROJECT_SECTION_KEYWORDS = [

    "project",
    "projects",
    "personal projects",
    "academic projects",
    "key projects",
    "project experience",
    "project work"
]


STOP_SECTIONS = [

    "education",
    "experience",
    "skills",
    "technical skills",
    "certification",
    "certifications",
    "achievements",
    "languages",
    "interests",
    "summary"
]


IGNORE_STARTS = [

    "implemented",
    "developed",
    "built",
    "created",
    "designed",
    "integrated",
    "enabled",
    "ensured",
    "improved",
    "conducted",
    "used",
    "architected",
    "led"
]


BAD_PROJECT_WORDS = [

    "certificate",
    "certificates",
    "coursera",
    "nptel",
    "cgpa",
    "github",
    "linkedin",
    "skills",
    "education",
    "achievements",
    "bachelor",
    "university",
    "school"
]


def clean_project_title(text):

    text = re.sub(
        r"^[•\-\*\+]+\s*",
        "",
        text
    )

    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text.strip()


def extract_tech_stack(text):

    text = text.lower()

    found = []

    for tech in TECH_KEYWORDS:

        if tech in text:

            found.append(tech)

    return list(set(found))


def is_bad_project(text):

    lower_text = text.lower()

    for word in BAD_PROJECT_WORDS:

        if word in lower_text:
            return True

    return False


def is_valid_project_title(line):

    lower_line = line.lower()

    if is_bad_project(line):
        return False

    if line.startswith("Tech:"):
        return False

    if len(line.split()) > 16:
        return False

    for word in IGNORE_STARTS:

        if lower_line.startswith(word):
            return False

    return True


def extract_projects(resume_text):

    projects = []

    lines = resume_text.split("\n")

    capture = False

    current_project = None

    for line in lines:

        clean_line = line.strip()

        lower_line = clean_line.lower()

        # START PROJECT SECTION

        if any(

            keyword in lower_line

            for keyword in
            PROJECT_SECTION_KEYWORDS
        ):

            capture = True
            continue

        # STOP PROJECT SECTION

        if capture and any(

            stop == lower_line

            or stop in lower_line

            for stop in
            STOP_SECTIONS
        ):

            break

        if not capture:
            continue

        if len(clean_line) < 4:
            continue

        clean_line = clean_project_title(
            clean_line
        )

        # SKIP BAD LINES

        if is_bad_project(clean_line):
            continue

        # PROJECT TITLE DETECTION

        is_project = (

    "|" in clean_line

    or

    (
        is_valid_project_title(
            clean_line
        )

        and

        not clean_line.endswith(".")

        and

        not lower_line.startswith(
            (
                "website:",
                "github:",
                "tech:",
                "link:",
                "http",
                "www"
            )
        )
    )
)

        # CREATE NEW PROJECT

        if is_project:

            # SAVE PREVIOUS PROJECT

            if current_project:

                projects.append(
                    current_project
                )

            # REMOVE DATE PARTS

            project_name = re.sub(

                r"(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec).*",

                "",

                clean_line
            ).strip()

            tech_found = extract_tech_stack(
                clean_line
            )

            current_project = {

                "name":
                    project_name,

                "tech":
                    tech_found
            }

        else:

            # EXTRACT TECH FROM DESC

            if current_project:

             desc_tech = extract_tech_stack(
            clean_line
             )

            for tech in desc_tech:

             if (

                tech not in
                current_project["tech"]
                ):

                current_project[
                    "tech"
                ].append(tech)

    # FINAL PUSH

    if current_project:

        projects.append(
            current_project
        )

    # REMOVE DUPLICATES

    unique_projects = []

    seen = set()

    for project in projects:

        name = project["name"].lower()

        if name not in seen:

            seen.add(name)

            unique_projects.append(
                project
            )

    return unique_projects