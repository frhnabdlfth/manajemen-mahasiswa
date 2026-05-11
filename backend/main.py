from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from email.message import EmailMessage
from fastapi import Depends, Header
from dotenv import load_dotenv

import re
import json
import os
import random
import smtplib
import mysql.connector

load_dotenv()

# =========================
# CONFIG AUTH
# =========================
SECRET_KEY = os.getenv("APP_SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("APP_SECRET_KEY belum diset di file .env")

ALGORITHM = os.getenv("APP_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

GMAIL_USER = os.getenv("GMAIL_USER", "").strip()
GMAIL_APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD", "").replace(" ", "").strip()

password_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

# =========================
# CONFIG DATABASE
# =========================
DB_CONFIG = {
    "host": os.getenv("DB_HOST"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "database": os.getenv("DB_NAME"),
}

DATA_FILE = os.getenv("DATA_FILE")

# =========================
# CUSTOM EXCEPTION
# =========================
class ValidationException(Exception):
    pass

class DatabaseException(Exception):
    pass

# =========================
# OOP MODEL
# =========================
class Mahasiswa:
    def __init__(self, nim, nama, email, jurusan, angkatan, tipe="Reguler", id=None):
        self.__id = id
        self.__nim = nim
        self.__nama = nama
        self.__email = email
        self.__jurusan = jurusan
        self.__angkatan = angkatan
        self.__tipe = tipe

    # Encapsulation via getter
    def get_id(self):
        return self.__id

    def get_nim(self):
        return self.__nim

    def get_nama(self):
        return self.__nama

    def get_email(self):
        return self.__email

    def get_jurusan(self):
        return self.__jurusan

    def get_angkatan(self):
        return self.__angkatan

    def get_tipe(self):
        return self.__tipe

    # Polymorphism method
    def deskripsi(self):
        return f"{self.__nama} adalah mahasiswa {self.__tipe}"

    def to_dict(self):
        return {
            "id": self.__id,
            "nim": self.__nim,
            "nama": self.__nama,
            "email": self.__email,
            "jurusan": self.__jurusan,
            "angkatan": self.__angkatan,
            "tipe": self.__tipe,
        }


class MahasiswaReguler(Mahasiswa):
    def __init__(self, nim, nama, email, jurusan, angkatan, id=None):
        super().__init__(nim, nama, email, jurusan, angkatan, "Reguler", id)

    def deskripsi(self):
        return f"{self.get_nama()} adalah mahasiswa reguler aktif."


class MahasiswaBeasiswa(Mahasiswa):
    def __init__(self, nim, nama, email, jurusan, angkatan, id=None):
        super().__init__(nim, nama, email, jurusan, angkatan, "Beasiswa", id)

    def deskripsi(self):
        return f"{self.get_nama()} adalah mahasiswa penerima beasiswa."


# =========================
# POINTER / LINKED LIST DEMO
# =========================
class Node:
    def __init__(self, mahasiswa):
        self.mahasiswa = mahasiswa
        self.next = None

class MahasiswaLinkedList:
    def __init__(self):
        self.head = None

    def insert(self, mahasiswa):
        new_node = Node(mahasiswa)

        if self.head is None:
            self.head = new_node
            return

        current = self.head

        while current.next is not None:
            current = current.next

        current.next = new_node

    def to_array(self):
        result = []
        current = self.head

        while current is not None:
            result.append(current.mahasiswa.to_dict())
            current = current.next

        return result

# =========================
# REQUEST SCHEMA DATABASE
# =========================
class MahasiswaRequest(BaseModel):
    nim: str
    nama: str
    email: str
    jurusan: str
    angkatan: int
    tipe: Optional[str] = "Reguler"

# ===========================
# DATABASE HELPER CONNECTION
# ===========================
def get_connection():
    try:
        return mysql.connector.connect(**DB_CONFIG)
    except Exception as error:
        raise DatabaseException(f"Gagal koneksi database: {error}")

# =========================
# REQUEST SCHEMA LOGIN & REGISTER
# =========================
class LoginRequest(BaseModel):
    username: str
    password: str
    nama: Optional[str] = None
    role: Optional[str] = "Admin"

class RegisterRequest(BaseModel):
    username: str
    email: str
    nama: str
    password: str
    confirm_password: str


class VerifyEmailRequest(BaseModel):
    email: str
    code: str

# ===========================
# LOGIN, REGISTER, VALIDATION, EMAIL VERIFICATION & AUTH HELPERS
# ===========================

def hash_password(password: str):
    return password_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return password_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    payload = data.copy()

    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload.update({"exp": expire})

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def get_admin_by_username(username: str):
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT id, username, email, password_hash, nama, role, email_verified
            FROM admin_users
            WHERE username = %s
            """,
            (username,),
        )

        admin = cursor.fetchone()

        cursor.close()
        conn.close()

        return admin

    except Exception as error:
        raise DatabaseException(str(error))


def get_admin_by_email(email: str):
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT id, username, email, password_hash, nama, role, email_verified
            FROM admin_users
            WHERE email = %s
            """,
            (email,),
        )

        admin = cursor.fetchone()

        cursor.close()
        conn.close()

        return admin

    except Exception as error:
        raise DatabaseException(str(error))

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
    
def validate_username(username: str):
    pattern = r"^[a-zA-Z0-9_]{4,20}$"

    if not re.match(pattern, username):
        raise ValidationException(
            "Username harus 4-20 karakter dan hanya boleh huruf, angka, underscore."
        )

def validate_password(password: str):
    if len(password) < 8:
        raise ValidationException("Password minimal 8 karakter.")

    if len(password) > 72:
        raise ValidationException("Password maksimal 72 karakter.")

    if not re.search(r"[A-Z]", password):
        raise ValidationException("Password harus mengandung minimal 1 huruf besar.")

    if not re.search(r"[a-z]", password):
        raise ValidationException("Password harus mengandung minimal 1 huruf kecil.")

    if not re.search(r"[0-9]", password):
        raise ValidationException("Password harus mengandung minimal 1 angka.")


def validate_email(email: str):
    pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"

    if not re.match(pattern, email):
        raise ValidationException("Format email tidak valid.")


def validate_name(nama: str):
    pattern = r"^[A-Za-z\s.'-]{3,100}$"

    if not re.match(pattern, nama):
        raise ValidationException("Nama hanya boleh huruf, spasi, titik, petik, atau strip.")

def generate_verification_code():
    return str(random.randint(100000, 999999))


def send_verification_email(to_email: str, code: str):
    if not GMAIL_USER or not GMAIL_APP_PASSWORD:
        raise ValidationException(
            "Konfigurasi Gmail belum tersedia. Set GMAIL_USER dan GMAIL_APP_PASSWORD."
        )

    message = EmailMessage()
    message["Subject"] = "Kode Verifikasi Akun Manajemen Mahasiswa"
    message["From"] = GMAIL_USER
    message["To"] = to_email

    # Fallback plain text jika email client tidak support HTML
    message.set_content(
        f"""
        Halo,

        Kode verifikasi akun kamu adalah:

        {code}

        Kode ini berlaku selama 10 menit.
        Jika kamu tidak merasa melakukan registrasi, abaikan email ini.

        Terima kasih.
        """
    )

    html_content = f"""
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Kode Verifikasi</title>
    </head>
    <body style="margin:0; padding:0; background:#FFF7D6; font-family:Arial, Helvetica, sans-serif; color:#111827;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF7D6; padding:32px 16px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background:#ffffff; border:4px solid #000000; border-radius:28px; box-shadow:10px 10px 0 #000000; overflow:hidden;">
              
              <tr>
                <td style="background:#FFDE59; border-bottom:4px solid #000000; padding:28px;">
                  <div style="display:inline-block; background:#4ADE80; border:4px solid #000000; border-radius:18px; padding:12px 16px; font-weight:900; box-shadow:5px 5px 0 #000000;">
                    🎓 Manajemen Mahasiswa
                  </div>

                  <h1 style="margin:24px 0 8px; font-size:32px; line-height:1.05; font-weight:900; color:#111827;">
                    Verifikasi Email Kamu
                  </h1>

                  <p style="margin:0; font-size:15px; line-height:1.6; font-weight:700; color:#111827;">
                    Gunakan kode di bawah ini untuk menyelesaikan proses registrasi akun admin.
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding:28px;">
                  <p style="margin:0 0 18px; font-size:16px; line-height:1.6; font-weight:700;">
                    Halo 👋
                  </p>

                  <p style="margin:0 0 22px; font-size:15px; line-height:1.7; color:#374151;">
                    Terima kasih sudah melakukan registrasi. Masukkan kode verifikasi berikut pada halaman verifikasi email.
                  </p>

                  <div style="background:#C4B5FD; border:4px solid #000000; border-radius:22px; padding:22px; text-align:center; box-shadow:6px 6px 0 #000000; margin:24px 0;">
                    <p style="margin:0 0 10px; font-size:12px; font-weight:900; letter-spacing:1.5px; text-transform:uppercase;">
                      Kode Verifikasi
                    </p>

                    <div style="display:inline-block; background:#ffffff; border:4px solid #000000; border-radius:18px; padding:14px 24px; font-size:36px; font-weight:900; letter-spacing:8px; color:#111827; box-shadow:5px 5px 0 #000000;">
                      {code}
                    </div>
                  </div>

                  <div style="background:#FFDE59; border:4px solid #000000; border-radius:20px; padding:16px; box-shadow:5px 5px 0 #000000;">
                    <p style="margin:0; font-size:14px; line-height:1.6; font-weight:800;">
                      ⚠️ Kode ini berlaku selama 10 menit.
                    </p>
                  </div>

                  <p style="margin:24px 0 0; font-size:14px; line-height:1.7; color:#4B5563;">
                    Kalau kamu tidak merasa melakukan registrasi akun, abaikan email ini. Jangan berikan kode ini kepada siapa pun.
                  </p>
                </td>
              </tr>

              <tr>
                <td style="background:#111827; padding:20px 28px; border-top:4px solid #000000;">
                  <p style="margin:0; font-size:13px; line-height:1.6; color:#ffffff; font-weight:700;">
                    Email otomatis dari sistem Manajemen Data Mahasiswa.
                  </p>
                  <p style="margin:6px 0 0; font-size:12px; color:#D1D5DB;">
                    Jangan membalas email ini.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    """

    message.add_alternative(html_content, subtype="html")

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(GMAIL_USER, GMAIL_APP_PASSWORD)
            smtp.send_message(message)

    except Exception as error:
        raise ValidationException(f"Gagal mengirim email verifikasi: {error}")

# =========================
# REGEX VALIDATION
# =========================
def validate_mahasiswa(data: MahasiswaRequest):
    nim_pattern = r"^[0-9]{6,20}$"
    nama_pattern = r"^[A-Za-z\s.'-]{3,100}$"
    email_pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"
    jurusan_pattern = r"^[A-Za-z\s]{2,100}$"

    if not re.match(nim_pattern, data.nim):
        raise ValidationException("NIM harus angka dan panjang 6-20 digit.")

    if not re.match(nama_pattern, data.nama):
        raise ValidationException("Nama hanya boleh huruf, spasi, titik, petik, atau strip.")

    if not re.match(email_pattern, data.email):
        raise ValidationException("Format email tidak valid.")

    if not re.match(jurusan_pattern, data.jurusan):
        raise ValidationException("Jurusan hanya boleh huruf dan spasi.")

    if data.angkatan < 1990 or data.angkatan > 2100:
        raise ValidationException("Angkatan tidak valid.")

    if data.tipe not in ["Reguler", "Beasiswa"]:
        raise ValidationException("Tipe mahasiswa hanya boleh Reguler atau Beasiswa.")


def create_mahasiswa_object(row):
    id, nim, nama, email, jurusan, angkatan, tipe = row

    if tipe == "Beasiswa":
        return MahasiswaBeasiswa(nim, nama, email, jurusan, angkatan, id)

    return MahasiswaReguler(nim, nama, email, jurusan, angkatan, id)


# =========================
# ARRAY / LIST DATA
# =========================
def get_all_mahasiswa_array():
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            "SELECT id, nim, nama, email, jurusan, angkatan, tipe FROM mahasiswa"
        )

        rows = cursor.fetchall()

        mahasiswa_array = []

        for row in rows:
            obj = create_mahasiswa_object(row)
            mahasiswa_array.append(obj.to_dict())

        cursor.close()
        conn.close()

        return mahasiswa_array

    except Exception as error:
        raise DatabaseException(str(error))


# =========================
# SEARCH
# =========================
def linear_search(data, keyword):
    keyword = keyword.lower()

    for item in data:
        if (
            keyword in item["nim"].lower()
            or keyword in item["nama"].lower()
            or keyword in item["jurusan"].lower()
        ):
            return item

    return None

def sequential_search(data, keyword):
    result = []
    keyword = keyword.lower()

    for item in data:
        if (
            keyword in item["nim"].lower()
            or keyword in item["nama"].lower()
            or keyword in item["email"].lower()
            or keyword in item["jurusan"].lower()
        ):
            result.append(item)

    return result

def binary_search_by_nim(data, target_nim):
    sorted_data = sorted(data, key=lambda item: item["nim"])

    left = 0
    right = len(sorted_data) - 1

    while left <= right:
        mid = (left + right) // 2

        if sorted_data[mid]["nim"] == target_nim:
            return sorted_data[mid]
        elif sorted_data[mid]["nim"] < target_nim:
            left = mid + 1
        else:
            right = mid - 1

    return None

# =========================
# SORTING
# =========================
def bubble_sort(data, key="nama"):
    arr = data.copy()
    n = len(arr)

    for i in range(n):
        for j in range(0, n - i - 1):
            if str(arr[j][key]).lower() > str(arr[j + 1][key]).lower():
                arr[j], arr[j + 1] = arr[j + 1], arr[j]

    return arr

def insertion_sort(data, key="nama"):
    arr = data.copy()

    for i in range(1, len(arr)):
        current = arr[i]
        j = i - 1

        while j >= 0 and str(arr[j][key]).lower() > str(current[key]).lower():
            arr[j + 1] = arr[j]
            j -= 1

        arr[j + 1] = current

    return arr

def selection_sort(data, key="nama"):
    arr = data.copy()

    for i in range(len(arr)):
        min_index = i

        for j in range(i + 1, len(arr)):
            if str(arr[j][key]).lower() < str(arr[min_index][key]).lower():
                min_index = j

        arr[i], arr[min_index] = arr[min_index], arr[i]

    return arr

def merge_sort(data, key="nama"):
    if len(data) <= 1:
        return data

    mid = len(data) // 2
    left = merge_sort(data[:mid], key)
    right = merge_sort(data[mid:], key)

    return merge(left, right, key)

def merge(left, right, key):
    result = []
    i = 0
    j = 0

    while i < len(left) and j < len(right):
        if str(left[i][key]).lower() <= str(right[j][key]).lower():
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    result.extend(left[i:])
    result.extend(right[j:])

    return result

def shell_sort(data, key="nama"):
    arr = data.copy()
    gap = len(arr) // 2

    while gap > 0:
        for i in range(gap, len(arr)):
            temp = arr[i]
            j = i

            while j >= gap and str(arr[j - gap][key]).lower() > str(temp[key]).lower():
                arr[j] = arr[j - gap]
                j -= gap

            arr[j] = temp

        gap //= 2

    return arr

def sort_data(data, algorithm, key):
    if algorithm == "bubble":
        return bubble_sort(data, key)
    if algorithm == "insertion":
        return insertion_sort(data, key)
    if algorithm == "selection":
        return selection_sort(data, key)
    if algorithm == "merge":
        return merge_sort(data, key)
    if algorithm == "shell":
        return shell_sort(data, key)

    raise ValidationException("Algoritma sort tidak valid.")

# =========================
# FASTAPI
# =========================
app = FastAPI(title="API Manajemen Data Mahasiswa")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# LOGIN & AUTH ROUTES
# =========================
@app.post("/auth/login")
def login(data: LoginRequest):
    try:
        username = data.username.strip()

        if not username:
            raise HTTPException(status_code=400, detail="Username wajib diisi.")

        if not data.password:
            raise HTTPException(status_code=400, detail="Password wajib diisi.")

        admin = get_admin_by_username(username)

        if not admin:
            raise HTTPException(status_code=401, detail="Username tidak ditemukan. Silahkan Registrasi dulu cuy.")

        if not verify_password(data.password, admin["password_hash"]):
            raise HTTPException(status_code=401, detail="Password salah.")

        if admin["email_verified"] != 1:
            raise HTTPException(
                status_code=403,
                detail="Email belum diverifikasi. Silakan cek Gmail kamu."
            )
    
        token = create_access_token({
            "sub": admin["username"],
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

    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))

@app.post("/auth/register")
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
        expired_at = datetime.utcnow() + timedelta(minutes=10)
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
        }

    except ValidationException as error:
        raise HTTPException(status_code=400, detail=str(error))
    except HTTPException:
        raise
    except mysql.connector.IntegrityError:
        raise HTTPException(status_code=409, detail="Username atau email sudah digunakan.")
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))

