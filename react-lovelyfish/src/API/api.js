const API_BASE = process.env.REACT_API_BASE_URL;

// Get all products
export async function getAllProducts() {
  const res = await fetch(`${API_BASE}/Product`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}
