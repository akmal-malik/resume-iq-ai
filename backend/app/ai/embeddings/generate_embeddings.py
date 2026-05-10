import pandas as pd
import os
import numpy as np

from sentence_transformers import SentenceTransformer

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

# CREATE TEXT FOR EMBEDDINGS
df["combined_text"] = (
    df["Skills"].astype(str)
    + " "
    + df["Target_Job_Description"].astype(str)
)

# GENERATE EMBEDDINGS
embeddings = model.encode(
    df["combined_text"].tolist(),
    show_progress_bar=True
)

print("\nEmbedding Shape:")
print(embeddings.shape)

# SAVE EMBEDDINGS
output_path = os.path.join(
    BASE_DIR,
    "datasets",
    "embeddings",
    "resume_embeddings.npy"
)

os.makedirs(
    os.path.dirname(output_path),
    exist_ok=True
)

np.save(output_path, embeddings)

print("\nEmbeddings generated successfully.")