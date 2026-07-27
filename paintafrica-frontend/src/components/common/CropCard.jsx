export default function CropCard({ children, className = "", as: Tag = "div", ...props }) {
  return (
    <Tag
      className={`crop-card rounded-sm border border-stock-300 bg-stock-50 p-5 transition-shadow hover:shadow-[0_2px_16px_rgba(32,43,107,0.08)] ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
