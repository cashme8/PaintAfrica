import test from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/app.js";

test("POST /api/v1/orders uses the provided repository", async () => {
  const repository = {
    createOrder: async (order) => ({ ...order, id: "repo-order" }),
    listOrders: async () => [],
    getOrderById: async () => null,
    updateOrder: async (_id, updates) => ({ id: "repo-order", ...updates }),
  };

  const app = createApp({ repository });
  const server = app.listen(0);

  try {
    const address = server.address();
    const response = await fetch(`http://127.0.0.1:${address.port}/api/v1/orders`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ serviceId: "s1" }),
    });

    assert.equal(response.status, 201);
    const body = await response.json();
    assert.equal(body.id, "repo-order");
    assert.equal(body.service, "s1");
  } finally {
    server.close();
  }
});
