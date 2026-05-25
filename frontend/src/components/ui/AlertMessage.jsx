import { useEffect } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

export default function AlertMessage({ message, type = "success", onClose }) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  const bgColor = type === "error" ? "bg-[#FB7185]" : "bg-[#4ADE80]";

  return (
    <motion.section
      role="alert"
      initial={{ opacity: 0, x: 24, y: -12, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 24, y: -12, scale: 0.96 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`fixed right-4 top-4 z-[9999] flex w-[calc(100%-2rem)] max-w-[fit-content] items-center justify-between gap-3 rounded-[24px] border-[4px] border-black ${bgColor} px-5 py-4 shadow-[6px_6px_0_#000] sm:right-6 sm:top-6 sm:w-full`}
    >
      <p className="flex-1 break-words text-sm font-black leading-5">
        {message}
      </p>
    </motion.section>
  );
}