@app.post("/auth/verify-email")
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
            return {
                "message": "Email sudah terverifikasi. Silakan login."
            }

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

        return {
            "message": "Email berhasil diverifikasi. Silakan login."
        }

    except ValidationException as error:
        raise HTTPException(status_code=400, detail=str(error))
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))

@app.post("/auth/resend-verification")
def resend_verification(email: str):
    try:
        email = email.strip().lower()
        validate_email(email)

        admin = get_admin_by_email(email)

        if not admin:
            raise HTTPException(status_code=404, detail="Email tidak ditemukan.")

        if admin["email_verified"] == 1:
            return {
                "message": "Email sudah terverifikasi. Silakan login."
            }

        code = generate_verification_code()
        expired_at = datetime.utcnow() + timedelta(minutes=10)

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

        email_sent = True
        email_error = None

        try:
            send_verification_email(email, code)
        except ValidationException as error:
            email_sent = False
            email_error = str(error)

        response = {
            "message": "Registrasi berhasil.",
            "email": email,
            "email_sent": email_sent,
        }

        if email_sent:
            response["message"] = "Registrasi berhasil. Silakan cek Gmail kamu untuk kode verifikasi."
        else:
            response["message"] = "Registrasi berhasil, tapi email verifikasi gagal dikirim. Gunakan kode verifikasi dari database untuk mode development."
            response["email_error"] = email_error

        return response

    except ValidationException as error:
        raise HTTPException(status_code=400, detail=str(error))
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))

