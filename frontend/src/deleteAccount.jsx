import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useUserStore from "./useUserStore.js";
import { ConfirmModal } from "./confirmationModal.jsx";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export function DeleteAccount() {
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const clearProfile = useUserStore((state) => state.clearProfile);
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch("http://localhost:8080/users/me", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ password }),
      });

      if (!response.status === 204) {
        const data = await response.json();
        throw new Error(data.message || "Delete failed");
      }

      toast.success("Account deleted successfully");

      localStorage.removeItem("token");
      clearProfile();

      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="flex-1 w-full p-6 rounded-xl
                 bg-black/60 backdrop-blur-md
                 border border-red-500/30 shadow-2xl"
    >
      <h2 className="text-xl font-semibold text-red-400 mb-4">
        Delete Account
      </h2>

      <p className="text-gray-400 mb-6">
        This action is permanent and cannot be undone.
      </p>

      {/* Password */}
      <div className="mb-4">
        <label className="text-gray-400 text-sm">Confirm Password</label>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            className="w-full bg-zinc-900 rounded-lg px-3 py-2 
                 outline-none pr-10"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showPassword ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      {/* Delete Button */}
      <button
        disabled={error !== ""}
        onClick={() => {
          if (!password) {
            setError("Enter password");
            return;
          }
          setShowModal(true);
        }}
        className={`px-6 py-2 rounded-lg font-medium
    ${
      error !== ""
        ? "bg-red-800 cursor-not-allowed opacity-60"
        : "bg-red-600 hover:bg-red-500"
    }
  `}
      >
        Delete My Account
      </button>

      {/* Confirmation Modal */}
      {showModal && (
        <ConfirmModal
          onCancel={() => setShowModal(false)}
          onConfirm={handleDeleteAccount}
        />
      )}
    </div>
  );
}
