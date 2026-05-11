import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, GraduationCap, User } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function Navbar({ authUser, onLogout }) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const initials = (authUser?.nama || "A")
    .split(" ")
    .filter(Boolean)
    .map((item) => item[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!dropdownRef.current) return;

      if (!dropdownRef.current.contains(event.target)) {
        setOpenDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="rounded-[28px] border-[4px] border-black bg-[#FFDE59] p-4 shadow-[8px_8px_0_#000] md:p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-[18px] border-[4px] border-black bg-[#4ADE80] shadow-[4px_4px_0_#000]">
            <GraduationCap size={30} />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-2xl font-black tracking-tight md:text-3xl">
              Manajemen Mahasiswa
            </h1>
          </div>
        </div>

        <div ref={dropdownRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setOpenDropdown((current) => !current)}
            className="flex cursor-pointer items-center gap-3 rounded-[20px] border-[4px] border-black bg-white px-4 py-3 shadow-[4px_4px_0_#000] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000]"
          >
            <div className="grid h-11 w-11 place-items-center rounded-full border-[3px] border-black bg-[#60A5FA] font-black">
              {initials || <User size={18} />}
            </div>

            <div className="hidden text-left lg:block">
              <b className="block max-w-44 truncate text-sm font-black">
                {authUser?.nama || "-"}
              </b>
              <span className="block text-xs font-semibold">
                {authUser?.role || "-"}
              </span>
            </div>

            <ChevronDown
              size={18}
              className={`transition ${openDropdown ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {openDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{
                  duration: 0.16,
                  ease: "easeOut",
                }}
                className="absolute top-full -right-2 z-50 mt-3 w-56 rounded-[20px] border-[4px] border-black bg-white p-2 shadow-[6px_6px_0_#000]"
              >
                <button
                  type="button"
                  onClick={onLogout}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-[14px] border-[3px] border-black bg-[#FF8DA1] px-4 py-3 text-left text-sm font-black shadow-[3px_3px_0_#000] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000]"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
