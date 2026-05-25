import { useState } from "react";
import { ArrowLeft, LockKeyhole, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/layout/Navbar.jsx";
import AuthPasswordInput from "../components/auth/AuthPasswordInput.jsx";
import AlertMessage from "../components/ui/AlertMessage.jsx";

const emptyPasswordForm = {
  old_password: "",
  new_password: "",
  confirm_new_password: "",
};

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export default function ChangePasswordPage({
  authUser,
  onLogout,
  onChangePassword,
  loading,
}) {
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyPasswordForm);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.old_password.trim()) {
      nextErrors.old_password = "Password lama wajib diisi.";
    }

    if (!form.new_password.trim()) {
      nextErrors.new_password = "Password baru wajib diisi.";
    } else if (!passwordRegex.test(form.new_password)) {
      nextErrors.new_password =
        "Password baru minimal 8 karakter, wajib ada huruf besar, huruf kecil, angka, dan simbol.";
    }

    if (!form.confirm_new_password.trim()) {
      nextErrors.confirm_new_password = "Konfirmasi password wajib diisi.";
    } else if (form.new_password !== form.confirm_new_password) {
      nextErrors.confirm_new_password = "Konfirmasi password baru tidak sama.";
    }

    if (
      form.old_password &&
      form.new_password &&
      form.old_password === form.new_password
    ) {
      nextErrors.new_password =
        "Password baru tidak boleh sama dengan password lama.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      const result = await onChangePassword(form);

      setMessageType("success");
      setMessage(result?.message || "Password berhasil diubah.");
      setForm(emptyPasswordForm);
      setErrors({});
    } catch (error) {
      setMessageType("error");
      setMessage(error.message);
    }
  };

  return (
    <main className="min-h-screen bg-[#FFF7D6] p-4 text-slate-950 md:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <Navbar
          authUser={authUser}
          onLogout={onLogout}
          showNavigation={false}
        />

        {message && (
          <AlertMessage
            message={message}
            type={messageType}
            onClose={() => setMessage("")}
          />
        )}

        <section className="mx-auto max-w-7xl rounded-[32px] border-[5px] border-black bg-white p-5 shadow-[10px_10px_0_#000] sm:p-7">
          <div className="mb-6 flex items-start gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-[18px] border-[4px] border-black bg-[#4ADE80] shadow-[4px_4px_0_#000]">
              <LockKeyhole size={28} />
            </div>

            <div>
              <h1 className="text-2xl font-black md:text-3xl">Ubah Password</h1>
              <p className="mt-1 text-sm font-semibold text-slate-600">
                Masukkan password lama dan password baru untuk memperbarui akun.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <AuthPasswordInput
                label="Password Lama"
                name="old_password"
                value={form.old_password}
                onChange={handleChange}
                show={showOldPassword}
                setShow={setShowOldPassword}
                placeholder="Masukkan password lama"
              />

              {errors.old_password && (
                <p className="mt-2 rounded-[14px] border-[3px] border-black bg-[#FB7185] px-3 py-2 text-xs font-black shadow-[3px_3px_0_#000]">
                  {errors.old_password}
                </p>
              )}
            </div>

            <div>
              <AuthPasswordInput
                label="Password Baru"
                name="new_password"
                value={form.new_password}
                onChange={handleChange}
                show={showNewPassword}
                setShow={setShowNewPassword}
                placeholder="Masukkan password baru"
              />

              {errors.new_password && (
                <p className="mt-2 rounded-[14px] border-[3px] border-black bg-[#FB7185] px-3 py-2 text-xs font-black shadow-[3px_3px_0_#000]">
                  {errors.new_password}
                </p>
              )}
            </div>

            <div>
              <AuthPasswordInput
                label="Konfirmasi Password Baru"
                name="confirm_new_password"
                value={form.confirm_new_password}
                onChange={handleChange}
                show={showConfirmPassword}
                setShow={setShowConfirmPassword}
                placeholder="Ulangi password baru"
              />

              {errors.confirm_new_password && (
                <p className="mt-2 rounded-[14px] border-[3px] border-black bg-[#FB7185] px-3 py-2 text-xs font-black shadow-[3px_3px_0_#000]">
                  {errors.confirm_new_password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex h-13 min-h-13 w-full cursor-pointer items-center justify-center gap-2 rounded-[18px] border-[4px] border-black bg-[#4ADE80] text-sm font-black shadow-[6px_6px_0_#000] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_#000] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Menyimpan..." : "Simpan Password Baru"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="flex h-13 min-h-13 w-full cursor-pointer items-center justify-center gap-2 rounded-[18px] border-[4px] bg-[#FFDE59] border-black bg-[#4ADE80] text-sm font-black shadow-[6px_6px_0_#000] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_#000] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Kembali
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
