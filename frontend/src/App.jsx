import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { apiFetch } from "./utils/apiFetch";

import LandingPage from "./components/landing/LandingPage.jsx";
import LoginPage from "./components/auth/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "./config/auth";

const API_URL = import.meta.env.VITE_API_URL;

function getAuthHeaders() {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

const emptyMahasiswaForm = {
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
  const navigate = useNavigate();

  const [authUser, setAuthUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [mahasiswa, setMahasiswa] = useState([]);
  const [form, setForm] = useState(emptyMahasiswaForm);
  const [editId, setEditId] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState("nama");
  const [algorithm, setAlgorithm] = useState("merge");
  const [searchAlgorithm, setSearchAlgorithm] = useState("sequential");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem(AUTH_TOKEN_KEY);
      const savedUser = localStorage.getItem(AUTH_USER_KEY);

      if (!savedToken || !savedUser) {
        setCheckingAuth(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Token invalid.");
        }

        const result = await response.json();

        setAuthUser(result.user || JSON.parse(savedUser));
      } catch {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
        setAuthUser(null);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = (token, user) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    setAuthUser(user);
    navigate("/dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setAuthUser(null);
    setMahasiswa([]);
    navigate("/login");
  };

  const handleSessionExpired = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setAuthUser(null);
    setMahasiswa([]);
    setMessageType("error");
    setMessage("Sesi login kamu sudah habis. Silakan login ulang.");
    navigate("/login");
  };

  const filteredMahasiswa = useMemo(() => mahasiswa, [mahasiswa]);

  const handleChangeAlgorithm = (selectedAlgorithm) => {
    setAlgorithm(selectedAlgorithm);

    const info = sortComplexityInfo[selectedAlgorithm];

    if (info) {
      setMessage(info);
    }
  };

  const handleChangeSortBy = (selectedSortBy) => {
    setSortBy(selectedSortBy);

    setMessage(
      `Data akan diurutkan berdasarkan ${
        sortFieldLabel[selectedSortBy] || selectedSortBy
      }.`,
    );
  };

  const fetchMahasiswa = async (resetSearch = false) => {
    try {
      setLoading(true);

      if (resetSearch) {
        setSearchInput("");
        setKeyword("");
      }

      const response = await apiFetch(
        `${API_URL}/mahasiswa?sort_by=${sortBy}&algorithm=${algorithm}`,
        {},
        handleSessionExpired,
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Gagal mengambil data.");
      }

      setMahasiswa(result.data);
    } catch (error) {
      setMessageType("error");
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
    setForm(emptyMahasiswaForm);
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

      const response = await apiFetch(
        url,
        {
          method,
          body: JSON.stringify(payload),
        },
        handleSessionExpired,
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Terjadi kesalahan.");
      }

      setMessageType("success");
      setMessage(result.message);
      closeModal();
      await fetchMahasiswa();
    } catch (error) {
      setMessageType("error");
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

      const response = await apiFetch(
        `${API_URL}/mahasiswa/${deleteTarget.id}`,
        {
          method: "DELETE",
        },
        handleSessionExpired,
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Gagal menghapus data.");
      }

      setMessageType("success");
      setMessage(result.message);
      setDeleteTarget(null);
      await fetchMahasiswa();
    } catch (error) {
      setMessageType("error");
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackendSearch = async () => {
    const keywordValue = searchInput.trim();

    if (!keywordValue) {
      setKeyword("");
      await fetchMahasiswa(true);
      return;
    }

    if (!searchAlgorithm) {
      setMessageType("error");
      setMessage("Pilih algoritma search terlebih dahulu.");
      return;
    }

    if (searchAlgorithm === "binary" && !/^[0-9]+$/.test(keywordValue)) {
      setMessageType("error");
      setMessage(
        "Binary Search hanya bisa mencari berdasarkan NIM. Masukkan NIM berupa angka, bukan nama atau jurusan.",
      );
      return;
    }

    try {
      setLoading(true);
      setKeyword(keywordValue);

      let url = "";

      if (searchAlgorithm === "binary") {
        url = `${API_URL}/mahasiswa/search/binary?nim=${encodeURIComponent(
          keywordValue,
        )}`;
      } else if (searchAlgorithm === "linear") {
        url = `${API_URL}/mahasiswa/search/linear?keyword=${encodeURIComponent(
          keywordValue,
        )}`;
      } else {
        url = `${API_URL}/mahasiswa/search/sequential?keyword=${encodeURIComponent(
          keywordValue,
        )}`;
      }

      const startTime = performance.now();

      const response = await apiFetch(url, {}, handleSessionExpired);

      const result = await response.json();

      const endTime = performance.now();
      const executionTime = (endTime - startTime).toFixed(3);

      if (!response.ok) {
        throw new Error(result.detail || "Pencarian gagal.");
      }

      let searchResult = [];

      if (Array.isArray(result.result)) {
        searchResult = result.result;
      } else if (result.result) {
        searchResult = [result.result];
      }

      setMahasiswa(searchResult);

      if (searchResult.length === 0) {
        setMessageType("error");

        if (searchAlgorithm === "binary") {
          setMessage(
            `Data mahasiswa dengan NIM "${keywordValue}" tidak ditemukan. Binary Search hanya mencari berdasarkan NIM.`,
          );
        } else {
          setMessage(`Data mahasiswa "${keywordValue}" tidak ditemukan.`);
        }

        return;
      }

      setMessageType("success");
      setMessage(
        `Data mahasiswa "${keywordValue}" ditemukan menggunakan ${result.algorithm}. Time: ${executionTime} ms. Best: O(1). Complexity: ${result.complexity}`,
      );
    } catch (error) {
      setMessageType("error");
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchInputChange = (value) => {
    setSearchInput(value);

    if (value.trim() === "" && keyword) {
      setKeyword("");
      fetchMahasiswa(true);
    }
  };

  const exportFile = async () => {
    try {
      setLoading(true);

      const response = await apiFetch(
        `${API_URL}/file/export`,
        {},
        handleSessionExpired,
      );

      if (!response.ok) {
        const text = await response.text();
        let errorMessage = "Export file gagal.";
        setMessageType("error");
        setMessage(errorMessage);

        try {
          const result = JSON.parse(text);
          errorMessage = result.detail || errorMessage;
        } catch {
          errorMessage = text || errorMessage;
        }

        throw new Error(errorMessage);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "mahasiswa_data.json";
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setMessageType("error");
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const readFile = async () => {
    try {
      const response = await apiFetch(
        `${API_URL}/file/read`,
        {},
        handleSessionExpired,
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Read file gagal.");
      }

      setMahasiswa(result.data);
      setMessageType("success");
      setMessage(result.message);
    } catch (error) {
      setMessageType("error");
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

  return (
    <Routes>
      <Route
        path="/"
        element={
          <LandingPage
            onGoLogin={() => navigate("/login")}
            onGoRegister={() => navigate("/register")}
          />
        }
      />

      <Route
        path="/login"
        element={
          authUser ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LoginPage initialMode="login" onLogin={handleLogin} />
          )
        }
      />

      <Route
        path="/register"
        element={
          authUser ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LoginPage initialMode="register" onLogin={handleLogin} />
          )
        }
      />

      <Route
        path="/verify-email"
        element={
          authUser ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LoginPage initialMode="verify" onLogin={handleLogin} />
          )
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage
              view="dashboard"
              authUser={authUser}
              onLogout={handleLogout}
              message={message}
              messageType={messageType}
              setMessage={setMessage}
              filteredMahasiswa={filteredMahasiswa}
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              searchAlgorithm={searchAlgorithm}
              setSearchAlgorithm={setSearchAlgorithm}
              sortBy={sortBy}
              handleChangeSortBy={handleChangeSortBy}
              algorithm={algorithm}
              handleChangeAlgorithm={handleChangeAlgorithm}
              handleBackendSearch={handleBackendSearch}
              openCreateModal={openCreateModal}
              exportFile={exportFile}
              readFile={readFile}
              fetchMahasiswa={fetchMahasiswa}
              loading={loading}
              handleEdit={handleEdit}
              openDeleteModal={openDeleteModal}
              isModalOpen={isModalOpen}
              editId={editId}
              form={form}
              handleChange={handleChange}
              closeModal={closeModal}
              handleSubmit={handleSubmit}
              deleteTarget={deleteTarget}
              handleDelete={handleDelete}
              closeDeleteModal={closeDeleteModal}
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="/mahasiswa"
        element={
          <ProtectedRoute>
            <DashboardPage
              view="mahasiswa"
              authUser={authUser}
              onLogout={handleLogout}
              message={message}
              messageType={messageType}
              setMessage={setMessage}
              filteredMahasiswa={filteredMahasiswa}
              searchInput={searchInput}
              setSearchInput={handleSearchInputChange}
              searchAlgorithm={searchAlgorithm}
              setSearchAlgorithm={setSearchAlgorithm}
              sortBy={sortBy}
              handleChangeSortBy={handleChangeSortBy}
              algorithm={algorithm}
              handleChangeAlgorithm={handleChangeAlgorithm}
              handleBackendSearch={handleBackendSearch}
              openCreateModal={openCreateModal}
              exportFile={exportFile}
              readFile={readFile}
              fetchMahasiswa={fetchMahasiswa}
              loading={loading}
              handleEdit={handleEdit}
              openDeleteModal={openDeleteModal}
              isModalOpen={isModalOpen}
              editId={editId}
              form={form}
              handleChange={handleChange}
              closeModal={closeModal}
              handleSubmit={handleSubmit}
              deleteTarget={deleteTarget}
              handleDelete={handleDelete}
              closeDeleteModal={closeDeleteModal}
            />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
