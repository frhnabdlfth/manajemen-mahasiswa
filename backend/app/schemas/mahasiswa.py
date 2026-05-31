from typing import Optional
from pydantic import BaseModel


class MahasiswaRequest(BaseModel):
    nim: str
    nama: str
    email: str
    jurusan: str
    angkatan: int
    tipe: Optional[str] = "Reguler"
