import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  LockKeyhole,
  Save,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";
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

  const passwordValidation = useMemo(() => {
    const newPassword = form.new_password;
    const oldPassword = form.old_password;
    const confirmPassword = form.confirm_new_password;

    return [
      {
        label: "Minimal 8 karakter",
        valid: newPassword.length >= 8,
      },
      {
        label: "Mengandung huruf besar",
        valid: /[A-Z]/.test(newPassword),
      },
      {
        label: "Mengandung angka",
        valid: /\d/.test(newPassword),
      },
      {
        label: "Mengandung simbol",
        valid: /[^A-Za-z0-9]/.test(newPassword),
      },
      {
        label: "Tidak sama dengan password lama",
        valid: Boolean(newPassword) && newPassword !== oldPassword,
      },
      {
        label: "Konfirmasi password cocok",
        valid: Boolean(confirmPassword) && newPassword === confirmPassword,
      },
    ];
  }, [form.old_password, form.new_password, form.confirm_new_password]);

  const isPasswordStrong = passwordValidation.every((item) => item.valid);

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

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mx-auto max-w-7xl rounded-[32px] border-[5px] border-black bg-white p-5 shadow-[10px_10px_0_#000] sm:p-7"
        >
          <div className="grid gap-5 lg:grid-cols-[1.5fr_0.8fr] lg:items-start">
            <div className="space-y-6">
              <div className="flex items-center gap-3 lg:items-start lg:gap-4">
                <div className="grid h-13 w-13 shrink-0 place-items-center rounded-[18px] border-[4px] border-black bg-[#4ADE80] shadow-[4px_4px_0_#000]">
                  <LockKeyhole size={28} />
                </div>

                <div>
                  <h1 className="text-2xl font-black md:text-3xl">
                    Ubah Password
                  </h1>
                  <p className="hidden lg:inline mt-1 text-sm font-semibold text-slate-600">
                    Masukkan password lama dan password baru untuk memperbarui
                    akun.
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
                  className="flex h-13 min-h-13 w-full cursor-pointer items-center justify-center gap-1 rounded-[18px] border-[4px] border-black bg-[#4ADE80] text-sm font-black shadow-[6px_6px_0_#000] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_#000] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={18} />
                  {loading ? "Menyimpan..." : "Simpan Password"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="flex h-13 min-h-13 w-full cursor-pointer items-center justify-center gap-1 rounded-[18px] border-[4px] border-black bg-[#FFDE59] text-sm font-black shadow-[6px_6px_0_#000] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_#000] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <ArrowLeft size={18} />
                  Kembali
                </button>
              </form>
            </div>

            <aside className="rounded-[28px] border-[5px] border-black bg-[#C4B5FD] p-5 mt-10px lg:mt-[-10px] shadow-[8px_8px_0_#000]">
              <div className="mb-4 flex items-center gap-3">
                {isPasswordStrong ? (
                  <div className="grid h-13 w-13 place-items-center rounded-[16px] border-[4px] border-black bg-[#4ADE80] shadow-[4px_4px_0_#000]">
                    <CheckCircle2 size={26} />
                  </div>
                ) : (
                  <div className="grid h-13 w-13 place-items-center rounded-[16px] border-[4px] border-black bg-[#FFDE59] shadow-[4px_4px_0_#000]">
                    <LockKeyhole size={26} />
                  </div>
                )}

                <div>
                  <h2 className="text-lg font-black">Validasi Password</h2>
                  <p className="text-xs font-bold text-slate-700">
                    Pastikan semua syarat terpenuhi.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {passwordValidation.map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-3 rounded-[16px] border-[3px] border-black px-3 py-2 text-sm font-black shadow-[3px_3px_0_#000] ${
                      item.valid ? "bg-[#4ADE80]" : "bg-white"
                    }`}
                  >
                    {item.valid ? (
                      <CheckCircle2 size={20} />
                    ) : (
                      <Circle size={20} />
                    )}
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>

              <div
                className={`mt-5 rounded-[18px] border-[4px] border-black px-4 py-3 text-sm font-black shadow-[4px_4px_0_#000] ${
                  isPasswordStrong ? "bg-[#4ADE80]" : "bg-[#FFDE59]"
                }`}
              >
                {isPasswordStrong
                  ? "Password baru sudah valid."
                  : "Lengkapi syarat password sebelum menyimpan."}
              </div>
            </aside>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
