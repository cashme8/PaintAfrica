import { Link } from "react-router-dom";
import { PackageOpen } from "lucide-react";
import { useEffect, useState } from "react";
import CropCard from "../../components/common/CropCard";
import StatusBadge from "../../components/common/StatusBadge";
import Button from "../../components/common/Button";
import { mockOrders } from "../../lib/mockData";
import { ordersApi } from "../../api/endpoints/orders.api";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    ordersApi
      .list()
      .then((res) => mounted && setOrders(res.data || []))
      .catch((err) => mounted && setError(err.message || "Could not load orders."))
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, []);

  const source = orders.length > 0 ? orders : mockOrders;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="job-number text-xs text-ink-600">Your account</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-carbon-900">My orders</h1>
        </div>
        <Link to="/catalog">
          <Button variant="outline" size="sm">
            New order
          </Button>
        </Link>
      </div>

      {loading ? (
        <CropCard className="py-12 text-center text-sm text-carbon-500">Loading orders…</CropCard>
      ) : source.length === 0 ? (
        <CropCard className="flex flex-col items-center gap-3 py-16 text-center">
          <PackageOpen size={28} className="text-carbon-500" />
          <p className="text-sm text-carbon-500">You haven't placed any orders yet.</p>
          <Link to="/catalog">
            <Button size="sm">Browse the catalog</Button>
          </Link>
        </CropCard>
      ) : (
        <div className="flex flex-col gap-4">
          {source.map((o) => (
            <CropCard key={o.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="job-number text-xs text-carbon-500">{o.id}</p>
                <p className="mt-1 text-sm font-medium text-carbon-900">{o.service}</p>
                <p className="mt-1 text-xs text-carbon-500">
                  {o.provider} &middot; Placed {o.createdAt}
                </p>
              </div>
              <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
                <StatusBadge status={o.status} />
                <p className="job-number text-sm font-semibold text-ink-600">
                  UGX {o.quotedAmount.toLocaleString()}
                </p>
              </div>
            </CropCard>
          ))}
        </div>
      )}
    </div>
  );
}
