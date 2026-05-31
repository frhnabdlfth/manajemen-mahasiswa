import re
from datetime import datetime, timedelta

import mysql.connector
from fastapi import APIRouter, Depends, HTTPException

from app.core.config import VERIFICATION_CODE_EXPIRE_SECONDS
from app.core.exceptions import ValidationException
from app.core.security import (
    create_access_token,
    get_current_admin,
    hash_password,
    verify_password,
)
from app.database.connection import get_connection
from app.repositories.admin_repository import get_admin_by_email, get_admin_by_username
from app.schemas.auth import (
    ChangePasswordRequest,
    LoginRequest,
    RegisterRequest,
    ResendVerificationRequest,
    VerifyEmailRequest,
)
from app.utils.email import send_verification_email
from app.utils.validators import validate_email, validate_name, validate_password, validate_username
from app.utils.verification import generate_verification_code

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login")
def login(data: LoginRequest):
    try:
        email = data.email.strip().lower()

        if not email:
            raise HTTPException(status_code=400, detail="Email wajib diisi.")

        validate_email(email)

        if not data.password:
            raise HTTPException(status_code=400, detail="Password wajib diisi.")

        admin = get_admin_by_email(email)

        if not admin:
            raise HTTPException(
                status_code=401,
                detail="Email tidak ditemukan. Silakan registrasi dulu."
            )

        if not verify_password(data.password, admin["password_hash"]):
            raise HTTPException(status_code=401, detail="Password salah.")

        if admin["email_verified"] != 1:
            raise HTTPException(
                status_code=403,
                detail="Email belum diverifikasi. Silakan cek Gmail kamu."
            )

        token = create_access_token({
            "sub": admin["email"],
            "role": admin["role"],
        })

        return {
            "message": "Login berhasil.",
            "token": token,
            "user": {
                "id": admin["id"],
                "username": admin["username"],
                "email": admin["email"],
                "nama": admin["nama"],
                "role": admin["role"],
            }
        }

    except ValidationException as error:
        raise HTTPException(status_code=400, detail=str(error))
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.post("/register")
def register(data: RegisterRequest):
    try:
        username = data.username.strip()
        email = data.email.strip().lower()
        nama = data.nama.strip()

        validate_username(username)
        validate_email(email)
        validate_name(nama)
        validate_password(data.password)

        if data.password != data.confirm_password:
            raise ValidationException("Konfirmasi password tidak sama.")

        existing_username = get_admin_by_username(username)
        if existing_username:
            raise HTTPException(status_code=409, detail="Username sudah digunakan.")

        existing_email = get_admin_by_email(email)
        if existing_email:
            raise HTTPException(status_code=409, detail="Email sudah digunakan.")

        code = generate_verification_code()
        expired_at = datetime.utcnow() + timedelta(seconds=VERIFICATION_CODE_EXPIRE_SECONDS)
        password_hash = hash_password(data.password)

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO admin_users
            (username, email, password_hash, nama, role, email_verified, verification_code, verification_expired_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                username,
                email,
                password_hash,
                nama,
                "Admin",
                0,
                code,
                expired_at,
            ),
        )

        conn.commit()
        cursor.close()
        conn.close()

        send_verification_email(email, code)

        return {
            "message": "Registrasi berhasil. Silakan cek Gmail kamu untuk kode verifikasi.",
            "email": email,
            "expires_in": VERIFICATION_CODE_EXPIRE_SECONDS,
        }

    except ValidationException as error:
        raise HTTPException(status_code=400, detail=str(error))
    except HTTPException:
        raise
    except mysql.connector.IntegrityError:
        raise HTTPException(status_code=409, detail="Username atau email sudah digunakan.")
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))