@app.get("/auth/me")
def auth_me(current_admin: dict = Depends(get_current_admin)):
    return {
        "user": current_admin
    }

# =========================
# ROUTES CRUD MAHASISWA
# =========================
@app.post("/mahasiswa/seed-dummy")
def seed_dummy_mahasiswa():
    try:
        dummy_data = [
            ("202401001", "Budi Santoso", "budi.santoso@email.com", "Teknik Informatika", 2024, "Reguler"),
            ("202401002", "Siti Aminah", "siti.aminah@email.com", "Sistem Informasi", 2024, "Beasiswa"),
            ("202401003", "Andi Wijaya", "andi.wijaya@email.com", "Teknik Komputer", 2024, "Reguler"),
            ("202401004", "Rina Marlina", "rina.marlina@email.com", "Manajemen Informatika", 2024, "Reguler"),
            ("202401005", "Dewi Lestari", "dewi.lestari@email.com", "Teknik Informatika", 2024, "Beasiswa"),

            ("202301001", "Ahmad Fauzi", "ahmad.fauzi@email.com", "Sistem Informasi", 2023, "Reguler"),
            ("202301002", "Nadia Putri", "nadia.putri@email.com", "Teknik Informatika", 2023, "Beasiswa"),
            ("202301003", "Rizky Pratama", "rizky.pratama@email.com", "Teknik Komputer", 2023, "Reguler"),
            ("202301004", "Maya Sari", "maya.sari@email.com", "Manajemen Informatika", 2023, "Reguler"),
            ("202301005", "Fajar Nugroho", "fajar.nugroho@email.com", "Sistem Informasi", 2023, "Beasiswa"),

            ("202201001", "Putri Anggraini", "putri.anggraini@email.com", "Teknik Informatika", 2022, "Reguler"),
            ("202201002", "Dimas Saputra", "dimas.saputra@email.com", "Teknik Komputer", 2022, "Reguler"),
            ("202201003", "Laila Rahma", "laila.rahma@email.com", "Sistem Informasi", 2022, "Beasiswa"),
            ("202201004", "Yoga Permana", "yoga.permana@email.com", "Manajemen Informatika", 2022, "Reguler"),
            ("202201005", "Indah Prameswari", "indah.prameswari@email.com", "Teknik Informatika", 2022, "Beasiswa"),

            ("202101001", "Bagas Maulana", "bagas.maulana@email.com", "Sistem Informasi", 2021, "Reguler"),
            ("202101002", "Citra Amelia", "citra.amelia@email.com", "Teknik Informatika", 2021, "Reguler"),
            ("202101003", "Reza Ramadhan", "reza.ramadhan@email.com", "Teknik Komputer", 2021, "Beasiswa"),
            ("202101004", "Anisa Wulandari", "anisa.wulandari@email.com", "Manajemen Informatika", 2021, "Reguler"),
            ("202101005", "Gilang Mahendra", "gilang.mahendra@email.com", "Sistem Informasi", 2021, "Beasiswa"),
        ]

        conn = get_connection()
        cursor = conn.cursor()

        sql = """
            INSERT IGNORE INTO mahasiswa
            (nim, nama, email, jurusan, angkatan, tipe)
            VALUES (%s, %s, %s, %s, %s, %s)
        """

        cursor.executemany(sql, dummy_data)
        conn.commit()

        total_inserted = cursor.rowcount

        cursor.close()
        conn.close()

        return {
            "message": "Seed data dummy mahasiswa berhasil.",
            "total_inserted": total_inserted,
            "total_dummy": len(dummy_data),
        }

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))
    
