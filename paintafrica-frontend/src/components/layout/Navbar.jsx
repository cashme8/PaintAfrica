import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Printer } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";

const roleHome = {
  customer: "/orders",
  business: "/business/dashboard",
  designer: "/designer/portfolio",
  admin: "/admin/users",
};

export default function Navbar() {
  const { isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-ink-600" : "text-carbon-700 hover:text-ink-600"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-stock-300 bg-stock-50/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-ink-600 text-stock-50">
            <Printer size={18} strokeWidth={2} />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-ink-700">
            PaintAfrica
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <NavLink to="/catalog" className={navLinkClass}>
            Catalog
          </NavLink>
          <NavLink to="/how-it-works" className={navLinkClass}>
            How it works
          </NavLink>
          {isAuthenticated && (
            <NavLink to={roleHome[role] ?? "/"} className={navLinkClass}>
              Dashboard
            </NavLink>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="rounded-sm border border-ink-600 px-4 py-2 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-600 hover:text-stock-50"
            >
              Log out
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-carbon-700 hover:text-ink-600"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-sm bg-ink-600 px-4 py-2 text-sm font-medium text-stock-50 transition-colors hover:bg-ink-700"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-stock-300 bg-stock-50 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <NavLink to="/catalog" className={navLinkClass} onClick={() => setOpen(false)}>
              Catalog
            </NavLink>
            <NavLink to="/how-it-works" className={navLinkClass} onClick={() => setOpen(false)}>
              How it works
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink
                  to={roleHome[role] ?? "/"}
                  className={navLinkClass}
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="w-fit rounded-sm border border-ink-600 px-4 py-2 text-sm font-medium text-ink-600"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-carbon-700" onClick={() => setOpen(false)}>
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="w-fit rounded-sm bg-ink-600 px-4 py-2 text-sm font-medium text-stock-50"
                  onClick={() => setOpen(false)}
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
