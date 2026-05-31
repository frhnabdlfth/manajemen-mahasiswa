import json
import os

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse

from app.core.config import DATA_FILE
from app.core.security import get_current_admin
from app.repositories.mahasiswa_repository import get_all_mahasiswa_array

router = APIRouter(prefix="/file", tags=["File"])


@router.get("/export")
def export_to_file(current_admin: dict = Depends(get_current_admin)):
    try:
        data = get_all_mahasiswa_array()

        if not DATA_FILE:
            raise HTTPException(status_code=500, detail="DATA_FILE belum diset di .env")

        directory = os.path.dirname(DATA_FILE)

        if directory:
            os.makedirs(directory, exist_ok=True)

        with open(DATA_FILE, "w", encoding="utf-8") as file:
            json.dump(data, file, indent=4, ensure_ascii=False)

        return FileResponse(
            path=DATA_FILE,
            filename="mahasiswa_data.json",
            media_type="application/json",
        )

    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.get("/read")
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
