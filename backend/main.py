from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mysql.connector
from typing import List, Optional
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, Header

import re
import json

# =========================
# CONFIG AUTH
# =========================
SECRET_KEY = "4ASFSAF-ASF87278BJJKASF-21KJBJASF"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 1

password_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

# =========================
# CONFIG DATABASE
# =========================
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "manajemen_mahasiswa",
}

DATA_FILE = "mahasiswa_data.json"

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
# REQUEST SCHEMA LOGIN
# =========================
class LoginRequest(BaseModel):
    username: str
    password: str
    nama: Optional[str] = None
    role: Optional[str] = "Admin"

# ===========================
# LOGIN & AUTH HELPERS
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
            SELECT id, username, password_hash, nama, role
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

        admin = get_admin_by_username(username)

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
@app.post("/auth/seed-admin")
def seed_admin():
    try:
        existing = get_admin_by_username("admin")

        if existing:
            return {
                "message": "Admin default sudah tersedia.",
                "username": "admin",
            }

        conn = get_connection()
        cursor = conn.cursor()

        password_hash = hash_password("admin123")

        cursor.execute(
            """
            INSERT INTO admin_users (username, password_hash, nama, role)
            VALUES (%s, %s, %s, %s)
            """,
            ("admin", password_hash, "Admin Mahasiswa", "admin"),
        )

        conn.commit()

        cursor.close()
        conn.close()

        return {
            "message": "Admin default berhasil dibuat.",
            "username": "admin",
            "password": "admin123",
        }

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


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
            raise HTTPException(status_code=401, detail="Username atau password salah.")

        if not verify_password(data.password, admin["password_hash"]):
            raise HTTPException(status_code=401, detail="Username atau password salah.")

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
                "nama": admin["nama"],
                "role": admin["role"],
            },
        }

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
    try:
        validate_mahasiswa(data)


        conn = get_connection()
        cursor = conn.cursor()

        sql = """
            UPDATE mahasiswa
            SET nim=%s, nama=%s, email=%s, jurusan=%s, angkatan=%s, tipe=%s
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

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Data mahasiswa tidak ditemukan.")

        cursor.close()
        conn.close()

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
        raise HTTPException(status_code=500, detail=str(error))


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