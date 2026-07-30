import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { ApiStatusProvider } from "./context/ApiStatusContext";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <ApiStatusProvider>
            <AppRoutes />
          </ApiStatusProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
