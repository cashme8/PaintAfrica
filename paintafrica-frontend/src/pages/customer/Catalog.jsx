import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin } from "lucide-react";
import CropCard from "../../components/common/CropCard";
import Button from "../../components/common/Button";
import { mockServices, categories } from "../../lib/mockData";
import { formatFRW } from "../../lib/formatCurrency";
import { servicesApi } from "../../api/endpoints/services.api";

export default function Catalog() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    servicesApi
      .list()
      .then((res) => {
        if (!mounted) return;
        setServices(res.data || []);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || "Could not load services.");
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const source = services.length > 0 ? services : mockServices;

  const filtered = useMemo(() => {
    return source.filter((s) => {
      const matchesCategory = category === "All" || s.category === category;
      const matchesQuery =
        query.trim() === "" ||
        s.title.toLowerCase().includes(query.toLowerCase()) ||
        s.provider.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [category, query, source]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <p className="job-number text-xs text-ink-600">Catalog</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-carbon-900">
          Browse printing & design services
        </h1>
        <p className="mt-2 text-sm text-carbon-500">
          Prices shown are starting estimates — providers send a final quote based on your specs.
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-carbon-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services or providers…"
            className="w-full rounded-sm border border-stock-300 bg-stock-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-ink-600"
          />
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-sm px-3 py-1.5 text-sm font-medium transition-colors ${
              category === c
                ? "bg-ink-600 text-stock-50"
                : "bg-stock-50 text-carbon-700 border border-stock-300 hover:border-ink-300"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <CropCard className="py-12 text-center text-sm text-carbon-500">
          No services match your search yet. Try a different category or term.
        </CropCard>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <CropCard key={s.id} className="flex flex-col justify-between">
              <div>
                <span className="job-number text-xs text-ink-600">{s.category}</span>
                <h3 className="mt-2 font-display text-base font-semibold text-carbon-900">{s.title}</h3>
                <p className="mt-1 flex items-center gap-1 text-xs text-carbon-500">
                  <MapPin size={12} /> {s.provider} &middot; {s.location}
                </p>
              </div>

              <div className="dashed-rule mt-5 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-carbon-500">From</p>
                    <p className="job-number text-sm font-semibold text-ink-600">
                      {formatFRW(s.startingPrice)} <span className="font-normal text-carbon-500">/ {s.priceUnit}</span>
                    </p>
                  </div>
                  <Button size="sm" onClick={() => navigate(`/order/new?service=${s.id}`)}>
                    Request quote
                  </Button>
                </div>
              </div>
            </CropCard>
          ))}
        </div>
      )}
    </div>
  );
}
