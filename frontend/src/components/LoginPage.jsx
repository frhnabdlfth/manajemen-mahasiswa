import { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  UserRound,
  GraduationCap,
  Sparkles,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000";

export default function LoginPage({ onLogin }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.username.trim()) {
      setError("Username wajib diisi.");
      return;
    }

    if (!form.password) {
      setError("Password wajib diisi.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: form.username.trim(),
          password: form.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Login gagal.");
      }

      onLogin(result.token, result.user);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#FFF7D6] p-4 text-slate-950">
      <div className="absolute -left-16 top-55 h-40 w-40 rounded-full border-[4px] border-black bg-[#4ADE80] shadow-[8px_8px_0_#000]" />
      <div className="absolute -right-14 -bottom-10 h-44 w-44 rotate-12 border-[4px] border-black bg-[#60A5FA] shadow-[8px_8px_0_#000]" />
      <div className="absolute right-35 top-5 h-44 w-44 rounded-full border-[4px] border-black bg-[#C4B5FD] shadow-[8px_8px_0_#000]" />

      <section className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-[32px] border-[5px] border-black bg-white shadow-[12px_12px_0_#000] lg:grid-cols-[1fr_430px]">
        <div className="hidden bg-[#FFDE59] p-8 lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="mb-6 inline-grid h-20 w-20 place-items-center rounded-[24px] border-[4px] border-black bg-[#4ADE80] shadow-[6px_6px_0_#000]">
              <GraduationCap size={42} />
            </div>

            <h1 className="max-w-md text-5xl font-black leading-[0.95] tracking-tight">
              Manajemen Data Mahasiswa
            </h1>

            <p className="mt-5 max-w-md text-base font-bold leading-relaxed">
              Login sebagai admin untuk mengelola data mahasiswa, validasi, file
              I/O, pencarian, dan pengurutan data.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-[24px] border-[4px] border-black bg-white p-4 shadow-[5px_5px_0_#000]">
              <b className="block text-3xl font-black">OOP</b>
              <span className="text-sm font-bold">Class & Object</span>
            </div>

            <div className="rounded-[24px] border-[4px] border-black bg-[#F9A8D4] p-4 shadow-[5px_5px_0_#000]">
              <b className="block text-3xl font-black">API</b>
              <span className="text-sm font-bold">FastAPI + MySQL</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 sm:p-7">
          <div className="mb-7 lg:hidden">
            <div className="mb-4 inline-grid h-16 w-16 place-items-center rounded-[20px] border-[4px] border-black bg-[#4ADE80] shadow-[5px_5px_0_#000]">
              <GraduationCap size={34} />
            </div>

            <h1 className="text-3xl font-black leading-tight">
              Manajemen Data Mahasiswa
            </h1>

            <p className="mt-2 text-sm font-bold">
              Login admin untuk masuk ke dashboard.
            </p>
          </div>

          <div className="mb-6 rounded-[24px] border-[4px] border-black bg-[#C4B5FD] p-5 shadow-[6px_6px_0_#000]">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border-[3px] border-black bg-white px-3 py-1 text-xs font-black shadow-[3px_3px_0_#000]">
              <Sparkles size={14} />
              ADMIN ACCESS
            </div>

            <h2 className="text-3xl font-black tracking-tight">Login Admin</h2>

            <p className="mt-2 text-sm font-bold">
              Masukkan akun admin untuk mengakses dashboard mahasiswa.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-[20px] border-[4px] border-black bg-[#FB7185] px-4 py-3 text-sm font-black shadow-[5px_5px_0_#000]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-wide">
                Username
              </span>

              <div className="flex h-13 min-h-13 items-center gap-3 rounded-[18px] border-[4px] border-black bg-[#FFF7D6] px-4 shadow-[5px_5px_0_#000] focus-within:bg-white">
                <UserRound size={20} className="shrink-0" />

                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Masukkan username"
                  className="w-full bg-transparent text-sm font-black outline-none placeholder:text-slate-500"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-wide">
                Password
              </span>

              <div className="flex h-13 min-h-13 items-center gap-3 rounded-[18px] border-[4px] border-black bg-[#FFF7D6] px-4 shadow-[5px_5px_0_#000] focus-within:bg-white">
                <Lock size={20} className="shrink-0" />

                <input
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  className="w-full bg-transparent text-sm font-black outline-none placeholder:text-slate-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-[12px] border-[3px] border-black bg-white shadow-[3px_3px_0_#000] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000] cursor-pointer"
                  aria-label="Toggle password"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            <button
              disabled={loading}
              className="h-13 min-h-13 w-full rounded-[18px] border-[4px] border-black bg-[#4ADE80] text-sm font-black shadow-[6px_6px_0_#000] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_#000] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Memproses..." : "Login"}
            </button>

            <div className="rounded-[18px] border-[4px] border-black bg-[#FFDE59] px-4 py-3 text-xs font-black shadow-[5px_5px_0_#000]">
              Demo akun: <b>admin</b> / <b>admin123</b>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
