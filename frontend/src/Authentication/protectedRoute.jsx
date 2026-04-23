import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useUserStore from "../Zustand Store/useUserStore";
import { getMyProfile } from "../Util/myProfileResponse";

export function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  const profile = useUserStore((state) => state.profile);
  const setProfile = useUserStore((state) => state.setProfile);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (!token) return;

        if (profile) {
          setLoading(false);
          return;
        }

        const data = await getMyProfile();
        setProfile(data);
      } catch (err) {
        console.error("Profile fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [token, profile, setProfile]);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return children;
}