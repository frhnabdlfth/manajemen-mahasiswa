import { Mail, UserRound } from "lucide-react";
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
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <AuthInput
        label="Nama Lengkap"
        icon={<UserRound size={20} />}
        name="nama"
        value={form.nama}
        onChange={onChange}
        placeholder="Masukkan nama lengkap"
      />

      <AuthInput
        label="Username"
        icon={<UserRound size={20} />}
        name="username"
        value={form.username}
        onChange={onChange}
        placeholder="contoh: admin_baru"
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

      <div className="rounded-[18px] border-[4px] border-black bg-[#FFDE59] px-4 py-3 text-xs font-black shadow-[5px_5px_0_#000]">
        Password minimal 8 karakter, wajib ada huruf besar, huruf kecil, angka,
        dan simbol.
      </div>

      <button
        disabled={loading}
        className="h-13 min-h-13 w-full cursor-pointer rounded-[18px] border-[4px] border-black bg-[#4ADE80] text-sm font-black shadow-[6px_6px_0_#000] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_#000] disabled:cursor-not-allowed disabled:opacity-60"
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
