from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import CORS_ALLOWED_ORIGINS
from app.routes import auth, file, mahasiswa, misc

app = FastAPI(title="API Manajemen Data Mahasiswa")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(misc.router)
app.include_router(auth.router)
app.include_router(mahasiswa.router)
app.include_router(file.router)
