import pandas as pd
import os

# ROOT DIRECTORY
BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.dirname(
            os.path.dirname(
                os.path.dirname(os.path.abspath(__file__))
            )
        )
    )
)

# LOAD CLEANED DATASET
dataset_path = os.path.join(
    BASE_DIR,
    "datasets",
    "processed",
    "cleaned_resumes.csv"
)

df = pd.read_csv(dataset_path)

# LOAD SKILLS
skills_path = os.path.join(
    BASE_DIR,
    "datasets",
    "skills",
    "tech_skills.txt"
)

with open(skills_path, "r") as file:
    skills_list = [skill.strip().lower() for skill in file.readlines()]

# SKILL EXTRACTION FUNCTION
def extract_skills(text):
    text = str(text).lower()

    found_skills = []

    for skill in skills_list:
        if skill in text:
            found_skills.append(skill)

    return list(set(found_skills))

# APPLY EXTRACTION
df["Extracted_Skills"] = df["Skills"].apply(extract_skills)

# SHOW RESULTS
print("\nExtracted Skills Sample:\n")

print(df[["Skills", "Extracted_Skills"]].head())

# SAVE
output_path = os.path.join(
    BASE_DIR,
    "datasets",
    "processed",
    "skills_extracted.csv"
)

df.to_csv(output_path, index=False)

print("\nSkill extraction completed.")