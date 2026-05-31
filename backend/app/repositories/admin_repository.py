from app.core.exceptions import DatabaseException
from app.database.connection import get_connection


def get_admin_by_username(username: str):
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT id, username, email, password_hash, nama, role, email_verified
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


def get_admin_by_email(email: str):
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT id, username, email, password_hash, nama, role, email_verified
            FROM admin_users
            WHERE email = %s
            """,
            (email,),
        )

        admin = cursor.fetchone()
        cursor.close()
        conn.close()

        return admin
    except Exception as error:
        raise DatabaseException(str(error))
