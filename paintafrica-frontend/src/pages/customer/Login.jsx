import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Printer } from "lucide-react";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { useAuth } from "../../auth/AuthContext";

const roleHome = {
  customer: "/orders",
  business: "/business/dashboard",
  designer: "/designer/portfolio",
  admin: "/admin/users",
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { user } = await login(form);
      const role = user?.user_metadata?.role;
      const redirectTo = location.state?.from?.pathname || roleHome[role] || "/";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || "Could not log in. Check your details and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <div className="mb-8 flex flex-col items-center text-center">
        <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-ink-600 text-stock-50">
          <Printer size={20} />
        </span>
        <h1 className="mt-4 font-display text-2xl font-semibold text-carbon-900">Welcome back</h1>
        <p className="mt-1 text-sm text-carbon-500">Log in to track orders or manage your dashboard.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={update("email")}
          placeholder="you@example.com"
        />
        <Input
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          value={form.password}
          onChange={update("password")}
          placeholder="••••••••"
        />

        {error && (
          <p className="rounded-sm bg-press-500/10 px-3 py-2 text-sm text-press-600">{error}</p>
        )}

        <Button type="submit" disabled={loading} className="mt-2 w-full">
          {loading ? "Logging in…" : "Log in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-carbon-500">
        New to PaintAfrica?{" "}
        <Link to="/register" className="font-medium text-ink-600 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
