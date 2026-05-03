import Modal from "../ui/Modal.jsx";
import InputField from "../ui/InputField.jsx";
import BrutalSelect from "../ui/BrutalSelect.jsx";
import { Save, X } from "lucide-react";

export default function MahasiswaFormModal({
  open,
  editId,
  form,
  loading,
  onChange,
  onClose,
  onSubmit,
}) {
  return (
    <Modal
      open={open}
      title={editId ? "Edit Mahasiswa" : "Tambah Mahasiswa"}
      onClose={onClose}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <InputField
          label="NIM"
          name="nim"
          value={form.nim}
          onChange={onChange}
          placeholder="Contoh: 202401001"
        />

        <InputField
          label="Nama"
          name="nama"
          value={form.nama}
          onChange={onChange}
          placeholder="Contoh: Budi Santoso"
        />

        <InputField
          label="Email"
          name="email"
          value={form.email}
          onChange={onChange}
          placeholder="Contoh: budi@email.com"
        />

        <InputField
          label="Jurusan"
          name="jurusan"
          value={form.jurusan}
          onChange={onChange}
          placeholder="Contoh: Teknik Informatika"
        />

        <InputField
          label="Angkatan"
          name="angkatan"
          value={form.angkatan}
          onChange={onChange}
          type="number"
          placeholder="Contoh: 2024"
        />

        <BrutalSelect
          value={form.tipe}
          menuPlacement="top"
          onChange={(value) => {
            onChange({
              target: {
                name: "tipe",
                value,
              },
            });
          }}
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

        <div className="flex flex-wrap gap-3 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex justify-center items-center rounded-[18px] border-[4px] border-black bg-[#4ADE80] px-4 py-3 text-sm font-black shadow-[4px_4px_0_#000] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] disabled:opacity-60 cursor-pointer"
          >
            <Save size={20} className="mr-1 inline" />
            {editId ? "Update" : "Simpan"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex-1 flex justify-center items-center rounded-[18px] border-[4px] border-black bg-[#FB7185] px-4 py-3 text-sm font-black shadow-[4px_4px_0_#000] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] cursor-pointer"
          >
            <X size={20} className="mr-1 inline" />
            Batal
          </button>
        </div>
      </form>
    </Modal>
  );
}
