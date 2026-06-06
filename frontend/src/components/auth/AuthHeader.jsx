import { GraduationCap, Sparkles } from "lucide-react";

export default function AuthHeader({ mode }) {
  const isRegister = mode === "register";
  const isVerify = mode === "verify";

  const title = isRegister
    ? "Register Akun Baru"
    : isVerify
      ? "Verifikasi Email"
      : "Manajemen Mahasiswa";

  const subtitle = isRegister
    ? "Buat akun baru dan cek email untuk kode verifikasi"
    : isVerify
      ? "Masukkan email dan kode 6 digit yang dikirim ke Gmail"
      : "Masukkan email dan password";

  return (
    <>
      <div className="mb-7 lg:hidden">
        <div className="mb-4 inline-grid h-16 w-16 place-items-center rounded-[20px] border-[4px] border-black bg-[#4ADE80] shadow-[5px_5px_0_#000]">
          <GraduationCap size={34} />
        </div>

        <h1 className="text-3xl font-black leading-tight">
          Manajemen Data Mahasiswa
        </h1>

        <p className="mt-2 text-sm font-bold">
          {isRegister
            ? "Daftar akun baru"
            : isVerify
              ? "Verifikasi email akun"
              : "Login untuk masuk ke dashboard"}
        </p>
      </div>

      <div className="mb-2 rounded-[24px] border-[4px] border-black bg-[#C4B5FD] p-5 shadow-[6px_6px_0_#000]">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border-[3px] border-black bg-white px-3 py-1 text-xs font-black shadow-[3px_3px_0_#000]">
          <Sparkles size={14} />
          {isRegister
            ? "REGISTER ACCESS"
            : isVerify
              ? "VERIFY ACCESS"
              : "LOGIN ACCESS"}
        </div>

        <h2 className="text-3xl font-black tracking-tight">{title}</h2>
        <p className="text-sm font-bold">{subtitle}</p>
      </div>
    </>
  );
}
