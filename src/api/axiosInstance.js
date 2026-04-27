import axios from "axios";

const api = axios.create({
  baseURL: "https://zerodhabackend-lrq5.onrender.com",
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const config = error.config;

    if (!config || config._retry) {
      return Promise.reject(error);
    }

    const url = config.url || "";

    if (
      url.includes("/login") ||
      url.includes("/signup") ||
      url.includes("/health")
    ) {
      return Promise.reject(error);
    }

    if (error.response && error.response.status < 500) {
      return Promise.reject(error);
    }

    config._retry = true;

    await new Promise((res) => setTimeout(res, 3000));
    return api(config);
  }
);

export default api;