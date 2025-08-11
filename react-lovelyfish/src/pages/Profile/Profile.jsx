import React, { useState, useEffect } from "react";
import api from "../../API/axios";
import { useUser } from "../../contexts/UserContext";
import "./Profile.css";

export default function ProfilePage() {
  const { user, logout } = useUser();

  // 控制修改密码表单显示/隐藏
  const [showChangePwdForm, setShowChangePwdForm] = useState(false);

  // 修改密码相关状态
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [changePwdMessage, setChangePwdMessage] = useState(null);
  const [changePwdError, setChangePwdError] = useState(null);
  const [loadingChangePwd, setLoadingChangePwd] = useState(false);

  // 订单历史
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState(null);

  // 获取订单列表
  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingOrders(true);
      setOrdersError(null);
      try {
        const res = await api.get("/orders"); // 这里路径你按实际接口改
        setOrders(res.data);
      } catch (err) {
        setOrdersError("加载订单失败，请稍后重试");
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, []);

  //不想让提示框一直占位置，可以加一个 自动消失 功能
  useEffect(() => {
    if (changePwdMessage || changePwdError) {
      const timer = setTimeout(() => {
        setChangePwdMessage(null);
        setChangePwdError(null);
      }, 3000); // 3秒后消失
      return () => clearTimeout(timer);
    }
  }, [changePwdMessage, changePwdError]);
  

  // 处理修改密码
  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    // Clear password
    setChangePwdMessage(null);
    setChangePwdError(null);

    // Check the new password and confirm one
    if (newPassword !== confirmNewPassword) {
      setChangePwdError("新密码和确认密码不一致");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setChangePwdError(
        "密码必须至少8位，包含大写字母、小写字母、数字和特殊字符"
      );
      return;
    }

    setLoadingChangePwd(true);

    try {
      await api.post("/account/change-password", {
        oldPassword,
        newPassword,
      });
      setChangePwdMessage("密码修改成功");
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setShowChangePwdForm(false);
    } catch (err) {
      setChangePwdError(err.response?.data?.message || "修改密码失败");
    } finally {
      setLoadingChangePwd(false);
    }
  };

  return (
    <div className="profile-container">
      <h2>个人资料</h2>

      <div className="profile-info">
        <p><strong>邮箱：</strong>{user?.email || "加载中..."}</p>
        {/* 如果有昵称字段可以放这里 */}
      </div>

      <section className="change-password-section">
        <button
          className="toggle-password-btn"
          onClick={() => setShowChangePwdForm(!showChangePwdForm)}
        >
          {showChangePwdForm ? "取消修改密码" : "修改密码"}
        </button>

        
        {/* 成功提示  */}
        {changePwdMessage && (
          <div className="alert alert-success alert-dismissible fade show mt-3" role="alert">
            {changePwdMessage}
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="alert"
              aria-label="Close"
            ></button>
          </div>
        )}
        {/* 错误提示 */}
        {changePwdError && (
          <div className="alert alert-danger alert-dismissible fade show mt-3" role="alert">
            {changePwdError}
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="alert"
              aria-label="Close"
            ></button>
          </div>
        )}

        {showChangePwdForm && (
        <>
          <form
            onSubmit={handleChangePassword}
            className="change-password-form"
            autoComplete="off"
          >
            <div className="password-requirements">
              密码要求：至少8位，包含大写字母、小写字母、数字和特殊字符
            </div>
            <input
              type="password"
              placeholder="当前密码"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="新密码"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="确认新密码"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
            <button
              className="change-password-button"
              type="submit"
              disabled={loadingChangePwd}
            >
              {loadingChangePwd ? "提交中..." : "提交修改"}
            </button>
          </form>
        </>
        )}
      </section>

      <section className="orders-section">
        <h3>订单历史</h3>
        {loadingOrders && <p>加载中...</p>}
        {ordersError && <p className="error-text">{ordersError}</p>}

        {!loadingOrders && orders.length === 0 && <p>你还没有订单哦</p>}

        <ul className="orders-list">
          {orders.map((order) => (
            <li key={order.id} className="order-item">
              <div>订单号: {order.id}</div>
              <div>日期: {new Date(order.date).toLocaleDateString()}</div>
              <div>状态: {order.status}</div>
              <div>总价: ${order.total}</div>
              {/* 可根据订单结构显示更多 */}
            </li>
          ))}
        </ul>
      </section>

      <button className="logout-button" onClick={logout}>
        退出登录
      </button>
    </div>
  );
}
