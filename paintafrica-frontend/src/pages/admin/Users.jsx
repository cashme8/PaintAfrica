import { useState, useEffect } from "react";
import CropCard from "../../components/common/CropCard";
import Button from "../../components/common/Button";
import { usersApi } from "../../api/endpoints/users.api";

const initialAccounts = [
  { id: "u1", name: "KampalaPrints", type: "business", location: "Kampala", approved: true },
  { id: "u2", name: "Accra Print Co.", type: "business", location: "Accra", approved: false },
  { id: "u3", name: "Kwame Boateng", type: "designer", location: "Accra", approved: false },
  { id: "u4", name: "Lagos Apparel Prints", type: "business", location: "Lagos", approved: true },
];

export default function Users() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    usersApi
      .list()
      .then((res) => mounted && setAccounts(res.data || []))
      .catch((err) => mounted && setError(err.message || "Could not load accounts"))
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, []);

  async function toggleApproval(id, currentApproval) {
    try {
      const action = currentApproval ? "reject" : "approve";
      if (action === "approve") {
        await usersApi.approve(id);
      } else {
        await usersApi.reject(id);
      }
      setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, approved: !a.approved } : a)));
    } catch (err) {
      setError(err.message || "Could not update approval status");
    }
  }

  const source = accounts.length > 0 ? accounts : initialAccounts;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <p className="job-number text-xs text-ink-600">Admin</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-carbon-900">Businesses & designers</h1>
      <p className="mt-2 text-sm text-carbon-500">
        Approve providers before their listings appear publicly in the catalog.
      </p>

      {error && (
        <div className="mt-4 rounded-sm bg-press-500/10 px-4 py-3 text-sm text-press-600">{error}</div>
      )}

      <div className="mt-8 flex flex-col gap-3">
        {loading ? (
          <CropCard className="py-8 text-center text-sm text-carbon-500">Loading accounts…</CropCard>
        ) : (
          source.map((a) => (
            <CropCard key={a.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-carbon-900">{a.name}</p>
                <p className="job-number mt-1 text-xs text-carbon-500">
                  {a.type} &middot; {a.location}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`job-number rounded-sm px-2.5 py-1 text-xs font-semibold ${
                    a.approved ? "bg-proof-500/10 text-proof-600" : "bg-marigold-400/25 text-marigold-600"
                  }`}
                >
                  {a.approved ? "Approved" : "Pending review"}
                </span>
                <Button
                  size="sm"
                  variant={a.approved ? "outline" : "primary"}
                  onClick={() => toggleApproval(a.id, a.approved)}
                >
                  {a.approved ? "Revoke" : "Approve"}
                </Button>
              </div>
            </CropCard>
          ))
        )}
      </div>
    </div>
  );
}
