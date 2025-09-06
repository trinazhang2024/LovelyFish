// src/api.js

const API_BASE = "https://lovelyfish-backend-esgtdkf7h0e2ambg.australiaeast-01.azurewebsites.net/api/Product";

// Get all products
export async function getAllProducts() {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}
