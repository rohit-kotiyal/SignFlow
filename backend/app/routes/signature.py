from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.signature import Signature
from app.routes.auth import get_current_user


router = APIRouter(prefix="/signature", tags=["signature"])


@router.post("/")
def create_signature(
    signature: Signature,
    db: Session = Depends(get_db),
    current_user: int = Depends(get_current_user)
):
    new_signature = Signature(
        document_id = signature.document_id,
        user_id = signature.user_id,
        x = signature.x,
        y = signature.y,
        page = signature.page
    )

    db.add(new_signature)
    db.commit()
    db.refresh(new_signature)

    return new_signature
