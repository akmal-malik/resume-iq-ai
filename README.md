# ResumeIQ AI — AI-Powered ATS Resume Analyzer

ResumeIQ AI is a full-stack AI-powered Applicant Tracking System (ATS) resume analysis platform designed to evaluate resumes against job descriptions using semantic NLP and hybrid scoring techniques.

The platform allows users to upload PDF/DOCX resumes and receive:

* ATS Scores
* Semantic Matching Scores
* Matched & Missing Keywords
* AI-Generated Feedback
* Extracted Projects
* Resume Analytics & Insights

ResumeIQ AI combines transformer-based semantic similarity, keyword matching, and section analysis to simulate production-style ATS systems used in modern recruitment workflows.

---

# Features

## AI-Powered ATS Scoring

* Hybrid ATS scoring engine
* Semantic similarity matching
* Keyword-based analysis
* Section-based scoring system

## Resume Parsing

* PDF Resume Parsing
* DOCX Resume Parsing
* Automatic text extraction
* Resume section detection

## Semantic NLP Matching

* Transformer embeddings using SentenceTransformers
* Cosine similarity-based resume-job matching
* Semantic keyword understanding

## Skill & Project Extraction

* Technical skill extraction
* Missing keyword detection
* Resume project extraction
* ATS optimization insights

## Analytics Dashboard APIs

* Score trends
* Keyword analytics
* Resume analysis history
* AI insights APIs

---

# Tech Stack

## Frontend

* React
* Tailwind CSS
* JavaScript
* Vite

## Backend

* FastAPI
* Python
* SQLAlchemy
* REST APIs

## Database

* PostgreSQL

## AI / NLP

* SentenceTransformers
* Transformer Embeddings
* Cosine Similarity
* Semantic NLP Matching

---

# Architecture

```txt
Resume Upload
      ↓
Resume Parsing
      ↓
Section Extraction
      ↓
Keyword Matching
      ↓
Semantic NLP Matching
      ↓
Hybrid ATS Scoring
      ↓
Feedback Generation
      ↓
Analytics & Dashboard APIs
```

---

# ATS Scoring Logic

ResumeIQ AI uses a hybrid scoring engine combining:

| Component                | Description                           |
| ------------------------ | ------------------------------------- |
| Semantic Matching        | Transformer-based similarity scoring  |
| Keyword Matching         | JD vs Resume keyword comparison       |
| Section Analysis         | Education, Skills, Experience scoring |
| Missing Skills Detection | Identifies missing ATS keywords       |

---

# Current Features Implemented

* Resume Upload & Parsing
* PDF/DOCX Support
* Semantic Resume Matching
* Hybrid ATS Scoring
* AI Feedback Generation
* Project Extraction
* Keyword Analytics APIs
* Resume Analysis History
* Dashboard Statistics APIs
* PostgreSQL Integration
* FastAPI Backend APIs

---

# API Endpoints

## Authentication

```http
POST /signup
POST /login
```

## Resume Analysis

```http
POST /upload-resume
POST /analyze-resume
POST /upload-and-analyze
```

## Analytics

```http
GET /analysis-history
GET /analysis/{analysis_id}
GET /dashboard-stats
GET /score-trends
GET /recent-analyses
GET /keyword-analytics
GET /ai-insights
```

---

# Example API Response

```json
{
  "ats_score": 58.84,
  "semantic_score": 52.11,
  "matched_keywords": [
    "python",
    "sql",
    "tableau"
  ],
  "missing_keywords": [
    "power bi",
    "machine learning"
  ],
  "feedback": [
    "Include missing keywords: power bi, machine learning"
  ]
}
```

---

# Folder Structure

```txt
resumeiq-ai/
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── models/
│   │   ├── schemas/
│   │   └── ai/
│   │
│   └── uploads/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── routes/
│
├── public/
├── README.md
└── package.json
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/akmal-malik/resume-iq-ai.git
```

---

# Backend Setup

```bash
cd backend

python -m venv venv

source venv/bin/activate

pip install -r requirements.txt
```

Run backend:

```bash
uvicorn app.main:app --reload
```

Backend URL:

```txt
http://127.0.0.1:8000
```

Swagger Docs:

```txt
http://127.0.0.1:8000/docs
```

---

# Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend URL:

```txt
http://localhost:5173
```

---

# Future Improvements

* Fine-tuned ATS ML Model
* FAISS Vector Search
* Resume Ranking System
* Recruiter Dashboard
* AI Resume Recommendations
* Real-Time Resume Optimization
* Cloud Deployment
* JWT Authentication Enhancements
* Advanced Semantic Retrieval

---

# Project Goals

ResumeIQ AI aims to bridge the gap between traditional ATS systems and modern AI-driven semantic matching by providing:

* Better resume optimization
* Smarter job matching
* AI-powered recruitment workflows
* Improved candidate evaluation systems

---

# Author

Mohammad Akmal Salim Malik

GitHub: [https://github.com/akmal-malik](https://github.com/akmal-malik)

LinkedIn: [https://linkedin.com/in/akmalmalik/](https://linkedin.com/in/akmalmalik/)