@app.get("/")
def root():
    return {
        "message": "Backend Manajemen Data Mahasiswa"
    }

@app.get("/mahasiswa")
def get_mahasiswa(
    sort_by: str = Query(default="nama"),
    algorithm: str = Query(default="merge"),
    current_admin: dict = Depends(get_current_admin)
):
    try:
        data = get_all_mahasiswa_array()

        allowed_keys = ["id", "nim", "nama", "email", "jurusan", "angkatan", "tipe"]

        if sort_by not in allowed_keys:
            raise ValidationException("Field sort tidak valid.")

        sorted_data = sort_data(data, algorithm, sort_by)

        return {
            "data": sorted_data,
            "total": len(sorted_data),
            "sort_algorithm": algorithm,
            "sort_by": sort_by,
            "current_admin": current_admin,
        }

    except ValidationException as error:
        raise HTTPException(status_code=400, detail=str(error))
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@app.post("/mahasiswa")
def create_mahasiswa(
    data: MahasiswaRequest,
    current_admin: dict = Depends(get_current_admin)
):
    try:
        validate_mahasiswa(data)

        conn = get_connection()
        cursor = conn.cursor()

        sql = """
            INSERT INTO mahasiswa (nim, nama, email, jurusan, angkatan, tipe)
            VALUES (%s, %s, %s, %s, %s, %s)
        """

        cursor.execute(
            sql,
            (
                data.nim,
                data.nama,
                data.email,
                data.jurusan,
                data.angkatan,
                data.tipe,
            ),
        )

        conn.commit()

        cursor.close()
        conn.close()

        return {
            "message": "Data mahasiswa berhasil ditambahkan."
        }

    except mysql.connector.IntegrityError:
        raise HTTPException(status_code=409, detail="NIM sudah terdaftar.")
    except ValidationException as error:
        raise HTTPException(status_code=400, detail=str(error))
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@app.put("/mahasiswa/{mahasiswa_id}")
def update_mahasiswa(
    mahasiswa_id: int,
    data: MahasiswaRequest,
    current_admin: dict = Depends(get_current_admin)
):
    conn = None
    cursor = None

    try:
        validate_mahasiswa(data)

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        # Cek dulu apakah data mahasiswa ada
        cursor.execute(
            "SELECT id FROM mahasiswa WHERE id = %s",
            (mahasiswa_id,),
        )

        existing = cursor.fetchone()

        if not existing:
            raise HTTPException(
                status_code=404,
                detail="Data mahasiswa tidak ditemukan."
            )

        sql = """
            UPDATE mahasiswa
            SET nim=%s,
                nama=%s,
                email=%s,
                jurusan=%s,
                angkatan=%s,
                tipe=%s
            WHERE id=%s
        """

        cursor.execute(
            sql,
            (
                data.nim,
                data.nama,
                data.email,
                data.jurusan,
                data.angkatan,
                data.tipe,
                mahasiswa_id,
            ),
        )

        conn.commit()

        return {
            "message": "Data mahasiswa berhasil diperbarui."
        }

    except ValidationException as error:
        raise HTTPException(status_code=400, detail=str(error))

    except mysql.connector.IntegrityError:
        raise HTTPException(status_code=409, detail="NIM sudah digunakan.")

    except HTTPException:
        raise

    except Exception as error:
        if conn:
            conn.rollback()

        raise HTTPException(status_code=500, detail=str(error))

    finally:
        if cursor:
            cursor.close()

        if conn:
            conn.close()

