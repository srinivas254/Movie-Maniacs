import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MovieCard } from "../Movie Page/movieCard";

export function LanguageMoviesPage() {
  const { languageName } = useParams();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMovies() {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        const response = await fetch(
          `http://localhost:8080/movies/explore/language/${languageName}`,
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
  }, [languageName]);

  const formattedLanguage =
  languageName.charAt(0).toUpperCase() + languageName.slice(1);

  return (
    <div className="max-w-6xl mx-auto px-6 pt-20 pb-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white">
          {formattedLanguage} Movies
        </h1>

        <div className="mt-3 h-[2px] w-16 rounded-full bg-red-500"></div>

        <p className="mt-4 text-neutral-400">
          Explore the best {languageName} movies.
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