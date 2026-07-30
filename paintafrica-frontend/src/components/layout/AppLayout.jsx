import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useApiStatus } from "../../context/ApiStatusContext";

export default function AppLayout() {
  const { connected, checked, baseUrl } = useApiStatus();

  return (
    <div className="flex min-h-screen flex-col bg-stock-100">
      <Navbar />
      {checked && (
        <div className={`border-b px-4 py-2 text-center text-xs ${connected ? "bg-proof-500/10 text-proof-700" : "bg-press-500/10 text-press-600"}`}>
          API status: {connected ? "connected to local backend" : "backend unavailable"} • {baseUrl}
        </div>
      )}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
