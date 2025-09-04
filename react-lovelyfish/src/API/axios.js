import axios from "axios";

// 从环境变量读取后端 API 地址
// REACT_APP_API_BASE_URL 需要在 .env 或 Azure 前端环境变量里配置
const baseURL = "https://lovelyfish-backend-esgtdkf7h0e2ambg.australiaeast-01.azurewebsites.net/api";

//process.env.REACT_APP_API_BASE_URL;

// 创建 axios 
const api = axios.create({
  baseURL,            // 使用环境变量
  withCredentials: true, // 让浏览器带上 Cookie
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器（统一错误处理）
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
    console.error("[API Error]", message);
    return Promise.reject({ ...error, message });
  }
);

export default api;