@app.delete("/mahasiswa/{mahasiswa_id}")
def delete_mahasiswa(
    mahasiswa_id: int,
    current_admin: dict = Depends(get_current_admin)
):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("DELETE FROM mahasiswa WHERE id=%s", (mahasiswa_id,))
        conn.commit()

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Data mahasiswa tidak ditemukan.")

        cursor.close()
        conn.close()

        return {
            "message": "Data mahasiswa berhasil dihapus."
        }

    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


# =========================
# SEARCH ROUTES
# =========================
@app.get("/mahasiswa/search/linear")
def api_linear_search(keyword: str, current_admin: dict = Depends(get_current_admin)):
    data = get_all_mahasiswa_array()
    result = linear_search(data, keyword)

    return {
        "algorithm": "Linear Search",
        "result": result,
        "complexity": "O(n)",
    }

@app.get("/mahasiswa/search/sequential")
def api_sequential_search(keyword: str, current_admin: dict = Depends(get_current_admin)):
    data = get_all_mahasiswa_array()
    result = sequential_search(data, keyword)

    return {
        "algorithm": "Sequential Search",
        "result": result,
        "total": len(result),
        "complexity": "O(n)",
    }

@app.get("/mahasiswa/search/binary")
def api_binary_search(nim: str, current_admin: dict = Depends(get_current_admin)):
    data = get_all_mahasiswa_array()
    result = binary_search_by_nim(data, nim)

    return {
        "algorithm": "Binary Search",
        "result": result,
        "complexity": "O(log n), setelah data diurutkan berdasarkan NIM",
    }

