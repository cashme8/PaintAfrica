import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const services = [
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
];

const orders = [
  {
    id: "PA-2026-0417",
    service: "500 × A5 Flyers, full colour, gloss",
    provider: "KampalaPrints",
    status: "quoted",
    quotedAmount: 185000,
    createdAt: "2026-07-14",
    quote_file_url: null,
  },
  {
    id: "PA-2026-0398",
    service: "Roll-up banner, 85×200cm",
    provider: "PrintHouse Nairobi",
    status: "in_production",
    quotedAmount: 92000,
    createdAt: "2026-07-10",
    quote_file_url: null,
  },
];

export function createApp() {
  const app = express();

  app.use(cors({ origin: true }));
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "paintafrica-backend" });
  });

  app.get("/api/v1/services", (_req, res) => {
    res.json(services);
  });

  app.get("/api/v1/services/:id", (req, res) => {
    const service = services.find((item) => item.id === req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    return res.json(service);
  });

  app.get("/api/v1/orders", (_req, res) => {
    res.json(orders);
  });

  app.get("/api/v1/orders/:id", (req, res) => {
    const order = orders.find((item) => item.id === req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.json(order);
  });

  app.post("/api/v1/orders", (req, res) => {
    const order = {
      id: `PA-${Date.now()}`,
      service: req.body.serviceId || "Custom request",
      provider: "PaintAfrica partner",
      status: "pending",
      quotedAmount: 0,
      createdAt: new Date().toISOString().slice(0, 10),
      quote_file_url: null,
      ...req.body,
    };

    orders.unshift(order);
    return res.status(201).json(order);
  });

  app.patch("/api/v1/orders/:id/quote", (req, res) => {
    const order = orders.find((item) => item.id === req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = "quoted";
    order.quotedAmount = req.body.quoted_amount || order.quotedAmount;
    order.quote_file_url = req.body.file_url || order.quote_file_url;
    return res.json(order);
  });

  app.patch("/api/v1/orders/:id/status", (req, res) => {
    const order = orders.find((item) => item.id === req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.status = req.body.status || order.status;
    return res.json(order);
  });

  app.patch("/api/v1/orders/:id/accept", (req, res) => {
    const order = orders.find((item) => item.id === req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.status = "accepted";
    return res.json(order);
  });

  app.patch("/api/v1/orders/:id/reject", (req, res) => {
    const order = orders.find((item) => item.id === req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.status = "rejected";
    return res.json(order);
  });

  app.patch("/api/v1/orders/:id/payment", (req, res) => {
    const order = orders.find((item) => item.id === req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.paymentStatus = req.body.status || "paid";
    return res.json(order);
  });

  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  });

  return app;
}
