export function formatFRW(amount) {
  if (amount === null || amount === undefined || amount === "") return "";
  const n = Number(amount);
  if (Number.isNaN(n)) return String(amount);
  // No decimal places for FRW; use thousands separator
  return `FRW ${n.toLocaleString()}`;
}

export default formatFRW;
