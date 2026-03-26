import { useNavigate } from "react-router-dom";

export function PreviewModal({ open, onClose }) {
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 opacity-80">

      {/* Modal Box */}
      <div className="relative w-full
                      bg-black border-t border-white/10
                      rounded-xl px-6 py-4">

        {/* Content */}
        <div className="max-w-7xl mx-auto
                    flex items-center justify-between gap-6">

        <div>
            <h3 className="text-lg font-semibold text-white">
            Preview Movie Maniacs
          </h3>

          <p className="text-gray-400 text-sm py-4">
            Register to rate movies honestly, build collections,
            and discover what’s actually worth watching.
          </p>
        </div>

          <button
            onClick={() => navigate("/register")}
            className="shrink-0 px-6 py-2 rounded-full
                   bg-purple-600 hover:bg-purple-700
                   text-white text-sm font-semibold transition"
          >
            Register for Free
          </button>
        </div>

         {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3
                     text-gray-400 hover:text-white transition"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
