from sentence_transformers import (
    SentenceTransformer
)

from sklearn.metrics.pairwise import (
    cosine_similarity
)

# LOAD MODEL
model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

# -----------------------------
# SEMANTIC MATCH FUNCTION
# -----------------------------
def semantic_similarity(
    resume_text,
    job_description
):

    resume_embedding = model.encode(
        [resume_text]
    )

    jd_embedding = model.encode(
        [job_description]
    )

    similarity = cosine_similarity(
        resume_embedding,
        jd_embedding
    )[0][0]

    return round(similarity * 100, 2)