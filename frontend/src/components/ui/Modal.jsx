import { useEffect } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function Modal({ open, title, children, onClose }) {
  useEffect(() => {
    if (!open) return;

    const handleKeydown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24, rotate: -1 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20, rotate: 1 }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 24,
              mass: 0.7,
            }}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-2xl max-h-[100vh] overflow-y-auto rounded-[28px] border-[4px] border-black bg-white p-5 shadow-[10px_10px_0_#000]"
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-xl font-black md:text-2xl">{title}</h2>

              <motion.button
                type="button"
                onClick={onClose}
                whileTap={{ scale: 0.92 }}
                whileHover={{
                  x: 2,
                  y: 2,
                  boxShadow: "2px 2px 0 #000",
                }}
                className="rounded-[14px] border-[3px] border-black bg-[#FF8DA1] p-2 shadow-[3px_3px_0_#000]"
              >
                <X size={18} />
              </motion.button>
            </div>

            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
