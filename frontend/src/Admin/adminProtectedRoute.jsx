import { Navigate } from "react-router-dom";
import { Forbidden403 } from "../forbidden403";
import { jwtDecode } from "jwt-decode";

export function AdminProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/admin-view/login" replace />;
  }

  let decoded = null;
  try {
    decoded = jwtDecode(token);
  } catch {
    localStorage.removeItem("token");
    return (<Navigate to="/admin-view/login" replace />);
  }

  if (decoded.role !== "ADMIN") {
    return <Forbidden403 />;
  }

  return children;
}

