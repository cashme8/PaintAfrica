const variants = {
  primary: "bg-ink-600 text-stock-50 hover:bg-ink-700",
  accent: "bg-marigold-500 text-ink-900 hover:bg-marigold-600",
  outline: "border border-ink-600 text-ink-600 hover:bg-ink-600 hover:text-stock-50",
  ghost: "text-ink-600 hover:bg-ink-50",
  danger: "bg-press-500 text-stock-50 hover:bg-press-600",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
