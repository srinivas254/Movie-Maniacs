import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import useUserStore from "../Zustand Store/useUserStore";
import { getMyProfile } from "../Util/myProfileResponse";
import { Forbidden403 } from "../forbidden403";

export function ProtectedRoute({ children }) {

  const token = localStorage.getItem("token");
  const profile = useUserStore((state) => state.profile);
  const setProfile = useUserStore((state) => state.setProfile);
  const [loading, setLoading] = useState(true);

  let decoded = null;

  if (token) {

    try {
      decoded = jwtDecode(token);
    } catch {
      localStorage.removeItem("token");
    }
  }

  useEffect(() => {

    const loadProfile = async () => {
      try {

        if (!token || !decoded) {
          return;
        }

        if (profile) {
          setLoading(false);
          return;
        }
        const data = await getMyProfile();
        setProfile(data);

      } catch (err) {
        console.error("Profile fetch failed:",err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();

  }, [token, decoded, profile, setProfile]);

  if (!token || !decoded) {
    return <Navigate to="/" replace />;
  }

  if (decoded.role !== "USER") {
    return <Forbidden403 />;
  }

  if (loading) {
    return (
      <div
        className="
          min-h-screen flex items-center
          justify-center text-white
        "
      >
        Loading...
      </div>
    );
  }

  return children;
}