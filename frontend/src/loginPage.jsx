import { useState } from "react";
import { Logo } from "./siteLogo.jsx";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { getPasswordStrength } from "./passwordStrength";
import { useNavigate } from "react-router-dom";

export function Login() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black 
    via-neutral-800 to-purple-500 px-4">
      
      <h1>
         <Logo className="text-2xl mb-10 cursor-default"/>
      </h1>

      <LoginCard />

      <p className="text-white text-sm mt-4">
        Don’t have an account?{" "}
        <span 
        onClick = {() => navigate("/register")}
        className="font-semibold cursor-pointer hover:underline decoration-white">
          Register
        </span>
      </p>
    </div>
  );
}

function LoginCard(){
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const passwordStrength = getPasswordStrength(password);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    const isIdentifierValid =
      identifier.trim() !== "" &&
    (
      emailRegex.test(identifier) ||   
      identifier.length >= 3           
    );

    const isFormValid =
      isIdentifierValid &&
      passwordStrength.isValid;

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return(
              <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <h4 className="text-sm cursor-default">Username or Email</h4>
          <input
            type="text"
            placeholder="Username or Email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
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
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 
            focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
            />

            <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {showPassword ? (
              <EyeSlashIcon className="w-5 h-5" />
              ) : (
              <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
          

          <button
            type="submit"
            disabled={!isFormValid}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-medium py-2 
            rounded-3xl transition disabled:bg-gray-400 disabled:text-gray-700
            disabled:cursor-not-allowed disabled:hover:bg-gray-400"
          >
            Login
          </button>

          <div className="text-center">
            <a
              href="#"
              className="text-sm text-purple-600 hover:underline"
            >
              Forgot password?
            </a>
          </div>
        </form>
      </div>
    );
}
