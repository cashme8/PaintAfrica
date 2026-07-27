export default function Input({ label, error, id, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-carbon-700">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`rounded-sm border border-stock-300 bg-stock-50 px-3.5 py-2.5 text-sm text-carbon-900 outline-none transition-colors placeholder:text-carbon-500/60 focus:border-ink-600 ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-press-600">{error}</p>}
    </div>
  );
}
