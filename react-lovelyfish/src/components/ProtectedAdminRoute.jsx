// src/components/ProtectedAdminRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedAdminRoute({ isAdminLoggedIn, children }) {
  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}
