import { GraduationCap } from "lucide-react";

export default function AuthLayout({ mode, children }) {
  const isRegister = mode === "register";
  const isVerify = mode === "verify";

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
              {isRegister
                ? "Buat akun admin baru, lalu verifikasi email sebelum login."
                : isVerify
                  ? "Verifikasi akun menggunakan kode 6 digit dari Gmail."
                  : "Login sebagai admin untuk mengelola data mahasiswa, validasi, file I/O, pencarian, dan pengurutan data."}
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

        <div className="max-h-[92vh] overflow-y-auto bg-white p-5 sm:p-7">
          {children}
        </div>
      </section>
    </main>
  );
}
