from database import Base
from sqlalchemy.sql import func
from sqlalchemy import Column, String, Integer, ForeignKey, Float, DateTime

class Signature(Base):
    __tablename__ = "signatures"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"))
    user_id = Column(Integer, ForeignKey("users.id"))


    x = Column(Float)
    y= Column(Float)
    page = Column(Integer)

    status = Column(String, default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
