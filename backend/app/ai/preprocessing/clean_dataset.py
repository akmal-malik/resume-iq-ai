import pandas as pd
import re
import nltk
import spacy
import os

from nltk.corpus import stopwords

nltk.download("stopwords")

# Load spaCy
nlp = spacy.load("en_core_web_sm")

# ROOT PROJECT DIRECTORY
BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.dirname(
            os.path.dirname(
                os.path.dirname(os.path.abspath(__file__))
            )
        )
    )
)

# CSV PATH
csv_path = os.path.join(
    BASE_DIR,
    "datasets",
    "raw",
    "resume_dataset.csv"
)

# LOAD DATASET
df = pd.read_csv(csv_path)

print("Dataset Shape:", df.shape)

# Remove duplicates
df = df.drop_duplicates()

# Fill missing values
df = df.fillna("")

# Text cleaning function
def clean_text(text):
    text = str(text).lower()

    text = re.sub(r"http\\S+", "", text)

    text = re.sub(r"[^a-zA-Z0-9 ]", " ", text)

    text = re.sub(r"\\s+", " ", text).strip()

    return text

# Apply cleaning
df["Skills"] = df["Skills"].apply(clean_text)
df["Target_Job_Description"] = df["Target_Job_Description"].apply(clean_text)

print("\\nCleaned Sample:")
print(df[["Skills", "Target_Job_Description"]].head())

# SAVE CLEANED DATASET
processed_path = os.path.join(
    BASE_DIR,
    "datasets",
    "processed",
    "cleaned_resumes.csv"
)

df.to_csv(processed_path, index=False)

print("\\nDataset cleaned and saved successfully.")