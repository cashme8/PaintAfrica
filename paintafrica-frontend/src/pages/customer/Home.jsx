import { Link } from "react-router-dom";
import {
  FileText,
  Image as ImageIcon,
  CreditCard,
  BookOpen,
  Flag,
  IdCard,
  Shirt,
  Building2,
  Palette,
  ArrowRight,
  Check,
} from "lucide-react";
import CropCard from "../../components/common/CropCard";
import Button from "../../components/common/Button";

const categories = [
  { name: "Flyers", icon: FileText },
  { name: "Posters", icon: ImageIcon },
  { name: "Business cards", icon: CreditCard },
  { name: "Brochures", icon: BookOpen },
  { name: "Banners", icon: Flag },
  { name: "PVC cards", icon: IdCard },
  { name: "Clothing branding", icon: Shirt },
  { name: "Corporate branding", icon: Building2 },
  { name: "Graphic design", icon: Palette },
];

const jobStages = ["Pending", "Quoted", "Accepted", "In production", "Ready"];

const steps = [
  {
    n: "01",
    title: "Submit your brief",
    body: "Tell us what you need — flyers, banners, branded clothing — and attach your design or a description.",
  },
  {
    n: "02",
    title: "Get a quote",
    body: "A vetted printing business or designer reviews your brief and sends back a price.",
  },
  {
    n: "03",
    title: "Track it to delivery",
    body: "Approve the quote, and follow your job from accepted to in production to ready for pickup.",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="job-number text-xs text-ink-600">Job No. PA-0001 — Print & Design Marketplace</p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-carbon-900 sm:text-5xl">
              From brief to <span className="text-ink-600">finished print</span>, without the back and forth.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-carbon-500">
              PaintAfrica connects you with vetted printing businesses and graphic
              designers near you — for flyers, banners, business cards, branded
              clothing, and everything in between.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/catalog">
                <Button size="lg">
                  Start an order <ArrowRight size={16} />
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg">
                  List your business
                </Button>
              </Link>
            </div>
          </div>

          {/* Signature element: a job-ticket style order preview */}
          <CropCard className="ml-auto w-full max-w-md shadow-[0_4px_24px_rgba(32,43,107,0.08)]">
            <div className="flex items-center justify-between">
              <p className="job-number text-xs text-carbon-500">Order · PA-2026-0417</p>
              <span className="job-number rounded-sm bg-marigold-400/25 px-2 py-1 text-xs font-semibold text-marigold-600">
                Quoted
              </span>
            </div>
            <div className="dashed-rule my-4" />
            <p className="text-sm font-medium text-carbon-900">500 × A5 Flyers, full colour, gloss</p>
            <p className="mt-1 text-sm text-carbon-500">KampalaPrints &middot; Kampala</p>

            <div className="mt-6 space-y-3">
              {jobStages.map((stage, i) => (
                <div key={stage} className="flex items-center gap-3">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                      i <= 1
                        ? "bg-ink-600 text-stock-50"
                        : "border border-stock-300 text-carbon-500"
                    }`}
                  >
                    {i <= 1 ? <Check size={12} /> : i + 1}
                  </span>
                  <span className={`text-sm ${i <= 1 ? "text-carbon-900" : "text-carbon-500"}`}>
                    {stage}
                  </span>
                </div>
              ))}
            </div>

            <div className="dashed-rule mt-6 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-carbon-500">Quoted amount</span>
                <span className="job-number text-sm font-semibold text-ink-600">UGX 185,000</span>
              </div>
            </div>
          </CropCard>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="job-number text-xs text-ink-600">What we print</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-carbon-900">Browse by category</h2>
          </div>
          <Link to="/catalog" className="hidden text-sm font-medium text-ink-600 hover:underline sm:block">
            View full catalog →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
          {categories.map(({ name, icon: Icon }) => (
            <Link key={name} to="/catalog">
              <CropCard className="flex h-full flex-col gap-3 hover:border-ink-300">
                <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-ink-50 text-ink-600">
                  <Icon size={18} />
                </span>
                <span className="text-sm font-medium text-carbon-900">{name}</span>
              </CropCard>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-ink-600 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="job-number text-xs text-marigold-400">The process</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-stock-50">How PaintAfrica works</h2>

          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {steps.map((step) => (
              <div key={step.n}>
                <p className="job-number text-sm text-marigold-400">{step.n}</p>
                <h3 className="mt-3 font-display text-lg font-semibold text-stock-50">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-100">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Provider CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <CropCard className="flex flex-col items-start gap-6 bg-stock-50 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-xl font-semibold text-carbon-900">
              Run a print shop or work as a designer?
            </h3>
            <p className="mt-2 max-w-md text-sm text-carbon-500">
              List your services on PaintAfrica and start receiving order requests
              from customers looking for exactly what you offer.
            </p>
          </div>
          <Link to="/register">
            <Button variant="accent" size="lg">
              Join as a provider
            </Button>
          </Link>
        </CropCard>
      </section>
    </div>
  );
}
