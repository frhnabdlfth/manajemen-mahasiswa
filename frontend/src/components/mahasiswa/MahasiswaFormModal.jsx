import { useEffect, useState } from "react";
import Modal from "../ui/Modal.jsx";
import InputField from "../ui/InputField.jsx";
import BrutalSelect from "../ui/BrutalSelect.jsx";
import { Save, X } from "lucide-react";

const initialErrors = {
  nim: "",
  nama: "",
  email: "",
  jurusan: "",
  angkatan: "",
  tipe: "",
};

export default function MahasiswaFormModal({
  open,
  editId,
  form,
  loading,
  onChange,
  onClose,
  onSubmit,
}) {
  const [errors, setErrors] = useState(initialErrors);

  useEffect(() => {
    if (open) {
      setErrors(initialErrors);
    }
  }, [open, editId]);

  const validateForm = () => {
    const nextErrors = { ...initialErrors };

    const nim = String(form.nim || "").trim();
    const nama = String(form.nama || "").trim();
    const email = String(form.email || "").trim();
    const jurusan = String(form.jurusan || "").trim();
    const angkatan = Number(form.angkatan);
    const tipe = String(form.tipe || "").trim();

    const nimPattern = /^[0-9]{12}$/;
    const namaPattern = /^[A-Za-z\s.'-]{3,100}$/;
    const emailPattern = /^[\w.-]+@[\w.-]+\.\w+$/;
    const jurusanPattern = /^[A-Za-z\s]{2,100}$/;

    if (!nim) {
      nextErrors.nim = "NIM wajib diisi.";
    } else if (!nimPattern.test(nim)) {
      nextErrors.nim = "NIM harus angka dan panjang 12 digit.";
    }

    if (!nama) {
      nextErrors.nama = "Nama wajib diisi.";
    } else if (!namaPattern.test(nama)) {
      nextErrors.nama =
        "Nama hanya boleh huruf, spasi, titik, petik, atau strip.";
    }

    if (!email) {
      nextErrors.email = "Email wajib diisi.";
    } else if (!emailPattern.test(email)) {
      nextErrors.email = "Format email tidak valid.";
    }

    if (!jurusan) {
      nextErrors.jurusan = "Jurusan wajib diisi.";
    } else if (!jurusanPattern.test(jurusan)) {
      nextErrors.jurusan = "Jurusan hanya boleh huruf dan spasi.";
    }

    if (!form.angkatan) {
      nextErrors.angkatan = "Angkatan wajib diisi.";
    } else if (Number.isNaN(angkatan)) {
      nextErrors.angkatan = "Angkatan harus berupa angka.";
    } else if (angkatan < 1990 || angkatan > 2100) {
      nextErrors.angkatan = "Angkatan tidak valid.";
    }

    if (!tipe) {
      nextErrors.tipe = "Tipe mahasiswa wajib dipilih.";
    } else if (!["Reguler", "Beasiswa"].includes(tipe)) {
      nextErrors.tipe = "Tipe mahasiswa hanya boleh Reguler atau Beasiswa.";
    }

    setErrors(nextErrors);

    return !Object.values(nextErrors).some(Boolean);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const isValid = validateForm();

    if (!isValid) return;

    onSubmit(event);
  };

  const handleChange = (event) => {
    const { name } = event.target;

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));

    onChange(event);
  };

  const handleTipeChange = (value) => {
    setErrors((current) => ({
      ...current,
      tipe: "",
    }));

    onChange({
      target: {
        name: "tipe",
        value,
      },
    });
  };

  return (
    <Modal
      open={open}
      title={editId ? "Edit Mahasiswa" : "Tambah Mahasiswa"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <InputField
            label="NIM"
            name="nim"
            value={form.nim}
            onChange={handleChange}
            placeholder="Contoh: 242400210032"
            maxLength={12}
          />
          <ErrorText message={errors.nim} />
        </div>

        <div>
          <InputField
            label="Nama"
            name="nama"
            value={form.nama}
            onChange={handleChange}
            placeholder="Contoh: Budi Santoso"
          />
          <ErrorText message={errors.nama} />
        </div>

        <div>
          <InputField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Contoh: budi@email.com"
          />
          <ErrorText message={errors.email} />
        </div>

        <div>
          <InputField
            label="Jurusan"
            name="jurusan"
            value={form.jurusan}
            onChange={handleChange}
            placeholder="Contoh: Teknik Informatika"
          />
          <ErrorText message={errors.jurusan} />
        </div>

        <div>
          <InputField
            label="Angkatan"
            name="angkatan"
            value={form.angkatan}
            onChange={handleChange}
            type="number"
            placeholder="Contoh: 2024"
          />
          <ErrorText message={errors.angkatan} />
        </div>

        <div>
          <label className="mb-2 block text-xs font-black uppercase tracking-wide">
            Tipe Mahasiswa
          </label>

          <BrutalSelect
            value={form.tipe}
            menuPlacement="top"
            onChange={handleTipeChange}
            options={[
              {
                value: "Reguler",
                label: "Reguler",
              },
              {
                value: "Beasiswa",
                label: "Beasiswa",
              },
            ]}
            placeholder="Pilih tipe mahasiswa"
            className="cursor-pointer"
          />

          <ErrorText message={errors.tipe} />
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="flex flex-1 cursor-pointer items-center justify-center rounded-[18px] border-[4px] border-black bg-[#4ADE80] px-4 py-3 text-sm font-black shadow-[4px_4px_0_#000] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={20} className="mr-1 inline" />
            {loading ? "Menyimpan..." : editId ? "Update" : "Simpan"}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex flex-1 cursor-pointer items-center justify-center rounded-[18px] border-[4px] border-black bg-[#FB7185] px-4 py-3 text-sm font-black shadow-[4px_4px_0_#000] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X size={20} className="mr-1 inline" />
            Batal
          </button>
        </div>
      </form>
    </Modal>
  );
}

function ErrorText({ message }) {
  if (!message) return null;

  return (
    <p className="mt-2 rounded-[14px] border-[3px] border-black bg-[#FB7185] px-3 py-2 text-xs font-black text-black shadow-[3px_3px_0_#000]">
      {message}
    </p>
  );
}
