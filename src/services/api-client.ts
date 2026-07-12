import axios from "axios";
import { config } from "@/config";

const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (request) => {
    // TODO: Replace with real token retrieval (e.g. from auth context or cookie)
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message ?? error.message;

    if (status === 401) {
      // TODO: Trigger token refresh or redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    }

    return Promise.reject({ message, status } as { message: string; status: number });
  },
);

export default apiClient;
