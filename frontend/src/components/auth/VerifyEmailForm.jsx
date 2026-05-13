import { KeyRound, Mail, RotateCcw } from "lucide-react";
import AuthInput from "./AuthInput.jsx";

export default function VerifyEmailForm({
  form,
  loading,
  countdown,
  onChange,
  onSubmit,
  onResend,
  onGoLogin,
}) {
  const isCountdownActive = countdown > 0;

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

      <div className="rounded-[18px] border-[4px] border-black bg-[#FFDE59] px-4 py-3 text-sm font-black shadow-[5px_5px_0_#000]">
        {isCountdownActive ? (
          <span>
            Kode berlaku selama <b>{countdown} detik</b>. Cek email kamu
            sekarang.
          </span>
        ) : (
          <span>Kode sudah expired. Kirim ulang kode untuk lanjut.</span>
        )}
      </div>

      <button
        disabled={loading}
        className="h-13 min-h-13 w-full cursor-pointer rounded-[18px] border-[4px] border-black bg-[#4ADE80] text-sm font-black shadow-[6px_6px_0_#000] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_#000] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Memproses..." : "Verifikasi Email"}
      </button>

      <button
        type="button"
        onClick={onResend}
        disabled={loading || isCountdownActive}
        className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[18px] border-[4px] border-black bg-[#60A5FA] text-sm font-black shadow-[5px_5px_0_#000] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_#000] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <RotateCcw size={18} />
        {isCountdownActive
          ? `Kirim ulang dalam ${countdown}s`
          : "Kirim Ulang Kode"}
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
