import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../../../API/axios";
import "../../Admin/AdminPages.css";
import "./UsersAdminPage.css";

export default function UsersAdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  // 获取用户列表
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/users", {
        params: { search, page, pageSize },
      });

      // 数据结构：{ items: [...], totalPages: n }
      setUsers(res.data.items || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("获取用户列表失败:", err);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // 切换用户启用/禁用状态
  const toggleActive = async (id, active) => {
    try {
      await api.put(`/api/admin/users/${id}/active`, { active });
      fetchUsers(); // 刷新列表
    } catch (err) {
      console.error("修改用户状态失败:", err);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  if (loading) return <p className="loading-text">加载中...</p>;

  return (
    <div className="users-admin-page">
      <nav className="breadcrumb">
        <Link to="/admin/dashboard">后台管理</Link> &gt; <span>用户管理</span>
      </nav>

      <h1 className="page-title">用户管理</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="搜索用户名或邮箱"
          value={search}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      {users.length === 0 ? (
        <p className="no-users">暂无用户</p>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>用户名</th>
                <th>邮箱</th>
                <th>订单数量</th>
                <th>是否启用</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td data-label="ID">{user.id}</td>
                  <td data-label="用户名">{user.username}</td>
                  <td data-label="邮箱">{user.email}</td>
                  <td data-label="订单数量">
                    <Link
                      to={`/admin/users/${user.id}/orders`}
                      className="btn-view-orders"
                    >
                      {user.orderCount}
                    </Link>
                  </td>
                  <td data-label="是否启用">{user.active ? "是" : "否"}</td>
                  <td data-label="操作" className="action-buttons">
                    <button
                      onClick={() => toggleActive(user.id, !user.active)}
                      className={user.active ? "btn-disable" : "btn-enable"}
                    >
                      {user.active ? "禁用" : "启用"}
                    </button>
                    <Link
                      to={`/admin/users/${user.id}/orders`}
                      className="btn-view-orders"
                    >
                      查看订单
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 分页 */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            className={`page-btn ${page === i + 1 ? "active" : ""}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

