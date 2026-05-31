import mysql.connector
from fastapi import APIRouter, Depends, HTTPException, Query

from app.core.exceptions import ValidationException
from app.core.security import get_current_admin
from app.database.connection import get_connection
from app.models.mahasiswa import Mahasiswa
from app.repositories.mahasiswa_repository import get_all_mahasiswa_array
from app.schemas.mahasiswa import MahasiswaRequest
from app.structures.linked_list import MahasiswaLinkedList
from app.utils.searching import binary_search_by_nim, linear_search, sequential_search
from app.utils.sorting import sort_data
from app.utils.validators import validate_mahasiswa

router = APIRouter(prefix="/mahasiswa", tags=["Mahasiswa"])


@router.post("/seed-dummy")
def seed_dummy_mahasiswa():
    try:
        dummy_data = [
            ("20240021001", "Budi Santoso", "budi.santoso@email.com", "Teknik Informatika", 2024, "Reguler"),
            ("20240021002", "Siti Aminah", "siti.aminah@email.com", "Sistem Informasi", 2024, "Beasiswa"),
            ("20240021003", "Andi Wijaya", "andi.wijaya@email.com", "Teknik Komputer", 2024, "Reguler"),
            ("20240021004", "Rina Marlina", "rina.marlina@email.com", "Manajemen Informatika", 2024, "Reguler"),
            ("20240021005", "Dewi Lestari", "dewi.lestari@email.com", "Teknik Informatika", 2024, "Beasiswa"),
            ("20230021001", "Ahmad Fauzi", "ahmad.fauzi@email.com", "Sistem Informasi", 2023, "Reguler"),
            ("20230021002", "Nadia Putri", "nadia.putri@email.com", "Teknik Informatika", 2023, "Beasiswa"),
            ("20230021003", "Rizky Pratama", "rizky.pratama@email.com", "Teknik Komputer", 2023, "Reguler"),
            ("20230021004", "Maya Sari", "maya.sari@email.com", "Manajemen Informatika", 2023, "Reguler"),
            ("20230021005", "Fajar Nugroho", "fajar.nugroho@email.com", "Sistem Informasi", 2023, "Beasiswa"),
            ("20220021001", "Putri Anggraini", "putri.anggraini@email.com", "Teknik Informatika", 2022, "Reguler"),
            ("20220021002", "Dimas Saputra", "dimas.saputra@email.com", "Teknik Komputer", 2022, "Reguler"),
            ("20220021003", "Laila Rahma", "laila.rahma@email.com", "Sistem Informasi", 2022, "Beasiswa"),
            ("20220021004", "Yoga Permana", "yoga.permana@email.com", "Manajemen Informatika", 2022, "Reguler"),
            ("20220021005", "Indah Prameswari", "indah.prameswari@email.com", "Teknik Informatika", 2022, "Beasiswa"),
            ("20210021001", "Bagas Maulana", "bagas.maulana@email.com", "Sistem Informasi", 2021, "Reguler"),
            ("20210021002", "Citra Amelia", "citra.amelia@email.com", "Teknik Informatika", 2021, "Reguler"),
            ("20210021003", "Reza Ramadhan", "reza.ramadhan@email.com", "Teknik Komputer", 2021, "Beasiswa"),
            ("20210021004", "Anisa Wulandari", "anisa.wulandari@email.com", "Manajemen Informatika", 2021, "Reguler"),
            ("20210021005", "Gilang Mahendra", "gilang.mahendra@email.com", "Sistem Informasi", 2021, "Beasiswa"),
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


@router.get("")
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


@router.post("")
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

        return {"message": "Data mahasiswa berhasil ditambahkan."}

    except mysql.connector.IntegrityError:
        raise HTTPException(status_code=409, detail="NIM sudah terdaftar.")
    except ValidationException as error:
        raise HTTPException(status_code=400, detail=str(error))
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.put("/{mahasiswa_id}")
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

        return {"message": "Data mahasiswa berhasil diperbarui."}

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


@router.delete("/{mahasiswa_id}")
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

        return {"message": "Data mahasiswa berhasil dihapus."}

    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.get("/search/linear")
def api_linear_search(keyword: str, current_admin: dict = Depends(get_current_admin)):
    data = get_all_mahasiswa_array()
    result = linear_search(data, keyword)

    return {
        "algorithm": "Linear Search",
        "result": result,
        "complexity": "O(n)",
    }


@router.get("/search/sequential")
def api_sequential_search(keyword: str, current_admin: dict = Depends(get_current_admin)):
    data = get_all_mahasiswa_array()
    result = sequential_search(data, keyword)

    return {
        "algorithm": "Sequential Search",
        "result": result,
        "total": len(result),
        "complexity": "O(n)",
    }


@router.get("/search/binary")
def api_binary_search(nim: str, current_admin: dict = Depends(get_current_admin)):
    data = get_all_mahasiswa_array()
    result = binary_search_by_nim(data, nim)

    return {
        "algorithm": "Binary Search",
        "result": result,
        "complexity": "O(log n), setelah data diurutkan berdasarkan NIM",
    }


@router.get("/linked-list")
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
