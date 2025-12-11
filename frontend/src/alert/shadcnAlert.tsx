import { createContext, useContext, useState, ReactNode } from 'react';
import {  CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// Types
type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertConfig {
  open: boolean;
  type: AlertType;
  title: string;
  message: string;
  showCancel: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface SweetAlertContextType {
  showAlert: (
    type: AlertType,
    title: string,
    message: string,
    options?: {
      showCancel?: boolean;
      onConfirm?: () => void;
      onCancel?: () => void;
    }
  ) => void;
}

// Context
const SweetAlertContext = createContext<SweetAlertContextType | undefined>(undefined);

// Hook untuk menggunakan alert
export const useSweetAlert = () => {
  const context = useContext(SweetAlertContext);
  if (!context) {
    throw new Error('useSweetAlert must be used within SweetAlertProvider');
  }
  return context;
};

// Provider Component
export const SweetAlertProvider = ({ children }: { children: ReactNode }) => {
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    open: false,
    type: 'success',
    title: '',
    message: '',
    showCancel: false,
  });

  const showAlert = (
    type: AlertType,
    title: string,
    message: string,
    options?: {
      showCancel?: boolean;
      onConfirm?: () => void;
      onCancel?: () => void;
    }
  ) => {
    setAlertConfig({
      open: true,
      type,
      title,
      message,
      showCancel: options?.showCancel || false,
      onConfirm: options?.onConfirm,
      onCancel: options?.onCancel,
    });
  };

  const handleConfirm = () => {
    if (alertConfig.onConfirm) {
      alertConfig.onConfirm();
    }
    closeAlert();
  };

  const handleCancel = () => {
    if (alertConfig.onCancel) {
      alertConfig.onCancel();
    }
    closeAlert();
  };

  const closeAlert = () => {
    setAlertConfig(prev => ({ ...prev, open: false }));
  };

  const getIcon = (type: AlertType) => {
    const iconClasses = "w-16 h-16 mx-auto mb-4";
    const iconVariants = {
      initial: { scale: 0, rotate: -180 },
      animate: {
        scale: 1,
        rotate: 0,
        transition: {
          type: "spring" as const,
          stiffness: 260,
          damping: 20,
        },
      },
    };

    const icons = {
      success: <CheckCircle className={`${iconClasses} text-green-500`} />,
      error: <XCircle className={`${iconClasses} text-red-500`} />,
      warning: <AlertTriangle className={`${iconClasses} text-yellow-500`} />,
      info: <Info className={`${iconClasses} text-blue-500`} />,
    };

    return (
      <motion.div variants={iconVariants} initial="initial" animate="animate">
        {icons[type]}
      </motion.div>
    );
  };

  return (
    <SweetAlertContext.Provider value={{ showAlert }}>
      {children}
      <AlertDialog open={alertConfig.open} onOpenChange={closeAlert}>
        <AnimatePresence>
          {alertConfig.open && (
            <AlertDialogContent className="max-w-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{
                  type: "spring" as const,
                  stiffness: 300,
                  damping: 25,
                }}
              >
                <AlertDialogHeader>
                  <div className="flex flex-col items-center">
                    {getIcon(alertConfig.type)}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <AlertDialogTitle className="text-2xl text-center">
                        {alertConfig.title}
                      </AlertDialogTitle>
                    </motion.div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <AlertDialogDescription className="text-center text-base mt-2 mb-5">
                      {alertConfig.message}
                    </AlertDialogDescription>
                  </motion.div>
                </AlertDialogHeader>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                    {alertConfig.showCancel && (
                      <AlertDialogCancel onClick={handleCancel} className="w-full">
                        Batal
                      </AlertDialogCancel>
                    )}
                    <AlertDialogAction
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                      onClick={handleConfirm}
                    >
                      OK
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </motion.div>
              </motion.div>
            </AlertDialogContent>
          )}
        </AnimatePresence>
      </AlertDialog>
    </SweetAlertContext.Provider>
  );
};