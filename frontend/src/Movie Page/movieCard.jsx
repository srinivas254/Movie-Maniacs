import { useNavigate } from "react-router-dom";
import "../index.css";

export function MovieCard({ movie, disableNavigation = false }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        if (disableNavigation) return;
        navigate(`/movie/${movie.slugUrl}`);
      }}
      className="
        movie-card
        flex flex-col
        gap-1
        w-36
        cursor-pointer
        hover:scale-105
        transition
      "
    >
      <img
        src={movie.posterSmallUrl}
        alt={movie.name}
        className="
          w-full
          aspect-[2/3]
          object-cover
          rounded-xl
        "
      />

      <div className="overflow-hidden">
        <h4
          className="
    movie-title
    text-white
    text-lg
    font-medium
    whitespace-nowrap
    inline-block
  "
        >
          {movie.name}
        </h4>
      </div>

      <span
        className="
          text-gray-300
          text-sm
          drop-shadow-[0_0_4px_rgba(255,255,255,0.35)]
        "
      >
        {movie.year}
      </span>
    </div>
  );
}
