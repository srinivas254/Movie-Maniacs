import { useState,useEffect } from "react";
import { Logo } from "./siteLogo.jsx";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useNavigate,useSearchParams } from "react-router-dom";
import { GoogleOAuthButton } from "./googleoAuth.jsx";

export function Login() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black 
    via-neutral-800 to-purple-500 px-4"
    >
      <h1>
        <Logo className="text-2xl mb-10 cursor-default" />
      </h1>

      <LoginCard />

      <p className="text-white text-sm mt-4">
        Don’t have an account?{" "}
        <span
          onClick={() => navigate("/register")}
          className="font-semibold cursor-pointer hover:underline decoration-white"
        >
          Register
        </span>
      </p>
    </div>
  );
}

function LoginCard() {
  const [emailOrUserName, setEmailOrUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState("");  
  const [oAuthloginError, setOAuthLoginError] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
  const error = searchParams.get("error");
  if (error) {
    setOAuthLoginError(error);
  }
}, [searchParams]);

  const isFormValid = emailOrUserName.trim() !== "" && password.trim() !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid || isLoggingIn) return;

    try {
      setIsLoggingIn(true);

      const response = await fetch("http://localhost:8080/auth/jwt/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailOrUserName: emailOrUserName.trim(),
          password: password.trim(),
        }),
      });

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error("Bad request");
        }

        if (response.status === 401) {
          throw new Error("Invalid credentials");
        }

        if (response.status === 500) {
          throw new Error("Server error");
        }

        throw new Error("Something went wrong");
      }

      const data = await response.json();

      sessionStorage.setItem("userId", data.id);

      setTimeout(() => {
        navigate("/verify-otp");
      }, 1500);
    } catch (err) {
      console.error("Login failed", err);
      setLoginError(err.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Login
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <h4 className="text-sm cursor-default">Username or Email</h4>
        <input
          type="text"
          placeholder="Username or Email"
          value={emailOrUserName}
          onChange={(e) => {
            setEmailOrUserName(e.target.value);
            setLoginError("");
          }}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none 
            focus:ring-2 focus:ring-gray-400"
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
            className="w-full border border-gray-300 rounded-lg px-4 py-2 
            focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
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
          className="w-full bg-purple-600 hover:bg-purple-500 text-white font-medium py-2 
            rounded-3xl transition disabled:bg-gray-400 disabled:text-gray-700
            disabled:cursor-not-allowed disabled:hover:bg-gray-400"
        >
          {isLoggingIn ? "Sending OTP..." : "Login"}
        </button>

        {loginError && (
          <p className="text-sm text-red-600 text-center">{loginError}</p>
        )}

        <div className="text-center">
          <span className="text-sm text-purple-600 hover:underline cursor-pointer">
            Forgot password?
          </span>
        </div>
      </form>

      <div className="my-4 text-center text-gray-400 text-sm">OR</div>

      <GoogleOAuthButton text="Login with Google" mode="login" />

      {oAuthloginError && (
        <p className="text-sm text-red-600 text-center mt-2">
          {oAuthloginError}
        </p>
      )}
    </div>
  );
}
