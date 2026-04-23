import { useNavigate } from "react-router-dom";

export function ExplorePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-6">
      <p className="text-white text-4xl">
        Explore page
      </p>

      <button
        onClick={() => navigate("/movie/interstellar-2014")}
        className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-full font-semibold transition"
      >
        Go to Interstellar 🚀
      </button>
    </div>
  );
}