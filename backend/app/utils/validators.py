import re

from app.core.exceptions import ValidationException
from app.schemas.mahasiswa import MahasiswaRequest


def validate_username(username: str):
    pattern = r"^[a-zA-Z0-9_]{4,20}$"

    if not re.match(pattern, username):
        raise ValidationException(
            "Username harus 4-20 karakter dan hanya boleh huruf, angka, underscore."
        )


def validate_password(password: str):
    if len(password) < 8:
        raise ValidationException("Password minimal 8 karakter.")

    if not re.search(r"[A-Z]", password):
        raise ValidationException("Password harus mengandung minimal 1 huruf besar.")

    if not re.search(r"[a-z]", password):
        raise ValidationException("Password harus mengandung minimal 1 huruf kecil.")

    if not re.search(r"[0-9]", password):
        raise ValidationException("Password harus mengandung minimal 1 angka.")

    if not re.search(r"[^A-Za-z0-9]", password):
        raise ValidationException("Password harus mengandung minimal 1 simbol.")


def validate_email(email: str):
    pattern = r"^[\w\.]+@[\w\.-]+\."

    if not re.match(pattern, email):
        raise ValidationException("Format email tidak valid.")


def validate_name(nama: str):
    pattern = r"^[A-Za-z\s.'-]{3,100}$"

    if not re.match(pattern, nama):
        raise ValidationException("Nama hanya boleh huruf, spasi, titik.")


def validate_mahasiswa(data: MahasiswaRequest):
    nim_pattern = r"^[0-9]{11}$"
    nama_pattern = r"^[A-Za-z\s.'-]{3,100}$"
    email_pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"
    jurusan_pattern = r"^[A-Za-z\s]{2,100}$"

    if not re.match(nim_pattern, data.nim):
        raise ValidationException("NIM harus angka dan panjang 11 digit.")

    if not re.match(nama_pattern, data.nama):
        raise ValidationException("Nama hanya boleh huruf, spasi, titik.")

    if not re.match(email_pattern, data.email):
        raise ValidationException("Format email tidak valid.")

    if not re.match(jurusan_pattern, data.jurusan):
        raise ValidationException("Jurusan hanya boleh huruf dan spasi.")

    if data.angkatan < 1990 or data.angkatan > 2100:
        raise ValidationException("Angkatan tidak valid.")

    if data.tipe not in ["Reguler", "Beasiswa"]:
        raise ValidationException("Tipe mahasiswa hanya boleh Reguler atau Beasiswa.")
