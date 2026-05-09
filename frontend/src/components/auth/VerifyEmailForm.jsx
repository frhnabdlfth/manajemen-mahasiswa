import { KeyRound, Mail } from "lucide-react";
import AuthInput from "./AuthInput.jsx";

export default function VerifyEmailForm({
  form,
  loading,
  onChange,
  onSubmit,
  onGoLogin,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <AuthInput
        label="Email"
        icon={<Mail size={20} />}
        name="email"
        value={form.email}
        onChange={onChange}
        placeholder="email@gmail.com"
        type="email"
      />

      <AuthInput
        label="Kode Verifikasi"
        icon={<KeyRound size={20} />}
        name="code"
        value={form.code}
        onChange={onChange}
        placeholder="Masukkan 6 digit kode"
        type="text"
      />

      <button
        disabled={loading}
        className="h-13 min-h-13 w-full cursor-pointer rounded-[18px] border-[4px] border-black bg-[#4ADE80] text-sm font-black shadow-[6px_6px_0_#000] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_#000] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Memproses..." : "Verifikasi Email"}
      </button>

      <button
        type="button"
        onClick={onGoLogin}
        className="h-12 w-full cursor-pointer rounded-[18px] border-[4px] border-black bg-white text-sm font-black shadow-[5px_5px_0_#000] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_#000]"
      >
        Kembali ke Login
      </button>
    </form>
  );
}
