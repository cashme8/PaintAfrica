import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="dashed-rule mt-24 bg-stock-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col justify-between gap-8 md:flex-row">
          <div className="max-w-sm">
            <p className="font-display text-lg font-semibold text-ink-700">PaintAfrica</p>
            <p className="mt-2 text-sm text-carbon-500">
              A marketplace connecting customers, designers, and printing businesses
              across Africa — from brief to finished product.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <p className="job-number text-xs text-carbon-500">Marketplace</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li><Link to="/catalog" className="text-carbon-700 hover:text-ink-600">Catalog</Link></li>
                <li><Link to="/how-it-works" className="text-carbon-700 hover:text-ink-600">How it works</Link></li>
              </ul>
            </div>
            <div>
              <p className="job-number text-xs text-carbon-500">Providers</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li><Link to="/register" className="text-carbon-700 hover:text-ink-600">List your business</Link></li>
                <li><Link to="/register" className="text-carbon-700 hover:text-ink-600">Join as a designer</Link></li>
              </ul>
            </div>
            <div>
              <p className="job-number text-xs text-carbon-500">Account</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li><Link to="/login" className="text-carbon-700 hover:text-ink-600">Log in</Link></li>
                <li><Link to="/register" className="text-carbon-700 hover:text-ink-600">Create account</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="dashed-rule mt-8 pt-6">
          <p className="job-number text-xs text-carbon-500">
            © {new Date().getFullYear()} PaintAfrica — Job No. PA-0001
          </p>
        </div>
      </div>
    </footer>
  );
}
