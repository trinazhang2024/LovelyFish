import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../../API/axios";
import "../../Admin/AdminPages.css";
import "./OrderDetailPage.css";

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedFields, setSavedFields] = useState({});

  // ---------------- Fetch Order Details ----------------
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/admin/orders/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        console.error("Failed to fetch order details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // ---------------- Flash Animation after Save ----------------
  const flashSaved = (field) => {
    setSavedFields((prev) => ({ ...prev, [field]: true }));
    setTimeout(
      () => setSavedFields((prev) => ({ ...prev, [field]: false })),
      2000
    );
  };

  // ---------------- Update Shipping Info ----------------
  const updateShipping = async (field, value) => {
    if (!order) return;
    try {
      const newCourier = field === "courier" ? value : order.courier;
      const newTracking =
        field === "trackingNumber" ? value : order.trackingNumber;

      await api.put(`/orders/${order.id}/shipping`, {
        courier: newCourier,
        trackingNumber: newTracking,
      });

      setOrder((prev) => ({
        ...prev,
        courier: newCourier,
        trackingNumber: newTracking,
      }));
      flashSaved(field);
    } catch (err) {
      console.error("Failed to update shipping info", err);
    }
  };

  // ---------------- Handle Input Change ----------------
  const handleFieldChange = (field, value) => {
    setOrder((prev) => ({ ...prev, [field]: value }));
  };

  // ---------------- Loading & Error State ----------------
  if (loading)
    return <p className="loading-text text-center mt-10">Loading...</p>;
  if (!order)
    return <p className="error-text text-center mt-10">Order Not Found</p>;

  // ---------------- Render Order Details ----------------
  return (
    <div className="order-detail-page p-4">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb mb-4">
        <Link to="/admin">Admin Dashboard</Link> &gt;{" "}
        <Link to="/admin/orders">Order Management</Link> &gt;{" "}
        <span>Order Detail (ID: {order.id})</span>
      </nav>

      {/* Page Title */}
      <h1 className="page-title mb-4">Order Detail (ID: {order.id})</h1>

      {/* Order Information Table */}
      <div className="admin-table-container mb-6">
        <table className="admin-table">
          <tbody>
            <tr>
              <th>Customer Name</th>
              <td>{order.customerName}</td>
            </tr>
            <tr>
              <th>Phone Number</th>
              <td>
                {order.phoneNumber && (
                  <>
                    Account Phone Number: {order.phoneNumber}
                    <br />
                  </>
                )}
                {order.contactPhone && <>Contact Phone: {order.contactPhone}</>}
              </td>
            </tr>
            <tr>
              <th>Delivery Method</th>
              <td>{order.deliveryMethod}</td>
            </tr>
            <tr>
              <th>Shipping Address</th>
              <td>
                {order.deliveryMethod === "pickup"
                  ? "Pickup at store"
                  : order.shippingAddress}
              </td>
            </tr>
            <tr>
              <th>Total Price</th>
              <td>${order.totalPrice.toFixed(2)}</td>
            </tr>
            <tr>
              <th>Status</th>
              <td>
                <span className={`status-badge status-${order.status}`}>
                  {order.status}
                </span>
              </td>
            </tr>
            {/* <tr>
              <th>Courier</th>
              <td className={savedFields["courier"] ? "saved-flash" : ""}>
                <input
                  value={order.courier || ""}
                  onChange={(e) => handleFieldChange("courier", e.target.value)}
                  onBlur={(e) => updateShipping("courier", e.target.value)}
                  placeholder="Courier Company"
                />
              </td>
            </tr>
            <tr>
              <th>Tracking Number</th>
              <td
                className={savedFields["trackingNumber"] ? "saved-flash" : ""}
              >
                <input
                  value={order.trackingNumber || ""}
                  onChange={(e) =>
                    handleFieldChange("trackingNumber", e.target.value)
                  }
                  onBlur={(e) =>
                    updateShipping("trackingNumber", e.target.value)
                  }
                  placeholder="Tracking Number"
                />
              </td>
            </tr> */}

             {/* Only show courier info if deliveryMethod = courier */}
             {order.deliveryMethod === "courier" && (
              <>
                <tr>
                  <th>Courier</th>
                  <td className={savedFields["courier"] ? "saved-flash" : ""}>
                    <input
                      value={order.courier || ""}
                      onChange={(e) =>
                        handleFieldChange("courier", e.target.value)
                      }
                      onBlur={(e) => updateShipping("courier", e.target.value)}
                      placeholder="Courier Company"
                    />
                  </td>
                </tr>
                <tr>
                  <th>Tracking Number</th>
                  <td
                    className={
                      savedFields["trackingNumber"] ? "saved-flash" : ""
                    }
                  >
                    <input
                      value={order.trackingNumber || ""}
                      onChange={(e) =>
                        handleFieldChange("trackingNumber", e.target.value)
                      }
                      onBlur={(e) =>
                        updateShipping("trackingNumber", e.target.value)
                      }
                      placeholder="Tracking Number"
                    />
                  </td>
                </tr>
              </>
            )}


            <tr>
              <th>Created At</th>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Back Button */}
      <Link to="/admin/orders" className="btn return-button">
        Back to Order List
      </Link>
    </div>
  );
}
