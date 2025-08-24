// src/pages/admin/Dashboard.jsx
import React, { useState } from "react";
import ProductsAdminPage from '../ProductsAdmin/ProductsAdminPage';
import OrdersAdminPage from "../OrdersAdmin/OrdersAdminPage";
import UsersAdminPage from "../UsersAdmin/UsersAdminPage";
import AdminChangePassword from '../ChangePassword/AdminChangePassword'
import './Dashboard.css';

export default function Dashboard() {
  const [activePage, setActivePage] = useState("orders");

  const renderPage = () => {
    switch (activePage) {
      case "orders":
        return <OrdersAdminPage />;
      case "products":
        return <ProductsAdminPage />;
      case "users":
        return <UsersAdminPage />;
      default:
        return <OrdersAdminPage />;
    }
  };

  return (
    <div className="dashboard">
      {/* 左侧导航 */}
      <aside className="dashboard-aside">
        <div className="title">Admin Dashboard</div>
        <nav>
          <button
            className={activePage === "orders" ? "active" : ""}
            onClick={() => setActivePage("orders")}
          >
            订单管理
          </button>
          <button
            className={activePage === "products" ? "active" : ""}
            onClick={() => setActivePage("products")}
          >
            产品管理
          </button>
          <button
            className={activePage === "users" ? "active" : ""}
            onClick={() => setActivePage("users")}
          >
            用户管理
          </button>
        </nav>
      </aside>

      {/* 右侧内容 */}
      <div className="dashboard-main">
        <div className="dashboard-header">
          <button className="change-password-btn" onClick={() => setActivePage("changePassword")}>
            修改密码
          </button>
        </div>
        {activePage === "changePassword" ? <AdminChangePassword /> : renderPage()}
      </div>
    </div>
  );
}


// 后台 Dashboard 功能点

// 订单管理

// 查看所有用户的订单（分页 / 筛选）

// 修改订单状态（pending → 已付款 → 已发货 → 已完成）

// 编辑快递公司、快递单号

// 搜索订单（按用户、时间、订单号等）

// 商品管理

// 添加 / 编辑 / 删除商品

// 管理库存、价格、图片

// 用户管理

// 查看用户列表

// 查询用户的历史订单

// 统计报表（后期可做）

// 总销售额

// 每日/每月订单数

// 热销商品排行
