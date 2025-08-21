// src/pages/admin/OrdersAdminPage.jsx
import React, { useEffect, useState } from "react";
import api from "../../../API/axios";
import "./OrdersAdminPage.css";

export default function OrdersAdminPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/admin"); // 管理员接口
      setOrders(res.data || []);
    } catch (err) {
      console.error("获取订单失败:", err);
    } finally {
      setLoading(false);
    }
  };

  // 修改订单状态
  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, JSON.stringify(status), {
        headers: { "Content-Type": "application/json" },
      });
      fetchOrders();
    } catch (err) {
      console.error("更新状态失败", err);
    }
  };

  // 修改快递信息
  const updateShipping = async (id, courier, trackingNumber) => {
    try {
      await api.put(`/orders/${id}/shipping`, { courier, trackingNumber });
      fetchOrders();
    } catch (err) {
      console.error("更新快递信息失败", err);
    }
  };

  if (loading) return <p>加载中...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">订单管理</h1>

      {orders.length === 0 ? (
        <p>暂无订单</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">订单ID</th>
                <th className="px-4 py-2 border">客户姓名</th>
                <th className="px-4 py-2 border">电话</th>
                <th className="px-4 py-2 border">收货地址</th>
                <th className="px-4 py-2 border">总价</th>
                <th className="px-4 py-2 border">状态</th>
                <th className="px-4 py-2 border">快递公司</th>
                <th className="px-4 py-2 border">快递单号</th>
                <th className="px-4 py-2 border">创建时间</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="text-center">
                  <td className="px-4 py-2 border">{order.id}</td>
                  <td className="px-4 py-2 border">{order.customerName}</td>
                  <td className="px-4 py-2 border">{order.phoneNumber || order.contactPhone}</td>
                  <td className="px-4 py-2 border">{order.shippingAddress}</td>
                  <td className="px-4 py-2 border">${order.totalPrice.toFixed(2)}</td>
                  
                  {/* 状态下拉框 */}
                  <td className="px-4 py-2 border">
                    <select
                      value={order.status || "pending"}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="border px-2 py-1 rounded"
                    >
                      <option value="pending">待付款</option>
                      <option value="paid">已付款</option>
                      <option value="shipped">已发货</option>
                      <option value="completed">已完成</option>
                    </select>
                  </td>

                  {/* 快递公司 */}
                  <td className="px-4 py-2 border">
                    <input
                      value={order.courier || ""}
                      onChange={(e) =>
                        setOrders((prev) =>
                          prev.map((o) =>
                            o.id === order.id ? { ...o, courier: e.target.value } : o
                          )
                        )
                      }
                      onBlur={(e) =>
                        updateShipping(order.id, e.target.value, order.trackingNumber || "")
                      }
                      className="border px-2 py-1 rounded w-full"
                    />
                  </td>

                  {/* 快递单号 */}
                  <td className="px-4 py-2 border">
                    <input
                      value={order.trackingNumber || ""}
                      onChange={(e) =>
                        setOrders((prev) =>
                          prev.map((o) =>
                            o.id === order.id ? { ...o, trackingNumber: e.target.value } : o
                          )
                        )
                      }
                      onBlur={(e) =>
                        updateShipping(order.id, order.courier || "", e.target.value)
                      }
                      className="border px-2 py-1 rounded w-full"
                    />
                  </td>

                  <td className="px-4 py-2 border">
                    {new Date(order.createdAt).toLocaleString()}
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


// ✅ 功能说明

// 状态修改：下拉框选择状态，会调用 /orders/{id}/status 更新数据库。

// 快递公司 / 单号：在输入框里修改，onBlur（失去焦点）时调用 /orders/{id}/shipping 更新。

// 数据同步：修改后会重新拉取订单列表，保证表格显示最新数据。