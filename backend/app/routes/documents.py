import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.documents import Document
from app.routes.auth import get_current_user

router = APIRouter(prefix="/documents", tags=["Documents"])

UPLOAD_DIR = "uploads"

@router.post("/upload")
def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: int = Depends(get_current_user)
):
    
    # Validate file type
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF's Allowed")
    

    # generate unique filename (prevents overwrite)
    unique_name = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, unique_name)

    # read file once
    file_content = file.file.read()
    file_size = len(file_content) # for future use (like size cannot be more than 5mb)

    with open(file_path, "wb") as buffer:
        buffer.write(file_content)

    new_doc = Document(
        filename = file.filename,
        filepath = file_path,
        owner_id = current_user
    )

    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)

    return {"message": "File uploaded successfully"}


@router.get("/my-documents")
def get_my_documents(
    db: Session = Depends(get_db),
    current_user: int = Depends(get_current_user)
):
    documents = (
        db.query(Document)
        .filter(Document.owner_id == current_user)
        .order_by(Document.created_at.desc())
        .all()
    )

    return [
        {
            "id": document.id,
            "filename": document.filename,
            "filepath": document.filepath,
            "created-at": document.created_at
        }
        for document in documents
    ]


@router.delete("/{document_id}")
def delete_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: int = Depends(get_current_user)
):
    document = db.query(Document).filter(Document.id == document_id).first()

    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    if document.owner_id != current_user:
        raise HTTPException(status_code=403, detail="Not authorized to delete this document")
    
    # delete from storage
    if os.path.exists(document.filepath):
        os.remove(document.filepath)


    db.delete(document)
    db.commit()

    return {"message": "Document deleted successfully"}