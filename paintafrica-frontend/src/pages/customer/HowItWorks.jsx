import { Link } from "react-router-dom";
import CropCard from "../../components/common/CropCard";
import Button from "../../components/common/Button";

const steps = [
  {
    n: "01",
    title: "Submit your brief",
    body: "Choose a service from the catalog, tell us your quantity and specs, and attach your design or reference file (PDF, JPG, PNG, AI, PSD, CDR — up to 25MB).",
  },
  {
    n: "02",
    title: "Get a quote",
    body: "The printing business or designer reviews your brief and sends back a price. You only pay once you accept it — no surprises.",
  },
  {
    n: "03",
    title: "Track production",
    body: "Once accepted, follow your order through in production and ready for pickup. Message the provider directly if you need to check on anything.",
  },
  {
    n: "04",
    title: "Pay & collect",
    body: "Payment is handled directly with the provider (cash or mobile money) when your order is ready.",
  },
];

export default function HowItWorks() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="job-number text-xs text-ink-600">The process</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-carbon-900">How PaintAfrica works</h1>
      <p className="mt-3 text-sm text-carbon-500">
        A straightforward path from brief to finished product, with a vetted
        provider handling the work at every step.
      </p>

      <div className="mt-10 flex flex-col gap-4">
        {steps.map((s) => (
          <CropCard key={s.n} className="flex gap-4">
            <span className="job-number text-lg font-semibold text-marigold-600">{s.n}</span>
            <div>
              <h3 className="font-display text-base font-semibold text-carbon-900">{s.title}</h3>
              <p className="mt-1 text-sm text-carbon-500">{s.body}</p>
            </div>
          </CropCard>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Link to="/catalog">
          <Button size="lg">Browse the catalog</Button>
        </Link>
      </div>
    </div>
  );
}
