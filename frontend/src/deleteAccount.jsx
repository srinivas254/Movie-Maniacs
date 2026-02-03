
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useUserStore from "./useUserStore.js";
import { ConfirmModal } from "./confirmationModal.jsx";

export default function DeleteAccount() {
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);

  const clearProfile = useUserStore((state) => state.clearProfile);
  const navigate = useNavigate();

  /* ---------------- Delete Request ---------------- */

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

      if (!response.ok) {
        throw new Error("Wrong password or failed");
      }

      toast.success("Account deleted successfully");

      localStorage.removeItem("token");
      clearProfile();

      navigate("/login");
    } catch (err) {
      toast.error(err.message);
    }
  };

  /* ---------------- UI ---------------- */

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
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-zinc-900 rounded-lg px-3 py-2 outline-none"
        />
      </div>

      {/* Delete Button */}
      <button
        onClick={() => {
          if (!password) {
            toast.error("Enter password");
            return;
          }
          setShowModal(true);
        }}
        className="bg-red-600 hover:bg-red-500
                   px-6 py-2 rounded-lg font-medium"
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
