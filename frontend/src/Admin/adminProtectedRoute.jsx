import { Navigate, useNavigate } from "react-router-dom";
import { Forbidden403 } from "../forbidden403";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";

export function AdminProtectedRoute({ children }) {

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  let decoded = null;

  if (token) {
    try {
      decoded = jwtDecode(token);
    } catch {
      localStorage.removeItem("token");
    }
  }

  useEffect(() => {
    if (!decoded) {
      return;
    }

    const expiryTime = decoded.exp * 1000;
    const currentTime = Date.now();
    if (expiryTime <= currentTime) {
      localStorage.removeItem("token");
      navigate("/");
      return;
    }

    const timeout = setTimeout(() => {
      localStorage.removeItem("token");
      navigate("/");
    }, expiryTime - currentTime);

    return () => clearTimeout(timeout);
  }, [decoded, navigate]);

  if (!token || !decoded) {
    return <Navigate to="/admin-view/login" replace />;
  }

  if (decoded.role !== "ADMIN") {
    return <Forbidden403 />;
  }

  return children;
}