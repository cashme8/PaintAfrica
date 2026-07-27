import axiosClient from "../axiosClient";

export const ordersApi = {
  list: (params) => axiosClient.get("/orders", { params }),
  getById: (id) => axiosClient.get(`/orders/${id}`),
  create: (payload) => axiosClient.post("/orders", payload),
  sendQuote: (id, quoted_amount) => axiosClient.patch(`/orders/${id}/quote`, { quoted_amount }),
  accept: (id) => axiosClient.patch(`/orders/${id}/accept`),
  reject: (id) => axiosClient.patch(`/orders/${id}/reject`),
  updateStatus: (id, status) => axiosClient.patch(`/orders/${id}/status`, { status }),
  markPaid: (id) => axiosClient.patch(`/orders/${id}/payment`, { status: "paid" }),
};
