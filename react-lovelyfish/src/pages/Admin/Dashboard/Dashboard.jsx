// src/pages/admin/Dashboard.jsx
import React, { useState } from "react";
import ProductsAdminPage from '../ProductsAdmin/ProductsAdminPage';
import OrdersAdminPage from "../OrdersAdmin/OrdersAdminPage";
import UsersAdminPage from "../UsersAdmin/UsersAdminPage";
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
    <div className="flex h-screen">
      {/* 左侧导航 */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-gray-700">
          Admin Dashboard
        </div>
        <nav className="flex-1 p-2 space-y-2">
          <button
            className={`w-full text-left px-4 py-2 rounded-lg ${
              activePage === "orders" ? "bg-gray-700" : "hover:bg-gray-700"
            }`}
            onClick={() => setActivePage("orders")}
          >
            订单管理
          </button>
          <button
            className={`w-full text-left px-4 py-2 rounded-lg ${
              activePage === "products" ? "bg-gray-700" : "hover:bg-gray-700"
            }`}
            onClick={() => setActivePage("products")}
          >
            产品管理
          </button>
          <button
            className={`w-full text-left px-4 py-2 rounded-lg ${
              activePage === "users" ? "bg-gray-700" : "hover:bg-gray-700"
            }`}
            onClick={() => setActivePage("users")}
          >
            用户管理
          </button>
        </nav>
      </aside>

      {/* 右侧内容区 */}
      <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        {renderPage()}
      </main>
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
