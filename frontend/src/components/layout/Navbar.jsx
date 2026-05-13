import { useEffect, useRef, useState } from "react";
import {
  LogOut,
  GraduationCap,
  User,
  LayoutDashboard,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar({ authUser, onLogout }) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

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

  const navItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      label: "Mahasiswa",
      path: "/mahasiswa",
      icon: <Users size={18} />,
    },
  ];

  return (
    <header className="space-y-5">
      <div className="rounded-[28px] border-[4px] border-black bg-[#FFDE59] p-4 shadow-[8px_8px_0_#000] md:p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3 md:gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[16px] border-[4px] border-black bg-[#4ADE80] shadow-[4px_4px_0_#000] md:h-14 md:w-14 md:rounded-[18px]">
              <GraduationCap size={28} className="md:hidden" />
              <GraduationCap size={30} className="hidden md:block" />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-xl font-black tracking-tight sm:text-2xl md:hidden">
                M-Mahasiswa
              </h1>

              <h1 className="hidden truncate text-2xl font-black tracking-tight md:block md:text-3xl">
                Manajemen Mahasiswa
              </h1>
            </div>
          </div>

          <div ref={dropdownRef} className="relative shrink-0">
            <button
              type="button"
              onClick={() => setOpenDropdown((current) => !current)}
              className="flex cursor-pointer items-center gap-2 rounded-[18px] border-[4px] border-black bg-white p-2 shadow-[4px_4px_0_#000] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] lg:rounded-[20px] lg:px-4 lg:py-3"
            >
              <div className="grid h-10 w-10 place-items-center rounded-full border-[3px] border-black bg-[#60A5FA] text-sm font-black md:h-11 md:w-11 md:text-base">
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
                  className="absolute top-full right-0 z-50 mt-3 w-56 rounded-[20px] border-[4px] border-black bg-white p-2 shadow-[6px_6px_0_#000]"
                >
                  <div className="mb-2 rounded-[16px] border-[3px] border-black bg-[#FFF7D6] px-4 py-3 lg:hidden">
                    <b className="block truncate text-sm font-black">
                      {authUser?.nama || "-"}
                    </b>
                    <span className="block text-xs font-semibold">
                      {authUser?.role || "-"}
                    </span>
                  </div>

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
      </div>

      <nav className="grid grid-cols-2 gap-2 rounded-[24px] border-[4px] border-black bg-white p-2 shadow-[6px_6px_0_#000] md:flex md:w-full md:items-center md:rounded-[22px]">
        {navItems.map((item) => {
          const active = location.pathname === item.path;

          return (
            <button
              key={item.path}
              type="button"
              onClick={() => navigate(item.path)}
              className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-[18px] border-[3px] border-black px-4 py-3 text-sm font-black transition md:min-w-40 ${
                active
                  ? "bg-[#93C5FD] shadow-[3px_3px_0_#000]"
                  : "bg-[#FFF7D6] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000]"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
