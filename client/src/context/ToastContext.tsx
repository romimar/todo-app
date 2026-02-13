import { createContext, useContext, useCallback, type ReactNode } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

interface ToastContextType {
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
    warning: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const success = useCallback((message: string) => toast.success(message), []);
    const error = useCallback((message: string) => toast.error(message), []);
    const info = useCallback((message: string) => toast.info(message), []);
    const warning = useCallback((message: string) => toast.warning(message), []);

    return (
        <ToastContext.Provider value={{ success, error, info, warning }}>
            {children}
            <Toaster position="top-right" richColors className="pointer-events-auto" />
        </ToastContext.Provider>
    );
};

export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};
