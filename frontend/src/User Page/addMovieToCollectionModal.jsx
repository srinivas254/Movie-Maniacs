import { useEffect, useRef, useState } from "react";
import {
  MagnifyingGlassIcon,
  CheckIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export function AddMovieToCollectionModal({
  open,
  onClose,
  selectedMovies,
  setSelectedMovies,
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const modalRef = useRef(null);

  const token = localStorage.getItem("token");

  const isSelected = (movieId) => selectedMovies.some((m) => m.id === movieId);

  const toggleMovie = (movie) => {
    setSelectedMovies((prev) => {
      const exists = prev.some((m) => m.id === movie.id);

      if (exists) {
        return prev.filter((m) => m.id !== movie.id);
      }

      return [...prev, movie];
    });
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setQuery("");
        setResults([]);
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:8080/movies/search?q=${query}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.log(err);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [query, token]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex justify-center pt-10">
      <div
        ref={modalRef}
        className="
          w-[650px]
          bg-[#0f0f0f]
          border border-white/10
          rounded-2xl
          shadow-2xl
          overflow-hidden
        "
      >
        <div className="flex items-center px-4 py-4 border-b border-white/10">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 mr-3" />

          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies..."
            className="
              flex-1 bg-transparent
              text-white
              placeholder-gray-500
              outline-none
            "
          />

          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[500px] overflow-y-auto">
          {results.length === 0 ? (
            <div className="py-16 text-center text-gray-500">
              {query ? "No movies found" : "Search for movies"}
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {results.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => toggleMovie(movie)}
                  className="
                    flex items-center justify-between
                    p-3 rounded-xl
                    hover:bg-white/5
                    cursor-pointer
                    transition
                  "
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={movie.posterSmallUrl}
                      alt={movie.name}
                      className="w-14 h-14 rounded-lg object-cover"
                    />

                    <div>
                      <h3 className="text-white text-sm font-medium">
                        {movie.name}
                      </h3>

                      <p className="text-gray-400 text-xs">{movie.year}</p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMovie(movie);
                    }}
                    className="
                      w-9 h-9
                      flex items-center justify-center
                      rounded-full
                      bg-white/10
                    "
                  >
                    {isSelected(movie.id) ? (
                      <CheckIcon className="w-5 h-5 text-green-400" />
                    ) : (
                      <PlusIcon className="w-5 h-5 text-white" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
