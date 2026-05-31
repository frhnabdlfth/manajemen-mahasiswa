export default function AuthLayout({ children, variant = "login" }) {
  const maxWidthClass =
    variant === "register" ? "max-w-[1000px]" : "max-w-[500px]";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FFF7D6] px-4 py-6 text-slate-950 sm:px-6">
      <div className="pointer-events-none absolute -left-20 top-24 h-36 w-36 rounded-full border-[4px] border-black bg-[#4ADE80] shadow-[8px_8px_0_#000] sm:h-44 sm:w-44" />

      <div className="pointer-events-none absolute -right-20 bottom-10 h-40 w-40 rotate-12 border-[4px] border-black bg-[#60A5FA] shadow-[8px_8px_0_#000] sm:h-52 sm:w-52" />

      <div className="pointer-events-none absolute right-6 top-6 h-24 w-24 rounded-full border-[4px] border-black bg-[#C4B5FD] shadow-[6px_6px_0_#000] sm:right-16 sm:h-36 sm:w-36" />

      <div className="pointer-events-none absolute bottom-32 left-1/2 hidden h-24 w-24 -translate-x-1/2 rotate-45 border-[4px] border-black bg-[#FFDE59] shadow-[7px_7px_0_#000] md:block" />

      <section
        className={`relative z-10 w-full ${maxWidthClass} overflow-hidden rounded-[32px] border-[5px] border-black bg-white shadow-[12px_12px_0_#000]`}
      >
        <div className="max-h-[92vh] overflow-y-auto p-5 sm:p-7">
          {children}
        </div>
      </section>
    </main>
  );
}
