import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import CropCard from "../../components/common/CropCard";
import StatusBadge from "../../components/common/StatusBadge";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { useAuth } from "../../auth/AuthContext";
import { designsApi } from "../../api/endpoints/designs.api";

const requests = [
  { id: "PA-2026-0430", customer: "Zanele Dube", brief: "Restaurant menu redesign", status: "pending" },
  { id: "PA-2026-0399", customer: "Femi Adeyemi", brief: "Logo + brand colours for a bakery", status: "accepted" },
];

export default function Portfolio() {
  const { user } = useAuth();
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [saved, setSaved] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    designsApi
      .list()
      .then((res) => mounted && setRequests(res.data || []))
      .catch((err) => mounted && setError(err.message || "Could not load design requests"))
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, []);

  function handleSave(e) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    // TODO: persist via designsApi.update() or a separate designer profile API once backend is live.
  }

  const source = requests.length > 0 ? requests : requests;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <p className="job-number text-xs text-ink-600">Designer dashboard</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-carbon-900">
        {user?.user_metadata?.full_name ?? "Your"} portfolio
      </h1>

      <CropCard className="mt-8">
        <h2 className="font-display text-lg font-semibold text-carbon-900">Profile</h2>
        <form onSubmit={handleSave} className="mt-4 flex flex-col gap-4">
          <div>
            <label htmlFor="bio" className="text-sm font-medium text-carbon-700">
              Bio
            </label>
            <textarea
              id="bio"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell customers what you specialize in…"
              className="mt-1.5 w-full rounded-sm border border-stock-300 bg-stock-50 px-3.5 py-2.5 text-sm outline-none focus:border-ink-600"
            />
          </div>
          <Input
            id="skills"
            label="Skills (comma-separated)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="Branding, illustration, packaging design"
          />
          <div className="flex items-center gap-3">
            <Button type="submit" size="sm">
              Save profile
            </Button>
            {saved && <span className="text-xs text-proof-600">Saved.</span>}
          </div>
        </form>
      </CropCard>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-carbon-900">Sample work</h2>
        <Button variant="outline" size="sm">
          <Plus size={14} /> Add sample
        </Button>
      </div>
      <CropCard className="mt-4 flex items-center justify-center py-12 text-sm text-carbon-500">
        No samples uploaded yet — add your first piece to start attracting clients.
      </CropCard>

      <div className="mt-10">
        <h2 className="font-display text-lg font-semibold text-carbon-900">Design requests</h2>
        {loading ? (
          <CropCard className="mt-4 py-8 text-center text-sm text-carbon-500">Loading requests…</CropCard>
        ) : error ? (
          <CropCard className="mt-4 rounded-sm bg-press-500/10 px-4 py-3 text-sm text-press-600">{error}</CropCard>
        ) : (
          <div className="mt-4 flex flex-col gap-4">
            {requests.map((r) => (
            <CropCard key={r.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="job-number text-xs text-carbon-500">{r.id}</p>
                <p className="mt-1 text-sm font-medium text-carbon-900">{r.brief}</p>
                <p className="mt-1 text-xs text-carbon-500">{r.customer}</p>
              </div>
              <StatusBadge status={r.status} />
            </CropCard>
          ))}
          </div>
        )}
      </div>
    </div>
  );
}
