import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function BrutalSelect({
  value,
  onChange,
  options = [],
  placeholder = "Pilih opsi",
  menuPlacement = "bottom",
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const selectedOption = options.find((item) => item.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!wrapperRef.current) return;

      if (!wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const menuPositionClass =
    menuPlacement === "top"
      ? "bottom-[calc(100%+12px)]"
      : "top-[calc(100%+12px)]";

  const menuAnimation =
    menuPlacement === "top"
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
    <div ref={wrapperRef} className="relative">
      <motion.button
        type="button"
        onClick={() => setOpen((current) => !current)}
        whileTap={{ scale: 0.98 }}
        whileHover={{
          x: 2,
          y: 2,
          boxShadow: "2px 2px 0 #000",
        }}
        className="flex h-12 w-full items-center justify-between rounded-[18px] border-[4px] border-black bg-white px-4 text-sm font-black shadow-[4px_4px_0_#000] outline-none"
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.18 }}
          className="shrink-0"
        >
          <ChevronDown
            size={18}
            className={`shrink-0 transition ${open ? "rotate-180" : ""}`}
          />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={menuAnimation.initial}
            animate={menuAnimation.animate}
            exit={menuAnimation.exit}
            transition={{
              duration: 0.16,
              ease: "easeOut",
            }}
            className={`absolute left-0 right-0 z-[9999] ${menuPositionClass} rounded-[20px] border-[4px] border-black bg-[#FFF7D6] p-2 shadow-[6px_6px_0_#000]`}
          >
            <div className="max-h-[content]">
              {options.map((item) => {
                const active = item.value === value;

                return (
                  <motion.button
                    key={item.value}
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    whileHover={{
                      x: 1,
                      y: 1,
                      boxShadow: "2px 2px 0 #000",
                    }}
                    onClick={() => {
                      onChange(item.value);
                      setOpen(false);
                    }}
                    className={`mb-2 flex w-full items-center justify-between rounded-[14px] border-[3px] border-black px-4 py-3 text-left text-sm font-black shadow-[3px_3px_0_#000] transition last:mb-0 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#000] cursor-pointer ${
                      active
                        ? "bg-[#4ADE80]"
                        : "bg-white hover:bg-[#FFDE59] cursor-pointer"
                    }`}
                  >
                    <span>{item.label}</span>
                    {active && <Check size={16} />}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
