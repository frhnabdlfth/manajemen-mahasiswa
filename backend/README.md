## Struktur

```text
app/
  core/          # config, security, exception
  database/      # koneksi database
  models/        # OOP model mahasiswa
  repositories/  # query database reusable
  routes/        # endpoint FastAPI
  schemas/       # Pydantic request schema
  structures/    # linked list demo
  utils/         # validator, email, sorting, searching
main.py          # compatibility entrypoint
```

## Run

```bash
uvicorn main:app --reload
```
