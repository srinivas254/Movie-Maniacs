import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FireIcon } from "@heroicons/react/24/outline";
import { useUserStore } from "../Zustand Store/useUserStore";
import "../index.css";

export function UserInterestedMovies() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const profile = useUserStore((state) => state.profile);
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile?.userName) return;

    async function loadMovies() {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        const response = await fetch(
          `http://localhost:8080/users/interested-movies`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to load interested movies");
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, [profile?.userName]);

  return (
    <div
      className="
    bg-neutral-900
    rounded-2xl
    p-5
    w-full
    lg:w-[25%]
    flex-shrink-0
    text-white
    h-fit"
    >
      <div className="flex items-center gap-2 mb-4">
        <FireIcon className="w-6 h-6 text-orange-500" />
        <h2 className="text-base font-medium">Interested In</h2>
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <div
            className="
              h-8 w-8
              animate-spin
              rounded-full
              border-4
              border-neutral-700
              border-t-orange-500
            "
          />
        </div>
      )}

      {error && (
        <p className="text-sm text-red-400 text-center">{error.message}</p>
      )}

      {!loading && !error && data.length === 0 && (
        <div
          className="
            flex
            flex-col
            items-center
            justify-center
            py-10
            px-4
            text-center
            rounded-xl
            border
            border-dashed
            border-neutral-700
            bg-neutral-800/30
          "
        >
          <FireIcon className="w-10 h-10 text-neutral-600 mb-3" />

          <p className="text-sm font-medium text-neutral-300">
            No interested movies yet
          </p>

          <p className="text-xs text-neutral-500 mt-1">
            Movies added by this user will appear here.
          </p>
        </div>
      )}

      {!loading && !error && data.length > 0 && (
        <ul className="divide-y divide-neutral-800">
          {data.map((movie, index) => (
            <li
              key={movie.id}
              onClick={() => navigate(`/movie/${movie.slugUrl}`)}
              className="
                movie-card
                flex
                items-center
                gap-2
                py-3
                px-2
                rounded-lg
                cursor-pointer
                transition-all
                duration-200
                hover:scale-[1.05]
                hover:bg-neutral-800/40
              "
            >
              <span
                className="
                  text-2xl
                  font-bold
                  text-neutral-600
                  w-8
                  text-center
                  shrink-0
                  transition-colors
                  duration-200
                  movie-card:hover:text-orange-500
                "
              >
                {index + 1}
              </span>

              <img
                src={movie.posterSmallUrl}
                alt={movie.name}
                className="
                  w-12
                  h-16
                  object-cover
                  rounded
                  shrink-0
                "
              />

              <div className="min-w-0 flex-1 overflow-hidden">
                <div className="overflow-hidden">
                  <p
                    className="
                      movie-title
                      text-base
                      font-medium
                      whitespace-nowrap
                      inline-block
                      text-white
                    "
                  >
                    {movie.name}
                  </p>
                </div>

                <p className="text-sm text-neutral-400">{movie.year}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
