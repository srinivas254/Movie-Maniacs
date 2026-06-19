import { Outlet, useNavigate } from "react-router-dom";
import { AuthNavbar } from "../User Page/authNavbar.jsx";
import { useEffect } from "react";
import { useUserStore } from "../Zustand Store/useUserStore.js";
import { useMovieStore } from "../Zustand Store/useMovieStore.js";

export function AuthLayout() {
  const navigate = useNavigate();
  const clearProfile = useUserStore((state) => state.clearProfile);
  const clearExploreMovies = useMovieStore((state) => state.clearExploreMovies);

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
      clearProfile();
      clearExploreMovies();
      navigate("/");
      return;
    }

    const timeout = setTimeout(() => {
      localStorage.removeItem("token");
      clearProfile();
      clearExploreMovies();
      navigate("/");
    }, expiryTime - currentTime);

    return () => clearTimeout(timeout);
  }, [navigate, clearProfile, clearExploreMovies]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-purple-900 text-white">
      <AuthNavbar />

      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
}
