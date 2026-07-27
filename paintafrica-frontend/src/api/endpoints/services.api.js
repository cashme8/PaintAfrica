import axiosClient from "../axiosClient";

export const servicesApi = {
  list: (params) => axiosClient.get("/services", { params }),
  getById: (id) => axiosClient.get(`/services/${id}`),
  create: (payload) => axiosClient.post("/services", payload),
  update: (id, payload) => axiosClient.put(`/services/${id}`, payload),
  remove: (id) => axiosClient.delete(`/services/${id}`),
};
