import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, GraduationCap, User } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar({ authUser, onLogout }) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const initials = (authUser?.nama || "A")
    .split(" ")
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

  const menuAnimation = openDropdown
    ? {
        initial: { opacity: 0, y: 10, scale: 0.96 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 10, scale: 0.96 },
      }
    : {
        initial: { opacity: 0, y: -10, scale: 0.96 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -10, scale: 0.96 },
      };

  return (
    <header className="rounded-[28px] border-[4px] border-black bg-[#FFDE59] p-4 shadow-[8px_8px_0_#000] md:p-5">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-[18px] border-[4px] border-black bg-[#4ADE80] shadow-[4px_4px_0_#000]">
            <GraduationCap size={30} />
          </div>

          <div>
            <h1 className="text-2xl font-black tracking-tight md:text-3xl">
              Manajemen Mahasiswa
            </h1>
          </div>
        </div>

        <div ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setOpenDropdown((current) => !current)}
            className="flex items-center gap-3 rounded-[20px] border-[4px] border-black bg-white px-4 py-3 shadow-[4px_4px_0_#000] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] cursor-pointer"
          >
            <div className="grid h-11 w-11 place-items-center rounded-full border-[3px] border-black bg-[#60A5FA] font-black">
              {initials || <User size={18} />}
            </div>

            <div className="text-left lg:inline hidden">
              <b className="block text-sm font-black">{authUser?.nama}</b>
              <span className="block text-xs font-semibold">
                {authUser?.role}
              </span>
            </div>
          </button>

          {openDropdown && (
            <motion.div
              initial={menuAnimation.initial}
              animate={menuAnimation.animate}
              exit={menuAnimation.exit}
              transition={{
                duration: 0.16,
                ease: "easeOut",
              }}
              className="absolute right-10 lg:right-15 z-20 mt-3 w-56 rounded-[20px] border-[4px] border-black bg-white p-2 shadow-[6px_6px_0_#000]"
            >
              <button
                type="button"
                onClick={onLogout}
                className="flex w-full items-center gap-3 rounded-[14px] border-[3px] border-black bg-[#FF8DA1] px-4 py-3 text-left text-sm font-black shadow-[3px_3px_0_#000] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000] cursor-pointer"
              >
                <LogOut size={18} />
                Logout
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
}
