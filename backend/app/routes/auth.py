from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.users import User
from app.core.security import hash_password, verify_password
from app.core.jwt_handler import create_access_token
from fastapi import Depends, APIRouter
from app.core.dependencies import get_current_user
from app.schemas.schemas import LoginRequest, RegisterUser


router = APIRouter(prefix="/auth", tags=["Auth"])


@router.get("/protected")
def protected_route(user_id: int = Depends(get_current_user)):
    return {"message": f"Hello User {user_id}"}


@router.post("/register")
def register(data: RegisterUser, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = hash_password(data.password)

    new_user = User(
        name = data.name,
        email = data.email,
        password = hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully"}


@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    
    user = db.query(User).filter(User.email == data.email).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid Email")
    
    if not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid Password")
    
    token = create_access_token(
        data={"sub": str(user.id)}
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }