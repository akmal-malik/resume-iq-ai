from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy import DateTime

from datetime import datetime

from app.core.database import Base


class Analysis(Base):

    __tablename__ = "analyses"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    filename = Column(
        String
    )

    ats_score = Column(
        Integer
    )

    matched_keywords = Column(
        Text
    )

    missing_keywords = Column(
        Text
    )

    feedback = Column(
        Text
    )

    # NEW FIELDS

    job_description = Column(
        Text
    )

    resume_text = Column(
        Text
    )

    extracted_projects = Column(
        Text
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )