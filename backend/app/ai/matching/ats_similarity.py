import pandas as pd
import numpy as np
import os

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# LOAD MODEL
model = SentenceTransformer("all-MiniLM-L6-v2")

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

# LOAD DATASET
dataset_path = os.path.join(
    BASE_DIR,
    "datasets",
    "processed",
    "skills_extracted.csv"
)

df = pd.read_csv(dataset_path)

# SAMPLE RESUME
resume_text = """
Python SQL Tableau Power BI Machine Learning
Data Analysis Pandas NumPy FastAPI
"""

# SAMPLE JOB DESCRIPTION
job_description = """
Looking for a Data Analyst with strong skills in
Python, SQL, Tableau, Power BI, statistics,
data visualization, and machine learning.
"""

# GENERATE EMBEDDINGS
resume_embedding = model.encode([resume_text])

jd_embedding = model.encode([job_description])

# COSINE SIMILARITY
score = cosine_similarity(
    resume_embedding,
    jd_embedding
)[0][0]

# CONVERT TO PERCENTAGE
ats_score = round(score * 100, 2)

print("\nATS Match Score:")
print(f"{ats_score}%")