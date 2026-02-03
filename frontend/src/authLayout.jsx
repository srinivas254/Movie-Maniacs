import { Outlet, useNavigate } from "react-router-dom";
import { AuthNavbar } from "./authNavbar.jsx";
import { useEffect } from "react";

export function AuthLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiryTime = payload.exp * 1000;
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
  }, [navigate]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black 
        via-neutral-900 to-purple-900 px-4"
    >
      <AuthNavbar />
      <Outlet />
    </div>
  );
}
