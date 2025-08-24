import React, { useEffect, useState } from "react";
import api from "../../../API/axios";
import "./OrdersAdminPage.css";

export default function OrdersAdminPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedFields, setSavedFields] = useState({}); // 保存已修改的字段状态

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/admin");
      setOrders(res.data || []);
    } catch (err) {
      console.error("获取订单失败:", err);
    } finally {
      setLoading(false);
    }
  };

  const flashSaved = (orderId, field) => {
    const key = `${orderId}-${field}`;
    setSavedFields((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setSavedFields((prev) => ({ ...prev, [key]: false }));
    }, 2000);
  };

  const updateStatus = async (id, status) => {
    console.log("点击更新状态:", id, status);
    try {
      await api.put(`/orders/${id}/status`,  status , {
        headers: { "Content-Type": "application/json" },
      });
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o))
      );
      flashSaved(id, "status");
    } catch (err) {
      console.error("更新状态失败", err);
    }
  };

  const updateShipping = async (id, courier, trackingNumber) => {
    try {
      await api.put(`/orders/${id}/shipping`, { courier, trackingNumber });
      setOrders((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, courier, trackingNumber } : o
        )
      );
      flashSaved(id, "courier");
      flashSaved(id, "trackingNumber");
    } catch (err) {
      console.error("更新快递信息失败", err);
    }
  };

  // 临时更新输入框值，不触发接口
  const updateOrderField = (id, field, value) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, [field]: value } : o))
    );
  };

  if (loading) return <p>加载中...</p>;

  return (
    <div>
      <h1 className="orders-page-title">订单管理</h1>

      {orders.length === 0 ? (
        <p className="orders-empty">暂无订单</p>
      ) : (
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>订单ID</th>
                <th>客户姓名</th>
                <th>电话</th>
                <th>收货地址</th>
                <th>总价</th>
                <th>状态</th>
                <th>快递公司</th>
                <th>快递单号</th>
                <th>创建时间</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const statusSaved = savedFields[`${order.id}-status`];
                const courierSaved = savedFields[`${order.id}-courier`];
                const trackingSaved = savedFields[`${order.id}-trackingNumber`];

                return (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.customerName}</td>
                    <td>{order.phoneNumber || order.contactPhone}</td>
                    <td>{order.shippingAddress}</td>
                    <td>${order.totalPrice.toFixed(2)}</td>

                    <td className={statusSaved ? "saved-flash" : ""}>
                      <select
                        value={order.status || "pending"}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                      >
                        <option value="pending">待付款</option>
                        <option value="paid">已付款</option>
                        <option value="shipped">已发货</option>
                        <option value="completed">已完成</option>
                      </select>
                    </td>

                    <td className={courierSaved ? "saved-flash" : ""}>
                      <input
                        value={order.courier || ""}
                        onChange={(e) =>
                          updateOrderField(order.id, "courier", e.target.value)
                        }
                        onBlur={(e) =>
                          updateShipping(order.id, e.target.value, order.trackingNumber || "")
                        }
                      />
                    </td>

                    <td className={trackingSaved ? "saved-flash" : ""}>
                      <input
                        value={order.trackingNumber || ""}
                        onChange={(e) =>
                          updateOrderField(order.id, "trackingNumber", e.target.value)
                        }
                        onBlur={(e) =>
                          updateShipping(order.id, order.courier || "", e.target.value)
                        }
                      />
                    </td>

                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
