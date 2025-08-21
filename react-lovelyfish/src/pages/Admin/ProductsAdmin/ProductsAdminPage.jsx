//商品管理（ProductsAdminPage.jsx）：显示商品列表，新增/修改/删除商品。
// 显示所有商品

// 支持新增商品

// 支持修改商品

// 支持删除商品

import React, { useEffect, useState } from "react";
import api from "../../../API/axios";
import "./ProductsAdminPage.css";

export default function ProductsAdminPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 新增/编辑用的表单
  const [form, setForm] = useState({
    id: null,
    name: "",
    price: "",
    stock: "",
  });

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products"); // 假设后端路由 /api/products
      setProducts(res.data || []);
    } catch (err) {
      console.error("[API Error] 获取商品失败", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 表单提交：新增 or 更新
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        // 更新
        await api.put(`/products/${form.id}`, form);
        alert("商品更新成功");
      } else {
        // 新增
        await api.post("/products", form);
        alert("商品新增成功");
      }
      setForm({ id: null, name: "", price: "", stock: "" });
      fetchProducts();
    } catch (err) {
      console.error("[API Error] 保存商品失败", err);
    }
  };

  // 删除
  const handleDelete = async (id) => {
    if (!window.confirm("确定要删除这个商品吗？")) return;
    try {
      await api.delete(`/products/${id}`);
      alert("删除成功");
      fetchProducts();
    } catch (err) {
      console.error("[API Error] 删除失败", err);
    }
  };

  return (
    <div>
      <h2 className="products-page-title">商品管理</h2>

      {/* 表单区 */}
      <form onSubmit={handleSubmit} className="products-form">
        <input
          type="text"
          placeholder="商品名称"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="价格"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="库存"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          required
        />
        <button type="submit">{form.id ? "更新商品" : "新增商品"}</button>
      </form>

      {/* 商品表格 */}
      {loading ? (
        <p>加载中...</p>
      ) : products.length === 0 ? (
        <p className="products-empty">暂无商品</p>
      ) : (
        <div className="products-table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>商品名称</th>
                <th>价格</th>
                <th>库存</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>${p.price}</td>
                  <td>{p.stock}</td>
                  <td>
                    <button
                      onClick={() =>
                        setForm({ id: p.id, name: p.name, price: p.price, stock: p.stock })
                      }
                    >
                      编辑
                    </button>
                    <button onClick={() => handleDelete(p.id)} style={{ marginLeft: "10px" }}>
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



// API 接口

// 获取商品：GET /api/products

// 新增商品：POST /api/products

// 修改商品：PUT /api/products/{id}

// 删除商品：DELETE /api/products/{id}

// 表单部分

// 如果 form.id 存在 → 更新

// 否则 → 新增

// 编辑按钮

// 点击后把该商品信息填充到表单里，方便修改。