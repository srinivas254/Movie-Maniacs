import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MovieCard } from "../Movie Page/movieCard";

export function RuntimeMoviesPage() {
  const { runtimeRange } = useParams();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const getRuntimeLabel = (runtime) => {
    switch (runtime) {
      case "0-119":
        return "Under 120 min";
      case "120-140":
        return "120–140 min";
      case "140-160":
        return "140–160 min";
      case "160-300":
        return "160+ min";
      default:
        return runtime;
    }
  };

  useEffect(() => {
    async function fetchMovies() {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        const response = await fetch(
          `http://localhost:8080/movies/explore/runtime/${runtimeRange}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch movies.");
        }

        const data = await response.json();
        setMovies(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, [runtimeRange]);

  return (
    <div className="max-w-6xl mx-auto px-6 pt-20 pb-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white">
          {getRuntimeLabel(runtimeRange)} Movies
        </h1>

        <div className="mt-3 h-[2px] w-16 rounded-full bg-red-500"></div>

        <p className="mt-4 text-neutral-400">
          Explore movies with a runtime of {getRuntimeLabel(runtimeRange)}.
        </p>
      </div>

      {loading ? (
        <div className="text-neutral-400">Loading...</div>
      ) : movies.length === 0 ? (
        <div className="text-neutral-400">
          No movies found.
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-x-10 gap-y-8">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
            />
          ))}
        </div>
      )}
    </div>
  );
}