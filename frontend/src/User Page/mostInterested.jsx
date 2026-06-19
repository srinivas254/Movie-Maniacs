import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FireIcon } from "@heroicons/react/24/outline";
import "../index.css";

function formatInterested(count) {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return `${count}`;
}

export function MostInterested() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadMovies() {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:8080/movies/explore/top-interested",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to load movies");
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
  }, []);

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
      "
    >
      <div className="flex items-center gap-2 mb-4">
        <FireIcon className="w-6 h-6 text-orange-500" />
        <h2 className="text-base font-medium">Most Interested</h2>
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

      {error && <p className="text-sm text-red-400">{error.message}</p>}

      {!loading && !error && (
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

                <p
                  className="
                    text-sm
                    text-neutral-400
                    transition-all
                    duration-200
                    drop-shadow-[0_0_4px_rgba(255,255,255,0.35)]
                  "
                >
                  {movie.year}
                </p>

                <p
                  className="
                    flex
                    items-center
                    gap-1
                    text-sm
                    text-orange-500
                    font-medium
                    mt-1
                    whitespace-nowrap
                  "
                >
                  <FireIcon className="w-4 h-4" />
                  <span>
                    {formatInterested(movie.interestedCount)} Interested
                  </span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
