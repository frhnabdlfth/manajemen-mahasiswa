from app.core.exceptions import DatabaseException
from app.database.connection import get_connection
from app.models.mahasiswa import MahasiswaBeasiswa, MahasiswaReguler


def create_mahasiswa_object(row):
    id, nim, nama, email, jurusan, angkatan, tipe = row

    if tipe == "Beasiswa":
        return MahasiswaBeasiswa(nim, nama, email, jurusan, angkatan, id)

    return MahasiswaReguler(nim, nama, email, jurusan, angkatan, id)


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
