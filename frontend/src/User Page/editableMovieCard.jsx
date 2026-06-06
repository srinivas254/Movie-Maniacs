import { MovieCard } from "../Movie Page/movieCard";

export function EditableMovieCard({ movie, onRemove }) {
  return (
    <div className="relative group">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="
          absolute -top-2 -right-2
          z-50
          w-7 h-7
          rounded-full
          bg-red-500 hover:bg-red-600
          text-white text-xs font-bold
          flex items-center justify-center
          shadow-lg
          transition
        "
      >
        ✕
      </button>

      <MovieCard movie={movie} />
    </div>
  );
}