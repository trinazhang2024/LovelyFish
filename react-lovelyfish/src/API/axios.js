import axios from "axios";

// 创建 axios 实例
const api = axios.create({
  baseURL: "https://localhost:7148/api", // 你的后端 API 地址（注意端口）
  withCredentials: true,                 // ✅ 关键：让浏览器带上 Cookie
});

// 请求拦截器（可选，自动加 loading、日志等）
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

// 所有请求都会自动带 Cookie

// 错误会统一处理，页面里就不用到处写 try...catch 来判断 401、500

// 以后 Login.jsx、Navbar、Profile 都用这个 api 实例就可以了

// 前端所有接口请求都会自动带 Cookie，并且错误提示都统一格式化了。