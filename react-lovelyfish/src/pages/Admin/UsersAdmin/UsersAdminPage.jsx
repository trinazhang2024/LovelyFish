// 用户管理页 UsersAdminPage.jsx，功能包括：

// 显示所有用户

// 显示每个用户的订单数量

// 显示是否启用（Active）

// 可以禁用/启用用户


import React, { useEffect, useState } from "react";
import api from "../../../API/axios";

export default function UsersAdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users"); // 假设后端接口 /api/users 返回所有用户及订单数量
      setUsers(res.data || []);
    } catch (err) {
      console.error("获取用户列表失败:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id, active) => {
    try {
      await api.put(`/users/${id}/active`, { active });
      fetchUsers();
    } catch (err) {
      console.error("修改用户状态失败:", err);
    }
  };

  if (loading) return <p>加载中...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">用户管理</h1>
      {users.length === 0 ? (
        <p>暂无用户</p>
      ) : (
        <table className="min-w-full border border-gray-200 bg-white rounded-lg shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">用户名</th>
              <th className="px-4 py-2 border">邮箱</th>
              <th className="px-4 py-2 border">订单数量</th>
              <th className="px-4 py-2 border">是否启用</th>
              <th className="px-4 py-2 border">操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="text-center">
                <td className="px-4 py-2 border">{user.id}</td>
                <td className="px-4 py-2 border">{user.username}</td>
                <td className="px-4 py-2 border">{user.email}</td>
                <td className="px-4 py-2 border">{user.orderCount}</td>
                <td className="px-4 py-2 border">{user.active ? "是" : "否"}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => toggleActive(user.id, !user.active)}
                    className={`px-3 py-1 rounded ${
                      user.active ? "bg-red-500 text-white" : "bg-green-500 text-white"
                    }`}
                  >
                    {user.active ? "禁用" : "启用"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
