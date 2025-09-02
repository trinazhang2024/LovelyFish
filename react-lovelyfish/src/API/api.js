// src/api.js

const API_BASE = import.meta.env.VITE_API_BASE;

// 获取所有产品
export async function getAllProducts() {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error("获取产品失败");
  return res.json();
}
