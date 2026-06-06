import { useMemo } from "react";
import {
  CheckCircle2,
  Circle,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";

import AuthInput from "./AuthInput.jsx";
import AuthPasswordInput from "./AuthPasswordInput.jsx";

export default function RegisterForm({
  form,
  loading,
  showPassword,
  showConfirmPassword,
  setShowPassword,
  setShowConfirmPassword,
  onChange,
  onSubmit,
  onGoLogin,
}) {
  const passwordRegisterValidation = useMemo(() => {
    const password = form.password || "";
    const confirmPassword = form.confirm_password || "";

    return [
      {
        label: "Minimal 8 karakter",
        valid: password.length >= 8,
      },
      {
        label: "Mengandung huruf besar",
        valid: /[A-Z]/.test(password),
      },
      {
        label: "Mengandung huruf kecil",
        valid: /[a-z]/.test(password),
      },
      {
        label: "Mengandung angka",
        valid: /\d/.test(password),
      },
      {
        label: "Mengandung simbol",
        valid: /[^A-Za-z0-9]/.test(password),
      },
      {
        label: "Konfirmasi password cocok",
        valid: Boolean(confirmPassword) && password === confirmPassword,
      },
    ];
  }, [form.password, form.confirm_password]);

  const isPasswordStrong = passwordRegisterValidation.every(
    (item) => item.valid,
  );

  const isNameValid = /^[A-Za-z\s.'-]{3,100}$/.test((form.nama || "").trim());

  const isEmailValid = /^[\w.-]+@[\w.-]+\.\w+$/.test(
    (form.email || "").trim().toLowerCase(),
  );

  const isPasswordFilled = Boolean((form.password || "").trim());
  const isConfirmPasswordFilled = Boolean((form.confirm_password || "").trim());

  const isRegisterFormValid =
    isNameValid &&
    isEmailValid &&
    isPasswordFilled &&
    isConfirmPasswordFilled &&
    isPasswordStrong;

  const isRegisterDisabled = loading || !isRegisterFormValid;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <div className="space-y-4">
          <AuthInput
            label="Nama Lengkap"
            icon={<UserRound size={20} />}
            name="nama"
            value={form.nama}
            onChange={onChange}
            placeholder="Masukkan nama lengkap"
          />

          <AuthInput
            label="Email"
            icon={<Mail size={20} />}
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="email@gmail.com"
            type="email"
          />

          <AuthPasswordInput
            label="Password"
            name="password"
            value={form.password}
            onChange={onChange}
            show={showPassword}
            setShow={setShowPassword}
            placeholder="Masukkan password"
          />

          <AuthPasswordInput
            label="Konfirmasi Password"
            name="confirm_password"
            value={form.confirm_password}
            onChange={onChange}
            show={showConfirmPassword}
            setShow={setShowConfirmPassword}
            placeholder="Ulangi password"
          />
        </div>

        <aside className="rounded-[24px] border-[4px] border-black bg-[#C4B5FD] p-4 shadow-[6px_6px_0_#000] lg:sticky lg:top-4">
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
            {passwordRegisterValidation.map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-3 rounded-[16px] border-[3px] border-black px-3 py-2 text-sm font-black shadow-[3px_3px_0_#000] ${
                  item.valid ? "bg-[#4ADE80]" : "bg-white"
                }`}
              >
                {item.valid ? <CheckCircle2 size={20} /> : <Circle size={20} />}
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
              ? "Password sudah valid."
              : "Lengkapi syarat sebelum register."}
          </div>
        </aside>
      </div>

      <button
        type="submit"
        disabled={isRegisterDisabled}
        className={`h-13 min-h-13 w-full rounded-[18px] border-[4px] border-black text-sm font-black shadow-[6px_6px_0_#000] transition ${
          isRegisterDisabled
            ? "cursor-not-allowed bg-slate-300 opacity-60"
            : "cursor-pointer bg-[#4ADE80] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_#000]"
        }`}
      >
        {loading ? "Memproses..." : "Register"}
      </button>

      <button
        type="button"
        onClick={onGoLogin}
        className="h-12 w-full cursor-pointer rounded-[18px] border-[4px] border-black bg-white text-sm font-black shadow-[5px_5px_0_#000] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_#000]"
      >
        Sudah punya akun? Login
      </button>
    </form>
  );
}
