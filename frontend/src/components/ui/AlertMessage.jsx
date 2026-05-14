import { useEffect } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

export default function AlertMessage({ message, type = "success", onClose }) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose?.();
    }, 5000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  const bgColor = type === "error" ? "bg-[#FB7185]" : "bg-[#4ADE80]";

  return (
    <motion.section
      initial={{ opacity: 0, y: -12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.98 }}
      transition={{ duration: 0.18 }}
      className={`flex items-center justify-between gap-3 rounded-[24px] border-[4px] border-black ${bgColor} px-5 py-4 shadow-[6px_6px_0_#000]`}
    >
      <p className="text-sm font-black">{message}</p>

      <motion.button
        type="button"
        onClick={onClose}
        whileTap={{ scale: 0.92 }}
        whileHover={{
          x: 1,
          y: 1,
          boxShadow: "1px 1px 0 #000",
        }}
        className="cursor-pointer rounded-[12px] border-[3px] border-black bg-white p-1 shadow-[2px_2px_0_#000]"
      >
        <X size={16} />
      </motion.button>
    </motion.section>
  );
}
