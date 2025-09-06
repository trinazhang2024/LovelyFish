// src/api.js

const API_BASE = process.env.REACT_API_BASE;

// Get all products
export async function getAllProducts() {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}
