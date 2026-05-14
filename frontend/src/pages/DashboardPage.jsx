import { AnimatePresence } from "framer-motion";

import Navbar from "../components/layout/Navbar.jsx";
import MahasiswaToolbar from "../components/mahasiswa/MahasiswaToolbar.jsx";
import MahasiswaTable from "../components/mahasiswa/MahasiswaTable.jsx";
import MahasiswaFormModal from "../components/mahasiswa/MahasiswaFormModal.jsx";
import AlertMessage from "../components/ui/AlertMessage.jsx";
import ConfirmModal from "../components/ui/ConfirmModal.jsx";
import DashboardOverview from "./DashboardOverview.jsx";

export default function DashboardPage({
  view = "dashboard",
  authUser,
  onLogout,

  message,
  messageType,
  setMessage,
  filteredMahasiswa,
  searchInput,
  setSearchInput,
  searchAlgorithm,
  setSearchAlgorithm,
  sortBy,
  handleChangeSortBy,
  algorithm,
  handleChangeAlgorithm,
  handleBackendSearch,
  openCreateModal,
  exportFile,
  readFile,
  fetchMahasiswa,
  loading,
  handleEdit,
  openDeleteModal,
  isModalOpen,
  editId,
  form,
  handleChange,
  closeModal,
  handleSubmit,
  deleteTarget,
  handleDelete,
  closeDeleteModal,
}) {
  const isMahasiswaPage = view === "mahasiswa";

  return (
    <main className="min-h-screen bg-[#FFF7D6] p-4 text-slate-950 md:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <Navbar authUser={authUser} onLogout={onLogout} />

        <AnimatePresence>
          {message && (
            <AlertMessage
              message={message}
              type={messageType}
              onClose={() => setMessage("")}
            />
          )}
        </AnimatePresence>

        {isMahasiswaPage ? (
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
                <li>Shell Sort: rata-rata O(n log n)</li>
                <li>File Export / Read: O(n)</li>
              </ul>
            </section>
          </section>
        ) : (
          <DashboardOverview data={filteredMahasiswa} />
        )}
      </div>

      {isMahasiswaPage && (
        <>
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
        </>
      )}
    </main>
  );
}
