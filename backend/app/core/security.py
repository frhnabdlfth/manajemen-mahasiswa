from datetime import datetime, timedelta

from fastapi import Header, HTTPException
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import ACCESS_TOKEN_EXPIRE_MINUTES, ALGORITHM, SECRET_KEY
from app.repositories.admin_repository import get_admin_by_email, get_admin_by_username

password_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


def hash_password(password: str):
    return password_context.hash(password)


def verify_password(plain_password: str, hashed_password: str):
    return password_context.verify(plain_password, hashed_password)


def create_access_token(data: dict):
    payload = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload.update({"exp": expire})

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def get_current_admin(authorization: str = Header(default=None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token tidak ditemukan.")

    try:
        scheme, token = authorization.split(" ")

        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Format token tidak valid.")

        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")

        if not username:
            raise HTTPException(status_code=401, detail="Token tidak valid.")

        admin = get_admin_by_username(username) or get_admin_by_email(username)

        if not admin:
            raise HTTPException(status_code=401, detail="Admin tidak ditemukan.")

        return {
            "id": admin["id"],
            "username": admin["username"],
            "nama": admin["nama"],
            "role": admin["role"],
        }

    except ValueError:
        raise HTTPException(status_code=401, detail="Format authorization tidak valid.")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token tidak valid atau expired.")
