import axiosClient from "../axiosClient";

export const designsApi = {
  list: (params) => axiosClient.get("/designs", { params }),
  getById: (id) => axiosClient.get(`/designs/${id}`),
  sendQuote: (id, quoted_amount) => axiosClient.patch(`/designs/${id}/quote`, { quoted_amount }),
  accept: (id) => axiosClient.patch(`/designs/${id}/accept`),
  reject: (id) => axiosClient.patch(`/designs/${id}/reject`),
  update: (id, payload) => axiosClient.put(`/designs/${id}`, payload),
};
