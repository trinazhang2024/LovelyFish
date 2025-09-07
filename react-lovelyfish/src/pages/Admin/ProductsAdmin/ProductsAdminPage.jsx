// src/pages/Admin/ProductsAdminPage.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import ProductImageUpload from '../../Admin/ProductsAdmin/ProductImageUpload';
import api from "../../../API/axios";
import "./ProductsAdminPage.css";

export default function ProductsAdminPage() {
  // -------------------- State --------------------
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const searchTimeout = useRef(null);

  // -------------------- Pagination --------------------
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10; // Number of items per page, same as backend

  // -------------------- Form State --------------------
  const [form, setForm] = useState({
    id: null,
    title: "",
    price: "",
    stock: "",
    discountPercent: 0,
    description: "",
    features: [],
    categoryId: "",
    imageUrls: [], // Store uploaded file URLs
    isClearance: false
  });

  const IMAGE_BASE_URL = "https://lovelyfishstorage2025.blob.core.windows.net/uploads/"; // Change to your domain after deployment

  // -------------------- Fetch Products --------------------
  const fetchProducts = useCallback(async (searchTerm = "", pageNum = 1) => {
    setLoading(true);
    try {
      const res = await api.get("/Product", {
        params: { search: searchTerm, page: pageNum, pageSize },
      });

      const productsData = res.data.items || [];

      // Map backend image objects to imageUrls
      const mappedProducts = productsData.map(p => {
        console.log("Product ID:", p.id);
        console.log("Original images:", p.images);
        console.log("Mapped imageUrls:", (p.images || []).map(img => img.fileName));

        return {
          ...p,
          imageUrls: (p.images || []).map(img => `${IMAGE_BASE_URL}${img.fileName}`),
        };
      });

      setProducts(mappedProducts);
      setTotalPages(res.data.totalPages || 1);
      setTotalItems(res.data.totalItems || productsData.length);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // -------------------- Fetch Categories --------------------
  const fetchCategories = useCallback(async () => {
    try {
      const res = await api.get("/Product/categories");
      setCategories(res.data || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [fetchCategories, fetchProducts]);

  // -------------------- Search with Debounce --------------------
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(() => {
      setPage(1);
      fetchProducts(search, 1);
    }, 500);

    return () => clearTimeout(searchTimeout.current);
  }, [search, fetchProducts]);

  // -------------------- Pagination Effect --------------------
  useEffect(() => {
    fetchProducts(search, page);
  }, [page, fetchProducts, search]);

  // -------------------- Form Input Handlers --------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFeaturesChange = (e) => {
    setForm(prev => ({ ...prev, features: e.target.value.split(",") }));
  };

  // -------------------- Image Upload State --------------------
  const [imageUrls, setImageUrls] = useState([]);

  // -------------------- Submit (Add/Edit Product) --------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        title: form.title,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        discountPercent: parseInt(form.discountPercent),
        description: form.description,
        features: form.features,
        categoryId: parseInt(form.categoryId),
        imageUrls, // Pass uploaded images to backend
        isClearance: form.isClearance || false
      };

      console.log("Submitting payload:", payload);

      if (form.id) {
        await api.put(`/Product/${form.id}`, payload);
        alert("Product updated successfully");
      } else {
        await api.post("/Product", payload);
        alert("Product added successfully");
      }

      // Reset form
      setForm({
        id: null,
        title: "",
        price: "",
        stock: "",
        discountPercent: 0,
        description: "",
        features: [],
        categoryId: "",
        imageUrls: [],
        isClearance: false
      });
      setImageUrls([]);

      fetchProducts(search, page);

    } catch (err) {
      console.error("Failed to save product:", err);
      alert("Save failed");
    }
  };

  // -------------------- Edit Product --------------------
  const handleEdit = (product) => {
    setForm({
      id: product.id,
      title: product.title,
      price: product.price,
      stock: product.stock,
      discountPercent: product.discountPercent,
      description: product.description,
      features: product.features || [],
      categoryId: product.categoryId,
      imageUrls: Array.isArray(product.imageUrls) ? product.imageUrls : product.imageUrls ? [product.imageUrls] : [],
      isClearance: product.isClearance || false
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // -------------------- Delete Product --------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this product?")) return;
    try {
      await api.delete(`/Product/${id}`);
      fetchProducts(search, page);
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Delete failed");
    }
  };

  // -------------------- JSX --------------------
  return (
    <div className="products-admin-page">
      <h2>Product Management</h2>

      {/* Search input */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Product Form */}
      <div className="product-form-container">
        <h3>{form.id ? "Edit Product" : "Add New Product"}</h3>
        <form className="products-form vertical-form" onSubmit={handleSubmit}>
          <input name="title" placeholder="Product Title" value={form.title} onChange={handleChange} required />
          <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
          <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required />
          <input name="discountPercent" type="number" placeholder="Discount Percent" value={form.discountPercent} onChange={handleChange} />
          <textarea name="description" placeholder="Product Description" value={form.description} onChange={handleChange} />
          <input placeholder="Features (comma-separated, e.g., output:3000, wattage:60)" value={form.features.join(",")} onChange={handleFeaturesChange} />

          <select name="categoryId" value={form.categoryId} onChange={handleChange} required>
            <option value="">Category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          {/* Image Upload Component */}
          <ProductImageUpload imageUrls={imageUrls} setImageUrls={setImageUrls} />

          <button type="submit">{form.id ? "Update Product" : "Add Product"}</button>
        </form>
      </div>

      {/* Product List */}
      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products available</p>
      ) : (
        <div className="products-list-container">
          <h3>All Products</h3>
          <div className="products-table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Discount</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>
                      {p.mainImageUrl ? (
                        <img src={p.mainImageUrl} alt={p.title} style={{ width: 50, height: 50, objectFit: "cover" }} />
                      ) : (
                        <span>No image</span>
                      )}
                    </td>
                    <td>{p.title}</td>
                    <td>${p.price}</td>
                    <td>{p.stock}</td>
                    <td>{p.discountPercent}%</td>
                    <td>{p.categoryTitle}</td>
                    <td>
                      <button onClick={() => handleEdit(p)}>Edit</button>
                      <button style={{ marginLeft: 8 }} onClick={() => handleDelete(p.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination">
            <span>Total {totalItems}, {pageSize} per page</span>
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev Page</button>
            <span>{page} / {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next Page</button>
          </div>
        </div>
      )}
    </div>
  );
}
