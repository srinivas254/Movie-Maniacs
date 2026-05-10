import { useNavigate } from "react-router-dom";
import { Logo } from "./siteLogo.jsx";

export function Forbidden403() {

  const navigate = useNavigate();

  return (
    <div
      className="
        min-h-screen flex flex-col items-center justify-center
        bg-gradient-to-br from-black via-neutral-800 to-red-700
        px-4 text-white
      "
    >

      <Logo className="text-2xl mb-8 cursor-default" />

      <div
        className="
          bg-gray-200 rounded-2xl shadow-xl
          p-10 text-center max-w-md
        "
      >

        <h1
          className="
            text-6xl font-bold text-red-600 mb-4
          "
        >
          403
        </h1>

        <h2
          className="
            text-xl font-semibold text-gray-700 mb-3
          "
        >
          Role Not Eligible
        </h2>

        <p className="text-gray-500 mb-6">
          You are not authorized to access this page.
        </p>

        <button
          onClick={() => navigate("/")}
          className="
            bg-red-600 hover:bg-red-500
            text-white px-6 py-2
            rounded-3xl transition
          "
        >
          Go Home
        </button>

      </div>
    </div>
  );
}