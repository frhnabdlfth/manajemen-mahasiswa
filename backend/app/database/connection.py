import mysql.connector

from app.core.config import DB_CONFIG
from app.core.exceptions import DatabaseException


def get_connection():
    try:
        return mysql.connector.connect(**DB_CONFIG)
    except Exception as error:
        raise DatabaseException(f"Gagal koneksi database: {error}")
