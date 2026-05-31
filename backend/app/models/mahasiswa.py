class Mahasiswa:
    def __init__(self, nim, nama, email, jurusan, angkatan, tipe="Reguler", id=None):
        self.__id = id
        self.__nim = nim
        self.__nama = nama
        self.__email = email
        self.__jurusan = jurusan
        self.__angkatan = angkatan
        self.__tipe = tipe

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
