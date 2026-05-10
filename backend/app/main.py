from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import engine, Base

from app.models.user import User
from app.models.resume import Resume

from app.routes.auth import router as auth_router
from app.routes.resume import router as resume_router

from app.routes.ats_routes import router as ats_router

from app.routes.upload_routes import (
    router as upload_router
)

from app.models.analysis import Analysis

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI()

# Register routes
app.include_router(auth_router)
app.include_router(resume_router)
app.include_router(ats_router)
app.include_router(upload_router)

# Allowed frontend origins
origins = ["*"]

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root route
@app.get("/")
def root():
    return {
        "message": "ResumeIQ AI Backend Running"
    }