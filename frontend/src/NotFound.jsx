import { useNavigate } from "react-router-dom";
import { Logo } from "./siteLogo.jsx";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center 
      bg-gradient-to-br from-black via-neutral-800 to-purple-500 px-4 text-white"
    >
      <Logo className="text-2xl mb-8 cursor-default" />

      <div className="bg-gray-200 rounded-2xl shadow-xl p-10 text-center max-w-md">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>

        <h2 className="text-xl font-semibold text-gray-700 mb-3">
          Page Not Found
        </h2>

        <p className="text-gray-500 mb-6">
          The page you are looking for doesn’t exist or may have been moved.
        </p>

        <button
          onClick={() => navigate("/")}
          className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-3xl transition"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}