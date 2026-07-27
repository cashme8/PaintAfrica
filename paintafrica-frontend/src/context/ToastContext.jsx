import { createContext, useContext, useState, useCallback } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

const ToastContext = createContext(undefined);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(
    ({ message, type = "info", duration = 4000 }) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type }]);
      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }
      return id;
    },
    []
  );

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}

function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 space-y-3">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

function Toast({ toast, onRemove }) {
  const { type, message, id } = toast;

  const bgClass = {
    success: "bg-proof-500 text-stock-50",
    error: "bg-press-500 text-stock-50",
    info: "bg-ink-600 text-stock-50",
    warning: "bg-marigold-500 text-stock-50",
  }[type] || "bg-ink-600 text-stock-50";

  const Icon = {
    success: CheckCircle2,
    error: AlertCircle,
    info: AlertCircle,
    warning: AlertCircle,
  }[type] || AlertCircle;

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 rounded-sm px-4 py-3 text-sm font-medium shadow-lg ${bgClass}`}
    >
      <Icon size={16} />
      <span>{message}</span>
      <button
        onClick={() => onRemove(id)}
        className="ml-auto opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}