@router.post("/seed-admin")
def seed_admin_user():
    """Create one default verified admin user for development/login testing."""
    try:
        username = "admin"
        email = "admin@gmail.com"
        nama = "Admin Default"
        password = "Admin@12345"
        password_hash = hash_password(password)

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT id, username, email, nama, role, email_verified
            FROM admin_users
            WHERE username = %s OR email = %s
            LIMIT 1
            """,
            (username, email),
        )

        existing_admin = cursor.fetchone()

        if existing_admin:
            cursor.close()
            conn.close()

            return {
                "message": "Admin default sudah tersedia. Silakan login.",
                "user": {
                    "id": existing_admin["id"],
                    "username": existing_admin["username"],
                    "email": existing_admin["email"],
                    "nama": existing_admin["nama"],
                    "role": existing_admin["role"],
                    "email_verified": existing_admin["email_verified"],
                },
                "login": {
                    "email": email,
                    "password": password,
                },
            }

        cursor.execute(
            """
            INSERT INTO admin_users
            (username, email, password_hash, nama, role, email_verified, verification_code, verification_expired_at)
            VALUES (%s, %s, %s, %s, %s, %s, NULL, NULL)
            """,
            (
                username,
                email,
                password_hash,
                nama,
                "Admin",
                1,
            ),
        )

        conn.commit()
        admin_id = cursor.lastrowid

        cursor.close()
        conn.close()

        return {
            "message": "Seed admin default berhasil dibuat. Silakan login.",
            "user": {
                "id": admin_id,
                "username": username,
                "email": email,
                "nama": nama,
                "role": "Admin",
                "email_verified": 1,
            },
            "login": {
                "email": email,
                "password": password,
            },
        }

    except mysql.connector.IntegrityError:
        raise HTTPException(status_code=409, detail="Admin default sudah tersedia.")
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))

@router.post("/verify-email")
def verify_email(data: VerifyEmailRequest):
    try:
        email = data.email.strip().lower()
        code = data.code.strip()

        validate_email(email)

        if not re.match(r"^[0-9]{6}$", code):
            raise ValidationException("Kode verifikasi harus 6 digit angka.")

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT id, email, verification_code, verification_expired_at, email_verified
            FROM admin_users
            WHERE email = %s
            """,
            (email,),
        )

        admin = cursor.fetchone()

        if not admin:
            raise HTTPException(status_code=404, detail="Email tidak ditemukan.")

        if admin["email_verified"] == 1:
            return {"message": "Email sudah terverifikasi. Silakan login."}

        if admin["verification_code"] != code:
            raise HTTPException(status_code=400, detail="Kode verifikasi salah.")

        expired_at = admin["verification_expired_at"]

        if expired_at and datetime.utcnow() > expired_at:
            raise HTTPException(status_code=400, detail="Kode verifikasi sudah expired.")

        cursor.execute(
            """
            UPDATE admin_users
            SET email_verified = 1,
                verification_code = NULL,
                verification_expired_at = NULL
            WHERE id = %s
            """,
            (admin["id"],),
        )

        conn.commit()
        cursor.close()
        conn.close()

        return {"message": "Email berhasil diverifikasi. Silakan login."}

    except ValidationException as error:
        raise HTTPException(status_code=400, detail=str(error))
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.post("/resend-verification")
def resend_verification(data: ResendVerificationRequest):
    try:
        email = data.email.strip().lower()
        validate_email(email)

        admin = get_admin_by_email(email)

        if not admin:
            raise HTTPException(status_code=404, detail="Email tidak ditemukan.")

        if admin["email_verified"] == 1:
            return {
                "message": "Email sudah terverifikasi. Silakan login.",
                "email": email,
                "expires_in": 0,
            }

        code = generate_verification_code()
        expired_at = datetime.utcnow() + timedelta(
            seconds=VERIFICATION_CODE_EXPIRE_SECONDS
        )

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            UPDATE admin_users
            SET verification_code = %s,
                verification_expired_at = %s
            WHERE email = %s
            """,
            (code, expired_at, email),
        )

        conn.commit()
        cursor.close()
        conn.close()

        send_verification_email(email, code)

        return {
            "message": "Kode verifikasi baru sudah dikirim ke email.",
            "email": email,
            "expires_in": VERIFICATION_CODE_EXPIRE_SECONDS,
        }

    except ValidationException as error:
        raise HTTPException(status_code=400, detail=str(error))
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.get("/me")
def auth_me(current_admin: dict = Depends(get_current_admin)):
    return {"user": current_admin}


@router.put("/change-password")
def change_password(
    data: ChangePasswordRequest,
    current_admin: dict = Depends(get_current_admin),
):
    try:
        old_password = data.old_password.strip()
        new_password = data.new_password.strip()
        confirm_new_password = data.confirm_new_password.strip()

        if not old_password:
            raise ValidationException("Password lama wajib diisi.")

        if not new_password:
            raise ValidationException("Password baru wajib diisi.")

        if new_password != confirm_new_password:
            raise ValidationException("Konfirmasi password baru tidak sama.")

        if old_password == new_password:
            raise ValidationException(
                "Password baru tidak boleh sama dengan password lama."
            )

        validate_password(new_password)

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT id, password_hash
            FROM admin_users
            WHERE id = %s
            """,
            (current_admin["id"],),
        )

        admin = cursor.fetchone()

        if not admin:
            raise HTTPException(status_code=404, detail="Admin tidak ditemukan.")

        if not verify_password(old_password, admin["password_hash"]):
            raise HTTPException(status_code=400, detail="Password lama salah.")

        new_password_hash = hash_password(new_password)

        cursor.execute(
            """
            UPDATE admin_users
            SET password_hash = %s
            WHERE id = %s
            """,
            (new_password_hash, current_admin["id"]),
        )

        conn.commit()
        cursor.close()
        conn.close()

        return {
            "message": "Password berhasil diubah. Silakan gunakan password baru saat login berikutnya."
        }

    except ValidationException as error:
        raise HTTPException(status_code=400, detail=str(error))
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))
