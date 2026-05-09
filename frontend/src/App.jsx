import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";

import LoginPage from "./components/auth/LoginPage.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import MahasiswaToolbar from "./components/mahasiswa/MahasiswaToolbar.jsx";
import MahasiswaTable from "./components/mahasiswa/MahasiswaTable.jsx";
import MahasiswaFormModal from "./components/mahasiswa/MahasiswaFormModal.jsx";
import AlertMessage from "./components/ui/AlertMessage.jsx";
import ConfirmModal from "./components/ui/ConfirmModal.jsx";
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "./config/auth";

const API_URL = import.meta.env.VITE_API_URL;

function getAuthHeaders() {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

const emptyForm = {
  nim: "",
  nama: "",
  email: "",
  jurusan: "",
  angkatan: "",
  tipe: "Reguler",
};

const sortComplexityInfo = {
  bubble: "Bubble Sort memiliki Time Complexity O(n²).",
  insertion: "Insertion Sort memiliki Time Complexity O(n²), best case O(n).",
  selection: "Selection Sort memiliki Time Complexity O(n²).",
  merge: "Merge Sort memiliki Time Complexity O(n log n).",
  shell: "Shell Sort rata-rata sekitar O(n log n), worst case tergantung gap.",
};

const sortFieldLabel = {
  nama: "Nama",
  nim: "NIM",
  email: "Email",
  jurusan: "Jurusan",
  angkatan: "Angkatan",
  tipe: "Tipe",
};

export default function App() {
  const [authUser, setAuthUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [mahasiswa, setMahasiswa] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState("nama");
  const [algorithm, setAlgorithm] = useState("merge");
  const [searchAlgorithm, setSearchAlgorithm] = useState("sequential");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    const savedUser = localStorage.getItem(AUTH_USER_KEY);

    if (savedToken && savedUser) {
      try {
        setAuthUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
      }
    }

    setCheckingAuth(false);
  }, []);

  const handleLogin = (token, user) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    setAuthUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setAuthUser(null);
    setMahasiswa([]);
  };

  const filteredMahasiswa = useMemo(() => {
    return mahasiswa;
  }, [mahasiswa]);

  const handleChangeAlgorithm = (selectedAlgorithm) => {
    setAlgorithm(selectedAlgorithm);

    const message = sortComplexityInfo[selectedAlgorithm];

    if (message) {
      setMessage(message);
    }
  };

  const handleChangeSortBy = (selectedSortBy) => {
    setSortBy(selectedSortBy);

    setMessage(
      `Data akan diurutkan berdasarkan ${sortFieldLabel[selectedSortBy] || selectedSortBy}.`,
    );
  };

  const fetchMahasiswa = async (resetSearch = false) => {
    try {
      setLoading(true);

      if (resetSearch) {
        setSearchInput("");
        setKeyword("");
      }

      const response = await fetch(
        `${API_URL}/mahasiswa?sort_by=${sortBy}&algorithm=${algorithm}`,
        {
          headers: getAuthHeaders(),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Gagal mengambil data.");
      }

      setMahasiswa(result.data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authUser) {
      fetchMahasiswa();
    }
  }, [sortBy, algorithm, authUser]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
  };

  const closeModal = () => {
    resetForm();
    setIsModalOpen(false);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const payload = {
        ...form,
        angkatan: Number(form.angkatan),
      };

      const url = editId
        ? `${API_URL}/mahasiswa/${editId}`
        : `${API_URL}/mahasiswa`;

      const method = editId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Terjadi kesalahan.");
      }

      setMessage(result.message);
      closeModal();
      fetchMahasiswa();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({
      nim: item.nim,
      nama: item.nama,
      email: item.email,
      jurusan: item.jurusan,
      angkatan: item.angkatan,
      tipe: item.tipe,
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (item) => {
    setDeleteTarget(item);
  };

  const closeDeleteModal = () => {
    if (loading) return;
    setDeleteTarget(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/mahasiswa/${deleteTarget.id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Gagal menghapus data.");
      }

      setMessage(result.message);
      setDeleteTarget(null);
      fetchMahasiswa();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackendSearch = async () => {
    const keywordValue = searchInput.trim();

    if (!keywordValue) {
      setMessage("Masukkan kata kunci pencarian terlebih dahulu.");
      return;
    }

    if (!searchAlgorithm) {
      setMessage("Pilih algoritma search terlebih dahulu.");
      return;
    }

    try {
      setLoading(true);
      setKeyword(keywordValue);

      let url = "";

      if (searchAlgorithm === "binary") {
        url = `${API_URL}/mahasiswa/search/binary?nim=${encodeURIComponent(keywordValue)}`;
      } else if (searchAlgorithm === "linear") {
        url = `${API_URL}/mahasiswa/search/linear?keyword=${encodeURIComponent(keywordValue)}`;
      } else {
        url = `${API_URL}/mahasiswa/search/sequential?keyword=${encodeURIComponent(keywordValue)}`;
      }

      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Pencarian gagal.");
      }

      if (Array.isArray(result.result)) {
        setMahasiswa(result.result);
      } else if (result.result) {
        setMahasiswa([result.result]);
      } else {
        setMahasiswa([]);
      }

      setMessage(
        `Pencarian menggunakan ${result.algorithm}. Complexity: ${result.complexity}`,
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const exportFile = async () => {
    try {
      const response = await fetch(`${API_URL}/file/export`, {
        headers: getAuthHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Export file gagal.");
      }

      setMessage(result.message);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const readFile = async () => {
    try {
      const response = await fetch(`${API_URL}/file/read`, {
        headers: getAuthHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Read file gagal.");
      }

      setMahasiswa(result.data);
      setMessage(result.message);
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (checkingAuth) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#FFF7D6]">
        <div className="rounded-[20px] border-[4px] border-black bg-[#4ADE80] px-6 py-4 text-sm font-black shadow-[6px_6px_0_#000]">
          Loading...
        </div>
      </main>
    );
  }

  if (!authUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <main className="min-h-screen bg-[#FFF7D6] p-4 text-slate-950 md:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <Navbar authUser={authUser} onLogout={handleLogout} />

        <AnimatePresence>
          {message && (
            <AlertMessage message={message} onClose={() => setMessage("")} />
          )}
        </AnimatePresence>

        <section className="grid gap-5">
          <MahasiswaToolbar
            total={filteredMahasiswa.length}
            keyword={searchInput}
            setKeyword={setSearchInput}
            searchAlgorithm={searchAlgorithm}
            setSearchAlgorithm={setSearchAlgorithm}
            sortBy={sortBy}
            setSortBy={handleChangeSortBy}
            algorithm={algorithm}
            setAlgorithm={handleChangeAlgorithm}
            onSearch={handleBackendSearch}
            onOpenCreate={openCreateModal}
            onExport={exportFile}
            onReadFile={readFile}
            onRefresh={() => fetchMahasiswa(true)}
            loading={loading}
          />

          <MahasiswaTable
            data={filteredMahasiswa}
            onEdit={handleEdit}
            onDelete={openDeleteModal}
          />

          <section className="rounded-[28px] border-[4px] border-black bg-white p-5 shadow-[8px_8px_0_#000]">
            <h3 className="mb-3 text-lg font-black">Time Complexity</h3>
            <ul className="list-inside list-disc space-y-1 text-sm font-medium">
              <li>Linear Search / Sequential Search: O(n)</li>
              <li>Binary Search: O(log n), data harus terurut</li>
              <li>Bubble / Insertion / Selection Sort: O(n²)</li>
              <li>Merge Sort: O(n log n)</li>
              <li>File Export / Read: O(n)</li>
            </ul>
          </section>
        </section>
      </div>

      <MahasiswaFormModal
        open={isModalOpen}
        editId={editId}
        form={form}
        loading={loading}
        onChange={handleChange}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Hapus Mahasiswa?"
        message={
          deleteTarget
            ? `Data mahasiswa "${deleteTarget.nama}" dengan NIM ${deleteTarget.nim} akan dihapus permanen.`
            : "Data mahasiswa akan dihapus permanen."
        }
        confirmText="Hapus"
        cancelText="Batal"
        variant="danger"
        loading={loading}
        onConfirm={handleDelete}
        onClose={closeDeleteModal}
      />
    </main>
  );
}
