import { AlertTriangle, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function ConfirmModal({
  open,
  title = "Konfirmasi",
  message = "Apakah kamu yakin ingin melanjutkan aksi ini?",
  confirmText = "Ya, lanjutkan",
  cancelText = "Batal",
  variant = "danger",
  loading = false,
  onConfirm,
  onClose,
}) {
  const variantClass = {
    danger: "bg-[#FB7185]",
    warning: "bg-[#FFDE59]",
    success: "bg-[#4ADE80]",
    info: "bg-[#60A5FA]",
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 24, rotate: -1 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20, rotate: 1 }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 24,
              mass: 0.7,
            }}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md rounded-[28px] border-[4px] border-black bg-white p-5 shadow-[10px_10px_0_#000]"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="flex items-center gap-5">
                <div
                  className={`grid h-15 w-15 shrink-0 place-items-center rounded-[18px] border-[4px] border-black shadow-[4px_4px_0_#000] ${
                    variantClass[variant] || variantClass.danger
                  }`}
                >
                  <AlertTriangle size={24} />
                </div>

                <div>
                  <h2 className="text-xl font-black">{title}</h2>
                  <p className="mt-2 text-sm font-semibold text-slate-700">
                    {message}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <motion.button
                type="button"
                onClick={onClose}
                disabled={loading}
                whileTap={{ scale: 0.96 }}
                whileHover={{
                  x: 2,
                  y: 2,
                  boxShadow: "2px 2px 0 #000",
                }}
                className="flex-1 cursor-pointer rounded-[18px] border-[4px] border-black bg-white px-4 py-3 text-sm font-black shadow-[4px_4px_0_#000] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {cancelText}
              </motion.button>

              <motion.button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                whileTap={{ scale: 0.96 }}
                whileHover={{
                  x: 2,
                  y: 2,
                  boxShadow: "2px 2px 0 #000",
                }}
                className={`flex-1 cursor-pointer rounded-[18px] border-[4px] border-black px-4 py-3 text-sm font-black shadow-[4px_4px_0_#000] disabled:cursor-not-allowed disabled:opacity-60 ${
                  variantClass[variant] || variantClass.danger
                }`}
              >
                {loading ? "Memproses..." : confirmText}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
