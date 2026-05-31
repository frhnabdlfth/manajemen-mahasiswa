from fastapi import APIRouter

router = APIRouter(tags=["Misc"])


@router.get("/")
def root():
    return {"message": "Backend Manajemen Data Mahasiswa"}


@router.get("/complexity")
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
