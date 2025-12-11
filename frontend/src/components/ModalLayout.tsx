import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
// shadcn/ui example imports (adjust paths if you use a different setup)

type ModalSize = "sm" | "md" | "lg" | "full";

interface ModalLayoutProps {
  open: boolean;
  onClose: () => void;
  title?: string | ReactNode;
  subtitle?: string | ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  closeOnOverlayClick?: boolean;
}

const sizeClass = (size: ModalSize) => {
  switch (size) {
    case "sm":
      return "max-w-md";
    case "md":
      return "max-w-2xl";
    case "lg":
      return "max-w-4xl";
    case "full":
      return "w-full h-full m-0 rounded-none";
    default:
      return "max-w-2xl";
  }
};

export default function ModalLayout({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = "md",
  closeOnOverlayClick = true,
}: ModalLayoutProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="modal-root"
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50"
            onClick={() => closeOnOverlayClick && onClose()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* modal panel */}
          <motion.div
            key="modal-panel"
            className={`relative z-10 mx-4 w-full ${sizeClass(size)} max-h-[90vh] overflow-hidden`}
            initial={{ y: 20, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 10, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className={`bg-white dark:bg-slate-900 shadow-2xl rounded-2xl overflow-hidden`}>
              {/* header */}
              <div className="flex items-start justify-between gap-4 p-4 border-b border-slate-100 dark:border-slate-800">
                <div className="min-w-0">
                  {title && (
                    <h3 className="text-lg font-semibold leading-6 text-slate-900 dark:text-slate-100 truncate">
                      {title}
                    </h3>
                  )}
                  {subtitle && (
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 truncate">{subtitle}</p>
                  )}
                </div>

                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="inline-flex h-8 w-8 items-center justify-center hover:bg-red-100 dark:hover:bg-slate-800 rounded-sm transition duration-300"
                >
                  <X size={16} />
                </button>
              </div>

              {/* body */}
              <div className="p-4 overflow-auto" style={{ maxHeight: "65vh" }}>
                {children}
              </div>

              {/* footer */}
              <div className="border-t border-slate-100 dark:border-slate-800 p-4 flex items-center justify-end gap-2">
                {footer}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
