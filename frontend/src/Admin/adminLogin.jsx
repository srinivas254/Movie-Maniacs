import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Logo } from "../siteLogo.jsx";
import toast from "react-hot-toast";

export function AdminLoginPage() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const navigate = useNavigate();

  const isFormValid = userName.trim() !== "" && password.trim() !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid || isLoggingIn) return;

    try {
      setIsLoggingIn(true);

      const response = await fetch("http://localhost:8080/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: userName.trim(),
          password: password.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors || "Something went wrong");
      }

      const data = await response.json();

      localStorage.setItem("token", data.token);
      toast.success(data.message);
      setTimeout(() => {
        navigate("/admin");
      }, 1500);
    } catch (err) {
      setLoginError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div
      className="
        min-h-screen flex flex-col items-center justify-center
        bg-gradient-to-br from-black via-neutral-800 to-red-700
        px-4 relative
      "
    >
      <div
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 cursor-pointer"
      >
        <Logo className="text-2xl text-white" />
      </div>

      <div
        className="
          w-full max-w-sm bg-white rounded-2xl
          shadow-xl p-6
        "
      >
        <h2
          className="
            text-2xl font-semibold text-center
            text-gray-800 mb-6
          "
        >
          Admin Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <h4 className="text-sm cursor-default">Username</h4>

          <input
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
              setLoginError("");
            }}
            className="
              w-full border border-gray-300
              rounded-lg px-4 py-2
              focus:outline-none
              focus:ring-2 focus:ring-red-500
            "
            required
          />

          <h4 className="text-sm cursor-default">Password</h4>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setLoginError("");
              }}
              className="
                w-full border border-gray-300
                rounded-lg px-4 py-2
                focus:outline-none
                focus:ring-2 focus:ring-red-500
              "
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="
                absolute right-3 top-1/2
                -translate-y-1/2 text-gray-500
              "
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={!isFormValid || isLoggingIn}
            className="
              w-full bg-red-600 hover:bg-red-500
              text-white font-medium py-2
              rounded-3xl transition
              disabled:bg-gray-400
              disabled:text-gray-700
              disabled:cursor-not-allowed
              disabled:hover:bg-gray-400
            "
          >
            {isLoggingIn ? "Logging in..." : "Login"}
          </button>

          {loginError && (
            <p
              className="
                text-sm text-red-600 text-center
              "
            >
              {loginError}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
