const statusStyles = {
  pending: "bg-stock-200 text-carbon-700",
  quoted: "bg-marigold-400/30 text-marigold-600",
  accepted: "bg-ink-100 text-ink-600",
  rejected: "bg-press-500/10 text-press-600",
  in_production: "bg-ink-100 text-ink-600",
  ready: "bg-proof-500/10 text-proof-600",
  completed: "bg-proof-500/15 text-proof-600",
  cancelled: "bg-press-500/10 text-press-600",
};

const statusLabels = {
  pending: "Pending",
  quoted: "Quoted",
  accepted: "Accepted",
  rejected: "Rejected",
  in_production: "In production",
  ready: "Ready",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function StatusBadge({ status }) {
  const style = statusStyles[status] ?? "bg-stock-200 text-carbon-700";
  const label = statusLabels[status] ?? status;

  return (
    <span className={`job-number inline-block rounded-sm px-2.5 py-1 text-xs font-semibold ${style}`}>
      {label}
    </span>
  );
}
