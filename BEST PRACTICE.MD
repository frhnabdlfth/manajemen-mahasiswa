# Praktik
   1. Penamaan variabel jelas:
      mahasiswa_array, validate_mahasiswa, binary_search_by_nim.
   2. Modularisasi:
      Validasi, search, sort, database, file I/O dipisah ke fungsi masing-masing.
   3. OOP:
      Class Mahasiswa sebagai parent.
      MahasiswaReguler dan MahasiswaBeasiswa sebagai child.
      Method deskripsi() menunjukkan polymorphism.
   4. Error handling:
      Try-except digunakan di endpoint database dan file.
      Custom exception dipakai untuk validasi.
   5. Regex:
      NIM, nama, email, jurusan divalidasi sebelum masuk database.
   6. Komentar:
      Komentar dipakai untuk menjelaskan bagian penting, bukan setiap baris.
   7. Keamanan awal:
      Query database memakai parameterized query, bukan string SQL mentah.
   8. Skalabilitas:
      Sorting dan searching dipisah agar mudah diuji dan dikembangkan.

# Installasi dan run Frontend
   1. buka terminal 1
   2. cd frontend
   3. npm install
   4. npm run dev

# Installasi dan run Backend
   1. buka terminal 2
   2. cd backend
   3. pip install -r requirements.txt
   4. uvicorn main:app --reload
