import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("APP_SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("APP_SECRET_KEY belum diset di file .env")

ALGORITHM = os.getenv("APP_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

SMTP_HOST = os.getenv("SMTP_HOST", "").strip()
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "").strip()
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "").strip()
SMTP_FROM_ADDRESS = os.getenv("SMTP_FROM_ADDRESS", SMTP_USER).strip()
SMTP_FROM_NAME = os.getenv("SMTP_FROM_NAME", "Manajemen Mahasiswa").strip()
SMTP_USE_SSL = os.getenv("SMTP_USE_SSL", "false").lower() == "true"

VERIFICATION_CODE_EXPIRE_SECONDS = 60

DB_CONFIG = {
    "host": os.getenv("DB_HOST"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "database": os.getenv("DB_NAME"),
}

DATA_FILE = os.getenv("DATA_FILE")

CORS_ALLOWED_ORIGINS = [
    "https://manajemenmahasiswa.my.id",
    "http://localhost:5173",
]
