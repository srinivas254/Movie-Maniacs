import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Logo } from "./siteLogo.jsx";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { getPasswordStrength } from "./passwordStrength.js";
import { getPasswordIssues } from "./passwordIssues.js";
import { PasswordField } from "./password.jsx";

export function ResetNewPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // ✅ Correct query param
  const rawToken = searchParams.get("rawToken");

  // ✅ State first
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const strength = getPasswordStrength(newPassword);
  const issues = getPasswordIssues(newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!rawToken) {
      setError("Invalid or missing reset token");
      return;
    }

    if (!strength.isValid) {
      setError("Password does not meet requirements");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:8080/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rawToken,
            newPassword,
            confirmPassword,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong please try again!");
      }

      toast.success(data.message);

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center 
      bg-gradient-to-br from-black via-neutral-800 to-purple-500 px-4">

      <Logo className="text-2xl mb-12 cursor-default" />

      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">
            Reset Password
          </h2>

          <p className="text-sm text-gray-500 text-center mb-6">
            Enter your new password below
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* ✅ New Password (Reusable component) */}
            <div>
              <label className="text-sm text-gray-600">New Password</label>

              <PasswordField
                value={newPassword}
                onChange={(val) => {
                  setNewPassword(val);
                  setError("");
                }}
                passwordStrength={strength}
                issues={issues}
                inputClassName="border border-gray-300 rounded-xl
                  focus:ring-purple-400"
              />
            </div>

            {/* ✅ Confirm Password (independent eye toggle) */}
            <div>
              <label className="text-sm text-gray-600">Confirm Password</label>
              <div className="relative mt-1">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError("");
                  }}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2
                    focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white
                font-medium py-2 rounded-3xl transition
                disabled:bg-gray-400 disabled:text-gray-700
                disabled:cursor-not-allowed"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
