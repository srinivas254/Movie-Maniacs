import { Outlet, useNavigate } from "react-router-dom";
import useUserStore from "../Zustand Store/useUserStore";

export function UserSettings() {
  const navigate = useNavigate();

  const profile = useUserStore((state) => state.profile);
  const hasPassword = profile?.hasPassword;

  return (
    <div
      className="min-h-[calc(100vh-64px)] w-full text-white
                 flex items-start gap-4 px-4 pt-24"
    >
      {/* Sidebar */}
      <div
        className="w-72 p-6 rounded-xl
                   bg-black/60 backdrop-blur-md
                   border border-white/10 shadow-2xl"
      >
        <h2 className="text-xl font-semibold text-center mb-4">Settings</h2>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => navigate("edit-profile")}
            className="text-left px-4 py-2 rounded-lg hover:bg-white/10"
          >
            Edit Profile
          </button>

          <button
            onClick={() => !hasPassword && navigate("set-password")}
            disabled={hasPassword}
            className={`text-left px-4 py-2 rounded-lg ${
              hasPassword
                ? "text-gray-500 cursor-not-allowed"
                : "hover:bg-white/10"
            }`}
          >
            Set Password
          </button>

          <button
            onClick={() => hasPassword && navigate("reset-password")}
            disabled={!hasPassword}
            className={`text-left px-4 py-2 rounded-lg ${
              !hasPassword
                ? "text-gray-500 cursor-not-allowed"
                : "hover:bg-white/10"
            }`}
          >
            Reset Password
          </button>

          <button
            onClick={() => hasPassword && navigate("delete-account")}
            disabled={!hasPassword}
            className={`text-left px-4 py-2 rounded-lg ${
              !hasPassword
                ? "text-gray-500 cursor-not-allowed"
                : "text-red-400 hover:bg-red-500/10"
            }`}
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Right Panel */}
      <Outlet />
    </div>
  );
}
