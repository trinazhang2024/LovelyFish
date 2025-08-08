// src/api.js
const API_BASE = "https://localhost:7148/api/Product";  // 后端 API 地址

export async function getAllProducts() {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error("获取产品失败");
  return res.json();
}
