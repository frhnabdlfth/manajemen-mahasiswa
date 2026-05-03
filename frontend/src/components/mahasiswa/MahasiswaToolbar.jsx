import { Plus, Download, Upload, RefreshCcw, Search } from "lucide-react";
import BrutalSelect from "../ui/BrutalSelect.jsx";

export default function MahasiswaToolbar({
  total,
  keyword,
  setKeyword,
  searchAlgorithm,
  setSearchAlgorithm,
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

  const sortOptions = [
    { value: "merge", label: "Merge Sort" },
    { value: "bubble", label: "Bubble Sort" },
    { value: "insertion", label: "Insertion Sort" },
    { value: "selection", label: "Selection Sort" },
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
            className="rounded-[18px] border-[4px] border-black bg-[#4ADE80] px-4 py-3 text-sm font-black shadow-[4px_4px_0_#000] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] cursor-pointer"
          >
            <Plus size={16} className="mr-2 inline" />
            Tambah
          </button>

          <button
            type="button"
            onClick={onExport}
            whileTap={{ scale: 0.96 }}
            whileHover={{
              x: 2,
              y: 2,
              boxShadow: "2px 2px 0 #000",
            }}
            className="rounded-[18px] border-[4px] border-black bg-[#60A5FA] px-4 py-3 text-sm font-black shadow-[4px_4px_0_#000] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] cursor-pointer"
          >
            <Download size={16} className="mr-2 inline" />
            Export File
          </button>

          <button
            type="button"
            onClick={onReadFile}
            whileTap={{ scale: 0.96 }}
            whileHover={{
              x: 2,
              y: 2,
              boxShadow: "2px 2px 0 #000",
            }}
            className="rounded-[18px] border-[4px] border-black bg-[#FDBA74] px-4 py-3 text-sm font-black shadow-[4px_4px_0_#000] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] cursor-pointer"
          >
            <Upload size={16} className="mr-2 inline" />
            Read File
          </button>

          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            whileTap={{ scale: 0.96 }}
            whileHover={{
              x: 2,
              y: 2,
              boxShadow: "2px 2px 0 #000",
            }}
            className="rounded-[18px] border-[4px] border-black bg-[#F9A8D4] px-4 py-3 text-sm font-black shadow-[4px_4px_0_#000] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] disabled:opacity-60 cursor-pointer"
          >
            <RefreshCcw size={16} className="mr-2 inline cursor-pointer" />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_220px_220px_140px]">
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

        <BrutalSelect
          value={algorithm}
          onChange={setAlgorithm}
          options={sortOptions}
          placeholder="Pilih Sorting"
        />

        <button
          type="button"
          onClick={onSearch}
          className="rounded-[18px] border-[4px] border-black bg-[#FFDE59] px-4 py-3 text-sm font-black shadow-[4px_4px_0_#000] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] cursor-pointer"
        >
          Cari
        </button>
      </div>
    </section>
  );
}
