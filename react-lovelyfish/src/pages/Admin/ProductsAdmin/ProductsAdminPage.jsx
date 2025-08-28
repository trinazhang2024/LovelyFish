// src/pages/Admin/ProductsAdminPage.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import api from "../../../API/axios";
import "./ProductsAdminPage.css";

export default function ProductsAdminPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const searchTimeout = useRef(null);

  const [form, setForm] = useState({
    id: null,
    title: "",
    price: "",
    stock: "",
    discountPercent: 0,
    description: "",
    features: [],
    categoryId: "",
    imageUrls: [], // 存文件名
  });

  const IMAGE_BASE_URL = "https://localhost:7148/uploads/"; // 部署后改成你的域名

  //===============分页===============
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10; // 每页显示条数，和后端一致

  // ==================== 获取产品 ====================
  const fetchProducts = useCallback(async (searchTerm = "", pageNum = 1) => {
    setLoading(true);
    try {
      const res = await api.get("/Product", {
        params: { search: searchTerm, page: pageNum, pageSize },
      });
      const productsData = res.data.items ||[];
      // 映射 imageUrls
      const mappedProducts = productsData.map(p => ({
        ...p,
        imageUrls: (p.images || []).map(img =>img.fileName),
      }));
      setProducts(mappedProducts);
      setTotalPages(res.data.totalPages || 1);
      setTotalItems(res.data.totalItems || productsData.length);
    } catch (err) {
      console.error("获取产品失败", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== 获取分类 ====================
  const fetchCategories = useCallback(async () => {
    try {
      const res = await api.get("/Product/categories");
      setCategories(res.data || []);
    } catch (err) {
      console.error("获取分类失败", err);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [fetchCategories, fetchProducts]);

  // ==================== 搜索防抖 ====================
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setPage(1);
      fetchProducts(search, 1);
    }, 500);
    return () => clearTimeout(searchTimeout.current);
  }, [search, fetchProducts]);

  // ==================== 分页pagination ====================
  useEffect(() => {
    fetchProducts(search, page);
  }, [page, fetchProducts, search]);

  // ==================== 表单变化 ====================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFeaturesChange = (e) => {
    setForm({ ...form, features: e.target.value.split(",") });
  };

  // ==================== 图片上传 ====================
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);

    console.log("选中的文件列表:", files); // ✅ 打印文件信息
    if (files.length === 0) {
      console.warn("没有选择文件");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      console.log("追加到 FormData 的文件:", file.name); // ✅ 打印文件名
      formData.append("files", file)
  });

   // 这里也可以打印 FormData 的内容（不过需要遍历）
   for (let pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }


    try {
      const res = await api.post("/upload", formData);
      const fileNames = res.data.map(item => item.fileName);

      console.log("上传返回的文件名:", fileNames); // ✅ 打印上传返回

      setForm(prev => ({ ...prev, imageUrls: [...prev.imageUrls, ...fileNames] }));
    } catch (err) {
      console.error("上传图片失败", err);
      alert("上传图片失败");
    }
  };

  // 删除图片只是修改 form.imageUrls，提交时后端会覆盖原有图片
  const removeImage = (index) => {
  setForm(prev => {
    const newUrls = [...prev.imageUrls];
    newUrls.splice(index, 1);
    return { ...prev, imageUrls: newUrls };
  });
};

  // ==================== 新增/编辑产品 ====================
  //handleSubmit 只发送后端需要的字段，不包括 id、categoryTitle、mainImageUrl。
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
        imageUrls: form.imageUrls, // 把图片数组直接传给后端
        isClearance: form.isClearance || false
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
        imageUrls: [],
        isClearance: false
      });

      fetchProducts(search, page);
      console.log("提交 payload:", payload);
    } catch (err) {
      console.error("保存产品失败", err);
      alert("保存失败");
    }
    console.log("提交 payload:", payload);
    

  };

  // ==================== 编辑 ====================
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
      imageUrls: p.imageUrls || [], // 直接用文件名数组
      isClearance: p.isClearance || false
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ==================== 删除 ====================
  const handleDelete = async (id) => {
    if (!window.confirm("确定删除吗？")) return;
    try {
      await api.delete(`/Product/${id}`);
      fetchProducts(search, page);
    } catch (err) {
      console.error("删除失败", err);
      alert("删除失败");
    }
  };

  // ==================== JSX ====================
  return (
    <div className="products-admin-page">
      <h2>产品管理</h2>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="搜索产品名称..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="product-form-container">
        <h3>{form.id ? "编辑产品" : "新增产品"}</h3>
        <form className="products-form vertical-form" onSubmit={handleSubmit}>
          <input name="title" placeholder="Product Title" value={form.title} onChange={handleChange} required />
          <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
          <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required />
          <input name="discountPercent" type="number" placeholder="discountPercent" value={form.discountPercent} onChange={handleChange} />
          <textarea name="description" placeholder="Product Description" value={form.description} onChange={handleChange} />
          <input placeholder="Features (comma-separated). eg, output: 3000, wattage:60," value={form.features.join(",")} onChange={handleFeaturesChange} />
          <select name="categoryId" value={form.categoryId} onChange={handleChange} required>
            <option value="">Category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input type="file" multiple onChange={handleImageChange} />
          <div className="image-preview">
            {form.imageUrls.map((fileName, idx) => (
              <div className="preview-item" key={idx}>
                <img src={IMAGE_BASE_URL + fileName} alt={`预览 ${idx}`} />
                <button type="button" onClick={() => removeImage(idx)}>×</button>
              </div>
            ))}
          </div>
          <button type="submit">{form.id ? "更新产品" : "新增产品"}</button>
        </form>
      </div>

      {loading ? (
        <p>加载中...</p>
      ) : products.length === 0 ? (
        <p>暂无产品</p>
      ) : (
        <div className="products-list-container">
          <h3>所有产品</h3>
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
                {products.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.imageUrls?.[0] && <img src={p.imageUrls[0]} alt={p.title} style={{ width: 50, height: 50, objectFit: "cover" }} />}</td>
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
          
          <div className="pagination">
            <span>共 {totalItems} 条，每页 {pageSize} 条</span>
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev Page</button>
            <span>{page} / {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next Page</button>
          </div>
        </div>
      )}
    </div>
  );
}
