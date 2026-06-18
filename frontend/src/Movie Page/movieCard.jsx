import { useNavigate } from "react-router-dom";

export function MovieCard({ movie, disableNavigation = false}) {
  const navigate = useNavigate();
  return (
    <div
     onClick={() => {
      if (disableNavigation) return;
      navigate(`/movie/${movie.slugUrl}`)}
      } 
      className="
        flex flex-col
        gap-2
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

      <h4 className="text-white text-lg font-medium truncate">
        {movie.name}
      </h4>

      <span className="text-gray-400 text-sm">
        {movie.year}
      </span>
    </div>
  );
}