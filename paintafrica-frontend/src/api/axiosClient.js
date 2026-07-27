import axios from "axios";
import { supabase } from "../lib/supabaseClient";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";

const axiosClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the current Supabase session's JWT to every outgoing request.
axiosClient.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize error responses so components can rely on `error.message`.
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message || error?.message || "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  }
);

export default axiosClient;
