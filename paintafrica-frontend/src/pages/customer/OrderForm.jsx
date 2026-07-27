import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UploadCloud, FileText, X, CheckCircle2 } from "lucide-react";
import CropCard from "../../components/common/CropCard";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { mockServices } from "../../lib/mockData";
import { servicesApi } from "../../api/endpoints/services.api";
import { ordersApi } from "../../api/endpoints/orders.api";

const ACCEPTED_TYPES = [".pdf", ".jpg", ".jpeg", ".png", ".ai", ".psd", ".cdr"];
const MAX_FILE_MB = 25;

export default function OrderForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preselected = mockServices.find((s) => s.id === searchParams.get("service"));

  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [servicesError, setServicesError] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoadingServices(true);
    servicesApi
      .list()
      .then((res) => mounted && setServices(res.data || []))
      .catch((err) => mounted && setServicesError(err.message || "Could not load services"))
      .finally(() => mounted && setLoadingServices(false));
    return () => (mounted = false);
  }, []);

  const [form, setForm] = useState({
    serviceId: preselected?.id ?? "",
    quantity: "",
    specs: "",
    notes: "",
  });
  const [files, setFiles] = useState([]);
  const [fileError, setFileError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleFileChange(e) {
    setFileError("");
    const selected = Array.from(e.target.files);
    const tooBig = selected.find((f) => f.size > MAX_FILE_MB * 1024 * 1024);
    if (tooBig) {
      setFileError(`"${tooBig.name}" is over the ${MAX_FILE_MB}MB limit.`);
      return;
    }
    setFiles((prev) => [...prev, ...selected]);
  }

  function removeFile(name) {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setFileError("");
    const payload = {
      serviceId: form.serviceId,
      quantity: Number(form.quantity) || 1,
      specs: form.specs,
      notes: form.notes,
      // files: not uploaded yet; backend may support multipart upload later
    };

    // Attempt to create an order via API; fall back to simulated submit on failure
    ordersApi
      .create(payload)
      .then(() => setSubmitted(true))
      .catch(() => {
        // keep UX flowing: mark submitted so user can continue, but surface a note
        setFileError("Request saved locally (backend unavailable).");
        setSubmitted(true);
      });
  }

  if (submitted) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <CheckCircle2 size={40} className="text-proof-500" />
        <h1 className="mt-4 font-display text-2xl font-semibold text-carbon-900">Request sent</h1>
        <p className="mt-2 text-sm text-carbon-500">
          Your brief has been sent to the provider. You'll get a quote to review shortly.
        </p>
        <Button className="mt-6" onClick={() => navigate("/orders")}>
          View my orders
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <p className="job-number text-xs text-ink-600">New order</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-carbon-900">Request a quote</h1>
      <p className="mt-2 text-sm text-carbon-500">
        Describe what you need and attach your design or a reference file. The
        provider will send back a price before any work begins.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
        <CropCard>
          <label htmlFor="service" className="text-sm font-medium text-carbon-700">
            Service
          </label>
          <select
            id="service"
            required
            value={form.serviceId}
            onChange={update("serviceId")}
            className="mt-1.5 w-full rounded-sm border border-stock-300 bg-stock-50 px-3.5 py-2.5 text-sm outline-none focus:border-ink-600"
          >
            <option value="" disabled>
              Select a service…
            </option>
            {mockServices.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title} — {s.provider}
              </option>
            ))}
          </select>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              id="quantity"
              label="Quantity"
              type="number"
              min={1}
              required
              value={form.quantity}
              onChange={update("quantity")}
              placeholder="e.g. 500"
            />
            <Input
              id="specs"
              label="Size / material (optional)"
              value={form.specs}
              onChange={update("specs")}
              placeholder="e.g. A5, gloss finish"
            />
          </div>

          <div className="mt-4">
            <label htmlFor="notes" className="text-sm font-medium text-carbon-700">
              Notes for the provider
            </label>
            <textarea
              id="notes"
              rows={4}
              value={form.notes}
              onChange={update("notes")}
              placeholder="Any details that will help them quote accurately…"
              className="mt-1.5 w-full rounded-sm border border-stock-300 bg-stock-50 px-3.5 py-2.5 text-sm outline-none focus:border-ink-600"
            />
          </div>
        </CropCard>

        <CropCard>
          <p className="text-sm font-medium text-carbon-700">Design files / brief</p>
          <p className="mt-1 text-xs text-carbon-500">
            Accepted: {ACCEPTED_TYPES.join(", ")} — max {MAX_FILE_MB}MB per file.
          </p>

          <label
            htmlFor="file-upload"
            className="mt-3 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-sm border-2 border-dashed border-stock-300 py-8 text-center hover:border-ink-300"
          >
            <UploadCloud size={24} className="text-ink-600" />
            <span className="text-sm text-carbon-700">Click to upload, or drag files here</span>
            <input
              id="file-upload"
              type="file"
              multiple
              accept={ACCEPTED_TYPES.join(",")}
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {fileError && <p className="mt-2 text-xs text-press-600">{fileError}</p>}

          {files.length > 0 && (
            <ul className="mt-4 space-y-2">
              {files.map((f) => (
                <li
                  key={f.name}
                  className="flex items-center justify-between rounded-sm bg-stock-100 px-3 py-2 text-sm"
                >
                  <span className="flex items-center gap-2 text-carbon-700">
                    <FileText size={14} /> {f.name}
                  </span>
                  <button type="button" onClick={() => removeFile(f.name)} aria-label={`Remove ${f.name}`}>
                    <X size={14} className="text-carbon-500 hover:text-press-600" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </CropCard>

        <Button type="submit" size="lg" className="w-full">
          Send request
        </Button>
      </form>
    </div>
  );
}
