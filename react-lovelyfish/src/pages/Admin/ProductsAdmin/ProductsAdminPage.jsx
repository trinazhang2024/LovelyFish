// src/pages/Admin/ProductsAdminPage.jsx
import React, { useEffect, useState } from "react";
import api from "../../../API/axios";
import "./ProductsAdminPage.css";

export default function ProductsAdminPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    id: null,
    title: "",
    price: "",
    stock: "",
    discountPercent: 0,
    description: "",
    features: [],
    categoryId: "",
    imageFiles: [],
    imageUrls: [],
  });

  // 获取所有产品
  const fetchProducts = async () => {
    try {
      const res = await api.get("/Product");
      setProducts(res.data || []);
    } catch (err) {
      console.error("获取产品失败", err);
    } finally {
      setLoading(false);
    }
  };

  // 获取所有分类
  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/categories");
      setCategories(res.data || []);
    } catch (err) {
      console.error("获取分类失败", err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // 表单变化
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // 特征输入
  const handleFeaturesChange = (e) => {
    setForm({ ...form, features: e.target.value.split(",") });
  };

  // 图片上传
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));

    // 上传到服务器
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      const res = await api.post("/upload", formData);
      const urls = res.data.map((item) => item.url); // 后端返回 { url: "..." }
      setForm({
        ...form,
        imageFiles: [...form.imageFiles, ...files],
        imageUrls: [...form.imageUrls, ...urls],
      });
    } catch (err) {
      console.error("上传图片失败", err);
      alert("上传图片失败");
    }
  };

  // 删除图片
  const removeImage = (index) => {
    const newFiles = [...form.imageFiles];
    const newUrls = [...form.imageUrls];
    newFiles.splice(index, 1);
    newUrls.splice(index, 1);
    setForm({ ...form, imageFiles: newFiles, imageUrls: newUrls });
  };

  // 表单提交
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
        imageUrls: form.imageUrls,
      };

      if (form.id) {
        await api.put(`/Product/${form.id}`, payload);
        alert("产品更新成功");
      } else {
        await api.post("/Product", payload);
        alert("产品新增成功");
      }

      setForm({
        id: null,
        title: "",
        price: "",
        stock: "",
        discountPercent: 0,
        description: "",
        features: [],
        categoryId: "",
        imageFiles: [],
        imageUrls: [],
      });

      fetchProducts();
    } catch (err) {
      console.error("保存产品失败", err);
      alert("保存失败");
    }
  };

  // 编辑
  const handleEdit = (p) => {
    setForm({
      id: p.id,
      title: p.title,
      price: p.price,
      stock: p.stock,
      discountPercent: p.discountPercent,
      description: p.description,
      features: p.features || [],
      categoryId: p.categoryId,
      imageFiles: [],
      imageUrls: p.images?.map((img) => img.url) || [],
    });
  };

  // 删除
  const handleDelete = async (id) => {
    if (!window.confirm("确定删除吗？")) return;
    try {
      await api.delete(`/Product/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("删除失败", err);
      alert("删除失败");
    }
  };

  return (
    <div className="products-admin-page">
      <h2>产品管理</h2>

      <form className="products-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="产品标题"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="价格"
          value={form.price}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="stock"
          placeholder="库存"
          value={form.stock}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="discountPercent"
          placeholder="折扣百分比"
          value={form.discountPercent}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="产品描述"
          value={form.description}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="特征（逗号分隔）"
          value={form.features.join(",")}
          onChange={handleFeaturesChange}
        />

        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          required
        >
          <option value="">选择分类</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input type="file" multiple onChange={handleImageChange} />
        <div className="image-preview">
          {form.imageUrls.map((url, idx) => (
            <div key={idx}>
              <img src={url} alt={`预览 ${idx}`} />
              <button type="button" onClick={() => removeImage(idx)}>
                ×
              </button>
            </div>
          ))}
        </div>

        <button type="submit">{form.id ? "更新产品" : "新增产品"}</button>
      </form>

      {loading ? (
        <p>加载中...</p>
      ) : products.length === 0 ? (
        <p>暂无产品</p>
      ) : (
        <div className="products-table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>图片</th>
                <th>标题</th>
                <th>价格</th>
                <th>库存</th>
                <th>折扣</th>
                <th>分类</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>
                    {p.images?.[0] && (
                      <img
                        src={p.images[0].url}
                        alt={p.title}
                        style={{ width: 50, height: 50, objectFit: "cover" }}
                      />
                    )}
                  </td>
                  <td>{p.title}</td>
                  <td>${p.price}</td>
                  <td>{p.stock}</td>
                  <td>{p.discountPercent}%</td>
                  <td>{p.category?.name}</td>
                  <td>
                    <button onClick={() => handleEdit(p)}>编辑</button>
                    <button
                      style={{ marginLeft: 8 }}
                      onClick={() => handleDelete(p.id)}
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
