from pydantic import BaseModel
from pydantic import EmailStr

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RegisterUser(BaseModel):
    name: str
    email: EmailStr
    password: str