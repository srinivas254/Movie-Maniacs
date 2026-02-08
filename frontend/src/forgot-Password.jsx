import { useState } from "react";
import { Logo } from "./siteLogo.jsx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8080/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      toast.success(data.message);
      setEmail("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center 
      bg-gradient-to-br from-black via-neutral-800 to-purple-500 px-4"
    >
      <Logo className="text-2xl mb-12 cursor-default" />

      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Body */}
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">
            Forgot Password
          </h2>

          <p className="text-sm text-gray-500 text-center mb-6">
            Enter your email and we’ll send you a reset link
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Email address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                className="mt-1 w-full border border-gray-300 rounded-xl px-4 py-2 
                  focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white 
                font-medium py-2 rounded-3xl transition
                disabled:bg-gray-400 disabled:text-gray-700
                disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>

          <div className="text-center mt-6">
            <span
              onClick={() => navigate("/login")}
              className="text-sm text-purple-600 hover:underline cursor-pointer"
            >
              Back to login
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