# =========================
# FILE I/O ROUTES
# =========================
@app.get("/file/export")
def export_to_file(current_admin: dict = Depends(get_current_admin)):
    try:
        data = get_all_mahasiswa_array()

        with open(DATA_FILE, "w", encoding="utf-8") as file:
            json.dump(data, file, indent=4, ensure_ascii=False)

        return {
            "message": f"Data berhasil disimpan ke file {DATA_FILE}.",
            "total": len(data),
        }

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@app.get("/file/read")
def read_from_file(current_admin: dict = Depends(get_current_admin)):
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as file:
            data = json.load(file)

        return {
            "message": f"Data berhasil dibaca dari file {DATA_FILE}.",
            "data": data,
            "total": len(data),
        }

    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="File data belum tersedia.")
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))

# =========================
# POINTER ROUTE
# =========================
@app.get("/mahasiswa/linked-list")
def linked_list_demo():
    data = get_all_mahasiswa_array()

    linked_list = MahasiswaLinkedList()

    for item in data:
        mahasiswa = Mahasiswa(
            item["nim"],
            item["nama"],
            item["email"],
            item["jurusan"],
            item["angkatan"],
            item["tipe"],
            item["id"],
        )
        linked_list.insert(mahasiswa)

    return {
        "message": "Data dikonversi ke linked list menggunakan object reference seperti pointer.",
        "data": linked_list.to_array(),
    }

# =========================
# COMPLEXITY ROUTE
# =========================
@app.get("/complexity")
def complexity():
    return {
        "create": "O(1) untuk insert database, tergantung index database.",
        "read_all": "O(n), membaca semua data mahasiswa.",
        "update": "O(1) rata-rata jika berdasarkan primary key.",
        "delete": "O(1) rata-rata jika berdasarkan primary key.",
        "linear_search": "O(n).",
        "sequential_search": "O(n).",
        "binary_search": "O(log n) setelah data terurut.",
        "bubble_sort": "O(n^2).",
        "insertion_sort": "O(n^2), best case O(n).",
        "selection_sort": "O(n^2).",
        "merge_sort": "O(n log n).",
        "shell_sort": "Rata-rata sekitar O(n log n), worst case tergantung gap.",
        "file_export": "O(n).",
        "file_read": "O(n).",
    }