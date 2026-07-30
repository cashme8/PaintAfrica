import { createContext, useContext, useMemo, useState, useEffect } from "react";
import axios from "axios";

const ApiStatusContext = createContext(null);

export function ApiStatusProvider({ children }) {
  const [status, setStatus] = useState({ connected: false, checked: false, baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1" });

  useEffect(() => {
    let mounted = true;

    axios
      .get(`${status.baseUrl.replace(/\/api\/v1$/, "")}/health`, { timeout: 3000 })
      .then(() => {
        if (mounted) setStatus((prev) => ({ ...prev, connected: true, checked: true }));
      })
      .catch(() => {
        if (mounted) setStatus((prev) => ({ ...prev, connected: false, checked: true }));
      });

    return () => {
      mounted = false;
    };
  }, [status.baseUrl]);

  const value = useMemo(() => status, [status]);

  return <ApiStatusContext.Provider value={value}>{children}</ApiStatusContext.Provider>;
}

export function useApiStatus() {
  const context = useContext(ApiStatusContext);
  if (!context) {
    throw new Error("useApiStatus must be used inside ApiStatusProvider");
  }
  return context;
}
