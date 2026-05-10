from sqlalchemy import Column, Integer, String, ForeignKey
from app.core.database import Base

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)

    filename = Column(String)

    extracted_text = Column(String)

    user_id = Column(Integer, ForeignKey("users.id"))