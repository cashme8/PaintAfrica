import axiosClient from "../axiosClient";

export const usersApi = {
  list: (params) => axiosClient.get("/users", { params }),
  getById: (id) => axiosClient.get(`/users/${id}`),
  approve: (id) => axiosClient.patch(`/users/${id}/approve`),
  reject: (id) => axiosClient.patch(`/users/${id}/reject`),
  update: (id, payload) => axiosClient.put(`/users/${id}`, payload),
};
