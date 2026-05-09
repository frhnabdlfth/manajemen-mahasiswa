import { Plus, Download, Upload, RefreshCcw, Search } from "lucide-react";
import BrutalSelect from "../ui/BrutalSelect.jsx";

export default function MahasiswaToolbar({
  total,
  keyword,
  setKeyword,
  searchAlgorithm,
  setSearchAlgorithm,
  sortBy,
  setSortBy,
  algorithm,
  setAlgorithm,
  onSearch,
  onOpenCreate,
  onExport,
  onReadFile,
  onRefresh,
  loading,
}) {
  const searchOptions = [
    { value: "sequential", label: "Sequential Search" },
    { value: "linear", label: "Linear Search" },
    { value: "binary", label: "Binary Search (NIM)" },
  ];

  const sortByOptions = [
    { value: "nama", label: "Nama" },
    { value: "nim", label: "NIM" },
    { value: "email", label: "Email" },
    { value: "jurusan", label: "Jurusan" },
    { value: "angkatan", label: "Angkatan" },
    { value: "tipe", label: "Tipe" },
  ];

  const sortOptions = [
    { value: "merge", label: "Merge Sort - O(n log n)" },
    { value: "bubble", label: "Bubble Sort - O(n²)" },
    { value: "insertion", label: "Insertion Sort - O(n²)" },
    { value: "selection", label: "Selection Sort - O(n²)" },
    { value: "shell", label: "Shell Sort" },
  ];

  return (
    <section className="rounded-[28px] border-[4px] border-black bg-white p-5 shadow-[8px_8px_0_#000]">
      <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h2 className="text-xl font-black md:text-2xl">Data Mahasiswa</h2>
          <p className="text-sm font-semibold">Total tampil: {total}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onOpenCreate}
            className="cursor-pointer rounded-[18px] border-[4px] border-black bg-[#4ADE80] px-4 py-3 text-sm font-black shadow-[4px_4px_0_#000] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000]"
          >
            <Plus size={16} className="mr-2 inline" />
            Tambah
          </button>

          <button
            type="button"
            onClick={onExport}
            className="cursor-pointer rounded-[18px] border-[4px] border-black bg-[#60A5FA] px-4 py-3 text-sm font-black shadow-[4px_4px_0_#000] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000]"
          >
            <Download size={16} className="mr-2 inline" />
            Export File
          </button>

          <button
            type="button"
            onClick={onReadFile}
            className="cursor-pointer rounded-[18px] border-[4px] border-black bg-[#FDBA74] px-4 py-3 text-sm font-black shadow-[4px_4px_0_#000] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000]"
          >
            <Upload size={16} className="mr-2 inline" />
            Read File
          </button>

          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="cursor-pointer rounded-[18px] border-[4px] border-black bg-[#F9A8D4] px-4 py-3 text-sm font-black shadow-[4px_4px_0_#000] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCcw size={16} className="mr-2 inline" />
            Refresh
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid gap-3 lg:grid-cols-[1fr_220px_140px]">
          <div className="flex h-12 items-center gap-2 rounded-[18px] border-[4px] border-black bg-[#FFF7D6] px-4 shadow-[4px_4px_0_#000]">
            <Search size={18} />
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              type="search"
              placeholder="Cari nama, NIM, jurusan..."
              className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-500"
            />
          </div>

          <BrutalSelect
            value={searchAlgorithm}
            onChange={setSearchAlgorithm}
            options={searchOptions}
            placeholder="Pilih Search"
          />

          <button
            type="button"
            onClick={onSearch}
            className="cursor-pointer rounded-[18px] border-[4px] border-black bg-[#FFDE59] px-4 py-3 text-sm font-black shadow-[4px_4px_0_#000] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000]"
          >
            Cari
          </button>
        </div>

        <div className="grid gap-3 lg:grid-cols-[220px_260px_1fr] lg:items-end">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-700">
              Urutkan Berdasarkan
            </p>

            <BrutalSelect
              value={sortBy}
              onChange={setSortBy}
              options={sortByOptions}
              placeholder="Pilih Field"
            />
          </div>

          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-700">
              Sorting Data
            </p>

            <BrutalSelect
              value={algorithm}
              onChange={setAlgorithm}
              options={sortOptions}
              placeholder="Pilih Sorting"
            />
          </div>

          <div className="rounded-[18px] border-[4px] border-black bg-[#FFF7D6] px-4 py-3 text-sm font-bold shadow-[4px_4px_0_#000]">
            Data akan diurutkan otomatis berdasarkan field dan algoritma sorting
            yang dipilih.
          </div>
        </div>
      </div>
    </section>
  );
}
