import { useState, useEffect } from "react";
import CropCard from "../../components/common/CropCard";
import StatusBadge from "../../components/common/StatusBadge";
import Button from "../../components/common/Button";
import { useAuth } from "../../auth/AuthContext";
import { ordersApi } from "../../api/endpoints/orders.api";
import { supabase } from "../../lib/supabaseClient";
import { Link } from "react-router-dom";

const incomingOrders = [
  {
    id: "PA-2026-0421",
    customer: "Amina Nakato",
    service: "500 × A5 Flyers, full colour, gloss",
    status: "pending",
    createdAt: "2026-07-19",
  },
  {
    id: "PA-2026-0417",
    customer: "Brian Okello",
    service: "250 Business cards, matte",
    status: "quoted",
    createdAt: "2026-07-14",
  },
  {
    id: "PA-2026-0398",
    customer: "Grace Wanjiru",
    service: "Roll-up banner, 85×200cm",
    status: "in_production",
    createdAt: "2026-07-10",
  },
];

const stats = [
  { label: "Pending requests", value: 4 },
  { label: "In production", value: 2 },
  { label: "Completed this month", value: 11 },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [quoteDrafts, setQuoteDrafts] = useState({});
  const [fileDrafts, setFileDrafts] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    ordersApi
      .list()
      .then((res) => mounted && setOrders(res.data || []))
      .catch((err) => mounted && setError(err.message || "Could not load orders"))
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, []);

  async function sendQuote(id) {
    const amount = quoteDrafts[id];
    if (!amount) return;
    setError("");
    try {
      let fileUrl = null;
      const file = fileDrafts[id];
      if (file) {
        // validate pdf
        if (file.type !== "application/pdf") throw new Error("Only PDF quotes are accepted.");
        const path = `quotes/${id}/${Date.now()}_${file.name}`;
        const { error: upErr } = await supabase.storage.from("quotes").upload(path, file, {
          contentType: file.type,
        });
        if (upErr) throw upErr;
        const { data } = supabase.storage.from("quotes").getPublicUrl(path);
        fileUrl = data.publicUrl;
      }

      await ordersApi.sendQuote(id, Number(amount), fileUrl);
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "quoted", quote_file_url: fileUrl, quotedAmount: Number(amount) } : o)));
      setQuoteDrafts((d) => ({ ...d, [id]: "" }));
      setFileDrafts((d) => ({ ...d, [id]: null }));
    } catch (err) {
      setError(err.message || "Could not send quote");
    }
  }

  async function updateStatus(id, status) {
    try {
      await ordersApi.updateStatus(id, status);
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    } catch (err) {
      setError(err.message || "Could not update order");
    }
  }

  const source = orders.length > 0 ? orders : incomingOrders;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <p className="job-number text-xs text-ink-600">Business dashboard</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-carbon-900">
        Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}
      </h1>

      {error && (
        <div className="mt-4 rounded-sm bg-press-500/10 px-4 py-3 text-sm text-press-600">{error}</div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <CropCard key={s.label}>
            <p className="job-number text-3xl font-semibold text-ink-600">{s.value}</p>
            <p className="mt-1 text-sm text-carbon-500">{s.label}</p>
          </CropCard>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="font-display text-lg font-semibold text-carbon-900">Incoming orders</h2>
        {loading ? (
          <CropCard className="mt-4 py-8 text-center text-sm text-carbon-500">Loading orders…</CropCard>
        ) : (
          <div className="mt-4 flex flex-col gap-4">
            {source.map((o) => (
            <CropCard key={o.id}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="job-number text-xs text-carbon-500">{o.id}</p>
                  <p className="mt-1 text-sm font-medium text-carbon-900">{o.service}</p>
                  <p className="mt-1 text-xs text-carbon-500">
                    {o.customer} &middot; Requested {o.createdAt}
                  </p>
                </div>
                <StatusBadge status={o.status} />
              </div>

              <div className="dashed-rule mt-4 pt-4">
                {o.status === "pending" && (
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <input
                      type="number"
                      placeholder="Quote amount (FRW)"
                      value={quoteDrafts[o.id] ?? ""}
                      onChange={(e) => setQuoteDrafts((d) => ({ ...d, [o.id]: e.target.value }))}
                      className="w-full rounded-sm border border-stock-300 bg-stock-50 px-3 py-2 text-sm outline-none focus:border-ink-600 sm:w-48"
                    />
                    <label className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => setFileDrafts((d) => ({ ...d, [o.id]: e.target.files[0] }))}
                        className="hidden"
                        id={`file-${o.id}`}
                      />
                      <span className="text-sm text-carbon-500">Attach PDF quote</span>
                      <input
                        type="button"
                        value="Choose file"
                        onClick={() => document.getElementById(`file-${o.id}`).click()}
                        className="rounded-sm border px-3 py-1 text-sm"
                      />
                    </label>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => sendQuote(o.id)}>
                        Send quote
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => updateStatus(o.id, "rejected")}>
                        Decline
                      </Button>
                    </div>
                  </div>
                )}

                {o.status === "quoted" && (
                    <div>
                      <p className="text-xs text-carbon-500">Waiting on the customer to confirm your quote.</p>
                      {o.quote_file_url && (
                        <a href={o.quote_file_url} target="_blank" rel="noreferrer" className="text-sm text-ink-600 hover:underline">
                          View uploaded quote (PDF)
                        </a>
                      )}
                      <div className="mt-2">
                        <Link to={`/orders/${o.id}/chat`}>
                          <Button variant="ghost" size="sm">Open chat</Button>
                        </Link>
                      </div>
                    </div>
                )}

                {(o.status === "accepted" || o.status === "in_production") && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(o.id, "in_production")}
                      disabled={o.status === "in_production"}
                    >
                      Mark in production
                    </Button>
                    <Button size="sm" onClick={() => updateStatus(o.id, "ready")}>
                      Mark ready
                    </Button>
                    <Link to={`/orders/${o.id}/chat`}>
                      <Button variant="ghost" size="sm">Chat</Button>
                    </Link>
                  </div>
                )}
              </div>
            </CropCard>
          ))}
          </div>
        )}
      </div>
    </div>
  );
}
