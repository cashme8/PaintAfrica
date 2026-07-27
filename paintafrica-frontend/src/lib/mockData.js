// Placeholder data so the frontend is fully clickable before the backend
// API is wired up. Replace calls to this file with real `servicesApi` /
// `ordersApi` calls once the Express + Supabase backend is live.

export const mockServices = [
  {
    id: "s1",
    title: "A5 Flyers — Full colour, gloss",
    category: "Flyers",
    provider: "KampalaPrints",
    providerType: "business",
    location: "Kampala",
    startingPrice: 150000,
    priceUnit: "per 500",
  },
  {
    id: "s2",
    title: "Roll-up Banner — 85 × 200cm",
    category: "Banners",
    provider: "PrintHouse Nairobi",
    providerType: "business",
    location: "Nairobi",
    startingPrice: 90000,
    priceUnit: "flat",
  },
  {
    id: "s3",
    title: "Premium Business Cards — Matte",
    category: "Business cards",
    provider: "Accra Print Co.",
    providerType: "business",
    location: "Accra",
    startingPrice: 60000,
    priceUnit: "per 250",
  },
  {
    id: "s4",
    title: "Brand identity design (logo + guide)",
    category: "Graphic design",
    provider: "Kwame Boateng",
    providerType: "designer",
    location: "Accra",
    startingPrice: 250000,
    priceUnit: "per project",
  },
  {
    id: "s5",
    title: "T-shirt & branded clothing printing",
    category: "Clothing branding",
    provider: "Lagos Apparel Prints",
    providerType: "business",
    location: "Lagos",
    startingPrice: 12000,
    priceUnit: "per item",
  },
  {
    id: "s6",
    title: "Trifold Brochures — A4, glossy",
    category: "Brochures",
    provider: "KampalaPrints",
    providerType: "business",
    location: "Kampala",
    startingPrice: 220000,
    priceUnit: "per 500",
  },
];

export const mockOrders = [
  {
    id: "PA-2026-0417",
    service: "500 × A5 Flyers, full colour, gloss",
    provider: "KampalaPrints",
    status: "quoted",
    quotedAmount: 185000,
    createdAt: "2026-07-14",
  },
  {
    id: "PA-2026-0398",
    service: "Roll-up banner, 85×200cm",
    provider: "PrintHouse Nairobi",
    status: "in_production",
    quotedAmount: 92000,
    createdAt: "2026-07-10",
  },
  {
    id: "PA-2026-0361",
    service: "250 Business cards, matte",
    provider: "Accra Print Co.",
    status: "completed",
    quotedAmount: 58000,
    createdAt: "2026-06-29",
  },
];

export const categories = [
  "All",
  "Flyers",
  "Posters",
  "Business cards",
  "Brochures",
  "Banners",
  "PVC cards",
  "Clothing branding",
  "Corporate branding",
  "Graphic design",
];
