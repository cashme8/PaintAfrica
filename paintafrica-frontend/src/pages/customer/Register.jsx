import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Printer, ShoppingBag, Building2, Palette } from "lucide-react";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { useAuth } from "../../auth/AuthContext";

const roles = [
  { value: "customer", label: "Customer", desc: "I want to order printing or design work", icon: ShoppingBag },
  { value: "business", label: "Printing business", desc: "I run a print shop", icon: Building2 },
  { value: "designer", label: "Designer", desc: "I offer graphic design services", icon: Palette },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", role: "customer" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Could not create your account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <h1 className="font-display text-2xl font-semibold text-carbon-900">Check your email</h1>
        <p className="mt-3 text-sm text-carbon-500">
          We've sent a confirmation link to <strong>{form.email}</strong>. Confirm your
          email, then log in to get started.
        </p>
        <Link to="/login" className="mt-6">
          <Button>Go to login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <div className="mb-8 flex flex-col items-center text-center">
        <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-ink-600 text-stock-50">
          <Printer size={20} />
        </span>
        <h1 className="mt-4 font-display text-2xl font-semibold text-carbon-900">Create your account</h1>
        <p className="mt-1 text-sm text-carbon-500">Join PaintAfrica as a customer, business, or designer.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {roles.map(({ value, label, desc, icon: Icon }) => (
            <button
              type="button"
              key={value}
              onClick={() => setForm((f) => ({ ...f, role: value }))}
              className={`flex flex-col items-start gap-2 rounded-sm border p-3 text-left transition-colors ${
                form.role === value
                  ? "border-ink-600 bg-ink-50"
                  : "border-stock-300 bg-stock-50 hover:border-ink-300"
              }`}
            >
              <Icon size={18} className={form.role === value ? "text-ink-600" : "text-carbon-500"} />
              <span className="text-sm font-medium text-carbon-900">{label}</span>
              <span className="text-xs text-carbon-500">{desc}</span>
            </button>
          ))}
        </div>

        <Input
          id="fullName"
          label={form.role === "business" ? "Business owner name" : "Full name"}
          required
          value={form.fullName}
          onChange={update("fullName")}
          placeholder="Amina Nakato"
        />
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
          autoComplete="new-password"
          required
          minLength={8}
          value={form.password}
          onChange={update("password")}
          placeholder="At least 8 characters"
        />

        {error && (
          <p className="rounded-sm bg-press-500/10 px-3 py-2 text-sm text-press-600">{error}</p>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-carbon-500">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-ink-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
