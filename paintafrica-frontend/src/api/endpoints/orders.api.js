import axiosClient from "../axiosClient";

export const ordersApi = {
  list: (params) => axiosClient.get("/orders", { params }),
  getById: (id) => axiosClient.get(`/orders/${id}`),
  create: (payload) => axiosClient.post("/orders", payload),
  // accepts optional file_url for provider PDF quotes
  sendQuote: (id, quoted_amount, file_url) =>
    axiosClient.patch(`/orders/${id}/quote`, { quoted_amount, file_url }),
  accept: (id) => axiosClient.patch(`/orders/${id}/accept`),
  reject: (id) => axiosClient.patch(`/orders/${id}/reject`),
  updateStatus: (id, status) => axiosClient.patch(`/orders/${id}/status`, { status }),
  markPaid: (id) => axiosClient.patch(`/orders/${id}/payment`, { status: "paid" }),
};
