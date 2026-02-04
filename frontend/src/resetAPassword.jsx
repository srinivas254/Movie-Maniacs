import { useState } from "react";
import toast from "react-hot-toast";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

import { PasswordField } from "./password.jsx";
import { getPasswordStrength } from "./passwordStrength.js";
import { getPasswordIssues } from "./passwordIssues.js";

export function ResetPassword() {

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");

  const strength = getPasswordStrength(newPassword);
  const issues = getPasswordIssues(newPassword);

  const handleResetPassword = async () => {

    if (!strength.isValid) {
      setError("Password does not meet requirements");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Confirm Password do not match new password");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/users/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            oldPassword,
            newPassword,
            confirmPassword,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Reset failed");
      }

      toast.success("Password reset successful");

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="flex-1 max-w-5xl p-6 rounded-xl
                 bg-black/60 backdrop-blur-md
                 border border-white/10 shadow-2xl"
    >
      <h2 className="text-xl font-semibold mb-6">
        Reset Password
      </h2>

      {/* Old Password */}
      <div className="relative">
        <input
          type={showOld ? "text" : "password"}
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => {
            setOldPassword(e.target.value);
            setError("");
          }}
          className="w-full rounded-lg px-4 py-2 pr-10
                     bg-zinc-900 text-white
                     border border-white/10
                     outline-none"
        />

        <button
          type="button"
          onClick={() => setShowOld(!showOld)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
        >
          {showOld ? (
            <EyeSlashIcon className="w-5 h-5" />
          ) : (
            <EyeIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* New Password (with strength) */}
      <div className="mt-4">
        <PasswordField
          value={newPassword}
          onChange={(val) => {
            setNewPassword(val);
            setError("");
          }}
          passwordStrength={strength}
          issues={issues}
          inputClassName="bg-zinc-900 text-white border border-white/10"
          issuesClassName="text-white"
        />
      </div>

      {/* Confirm Password */}
      <div className="relative mt-4">
        <input
          type={showConfirm ? "text" : "password"}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setError("");
          }}
          className="w-full rounded-lg px-4 py-2 pr-10
                     bg-zinc-900 text-white
                     border border-white/10
                     outline-none"
        />

        <button
          type="button"
          onClick={() => setShowConfirm(!showConfirm)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
        >
          {showConfirm ? (
            <EyeSlashIcon className="w-5 h-5" />
          ) : (
            <EyeIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-3">
          {error}
        </p>
      )}

      <button
        disabled={!strength.isValid}
        onClick={handleResetPassword}
        className={`mt-5 px-6 py-2 rounded-lg font-medium
          ${
            strength.isValid
              ? "bg-purple-600 hover:bg-purple-500"
              : "bg-zinc-700 cursor-not-allowed opacity-60"
          }
        `}
      >
        Reset Password
      </button>
    </div>
  );
}
