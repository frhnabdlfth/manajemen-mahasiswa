import { UserRound, Mail } from "lucide-react";
import AuthInput from "./AuthInput.jsx";
import AuthPasswordInput from "./AuthPasswordInput.jsx";

export default function LoginForm({
  form,
  loading,
  showPassword,
  setShowPassword,
  onChange,
  onSubmit,
  onGoRegister,
  onGoVerify,
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

      <AuthPasswordInput
        label="Password"
        name="password"
        value={form.password}
        onChange={onChange}
        show={showPassword}
        setShow={setShowPassword}
        placeholder="Masukkan password"
      />

      <button
        disabled={loading}
        className="h-13 min-h-13 w-full cursor-pointer rounded-[18px] border-[4px] border-black bg-[#4ADE80] text-sm font-black shadow-[6px_6px_0_#000] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_#000] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Memproses..." : "Login"}
      </button>

      <div className="grid gap-3">
        <button
          type="button"
          onClick={onGoRegister}
          className="h-12 w-full cursor-pointer rounded-[18px] border-[4px] border-black bg-white text-sm font-black shadow-[5px_5px_0_#000] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_#000]"
        >
          Belum punya akun? Register
        </button>
      </div>
    </form>
  );
}
