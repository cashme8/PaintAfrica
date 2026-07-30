import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

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

const defaultOrders = [
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

function createMemoryRepository() {
  const orders = [...defaultOrders];

  return {
    async listOrders() {
      return orders;
    },
    async getOrderById(id) {
      return orders.find((item) => item.id === id) ?? null;
    },
    async createOrder(order) {
      orders.unshift(order);
      return order;
    },
    async updateOrder(id, updates) {
      const order = orders.find((item) => item.id === id);
      if (!order) return null;
      Object.assign(order, updates);
      return order;
    },
  };
}

function createSupabaseRepository() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return createMemoryRepository();
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  return {
    async listOrders() {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    async getOrderById(id) {
      const { data, error } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data ?? null;
    },
    async createOrder(order) {
      const { data, error } = await supabase.from("orders").insert(order).select().single();
      if (error) throw error;
      return data;
    },
    async updateOrder(id, updates) {
      const { data, error } = await supabase.from("orders").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
  };
}

export function createApp({ repository } = {}) {
  const app = express();
  const ordersRepository = repository ?? createSupabaseRepository();
  const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.use(cors({ origin: allowedOrigins, credentials: true }));
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

  app.get("/api/v1/orders", async (_req, res) => {
    try {
      const orders = await ordersRepository.listOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/v1/orders/:id", async (req, res) => {
    try {
      const order = await ordersRepository.getOrderById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      return res.json(order);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/v1/orders", async (req, res) => {
    try {
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

      const createdOrder = await ordersRepository.createOrder(order);
      return res.status(201).json(createdOrder);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/v1/orders/:id/quote", async (req, res) => {
    try {
      const order = await ordersRepository.getOrderById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const updatedOrder = await ordersRepository.updateOrder(req.params.id, {
        status: "quoted",
        quotedAmount: req.body.quoted_amount || order.quotedAmount,
        quote_file_url: req.body.file_url || order.quote_file_url,
      });
      return res.json(updatedOrder);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/v1/orders/:id/status", async (req, res) => {
    try {
      const order = await ordersRepository.getOrderById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      const updatedOrder = await ordersRepository.updateOrder(req.params.id, {
        status: req.body.status || order.status,
      });
      return res.json(updatedOrder);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/v1/orders/:id/accept", async (req, res) => {
    try {
      const order = await ordersRepository.getOrderById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      const updatedOrder = await ordersRepository.updateOrder(req.params.id, {
        status: "accepted",
      });
      return res.json(updatedOrder);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/v1/orders/:id/reject", async (req, res) => {
    try {
      const order = await ordersRepository.getOrderById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      const updatedOrder = await ordersRepository.updateOrder(req.params.id, {
        status: "rejected",
      });
      return res.json(updatedOrder);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/v1/orders/:id/payment", async (req, res) => {
    try {
      const order = await ordersRepository.getOrderById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      const updatedOrder = await ordersRepository.updateOrder(req.params.id, {
        paymentStatus: req.body.status || "paid",
      });
      return res.json(updatedOrder);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });

  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  });

  return app;
}
