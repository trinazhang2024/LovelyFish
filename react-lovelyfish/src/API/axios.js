// src/api/index.ts
import axios from "axios";

// 后端 API 基础 URL
const baseURL = "https://localhost:7148/api";

// 创建 axios 实例
const api = axios.create({
  baseURL,
  // withCredentials: true, // 不再使用 Cookie
});

// ==================== 请求拦截器 ====================
api.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==================== 响应拦截器 ====================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = "Network error";
    if (error.response?.data) {
      if (typeof error.response.data === "string") {
        message = error.response.data;
      } else if (error.response.data.message) {
        message = error.response.data.message;
      } else {
        message = JSON.stringify(error.response.data);
      }
    }

    // 401 Unauthorized 自动处理
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    console.error("[API Error]", message);
    return Promise.reject({ ...error, message });
  }
);


export default api;
