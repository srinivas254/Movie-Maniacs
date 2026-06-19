import { useEffect } from "react";
import { HeartIcon } from "@heroicons/react/24/solid";
import { MovieCard } from "../Movie Page/movieCard";
import { useMovieStore } from "..//Zustand Store/useMovieStore.js";
import { MostInterested } from "./MostInterested";

function MovieSection({ title, movies }) {
  return (
    <div className="mb-12">
      <h2 className="text-white text-xl font-semibold mb-8">{title}</h2>

      <div className="flex gap-5 overflow-x-auto overflow-y-hidden">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export function ExplorePage() {
  const token = localStorage.getItem("token");

  const { explore, setExploreMovies } = useMovieStore();

  const {
    editorsPicks,
    netflixMovies,
    primeMovies,
    jioMovies,
    appleMovies,
    loaded,
  } = explore;

  useEffect(() => {
    if (loaded) return;

    const loadMovies = async () => {
      try {
        const [editorsRes, netflixRes, primeRes, jioRes, appleRes] =
          await Promise.all([
            fetch("http://localhost:8080/movies/explore/editors-picks", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),

            fetch("http://localhost:8080/movies/explore/netflix-picks", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),

            fetch("http://localhost:8080/movies/explore/prime-picks", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),

            fetch("http://localhost:8080/movies/explore/jio-picks", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),

            fetch("http://localhost:8080/movies/explore/apple-picks", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
          ]);

        const [
          editorsPicks,
          netflixMovies,
          primeMovies,
          jioMovies,
          appleMovies,
        ] = await Promise.all([
          editorsRes.json(),
          netflixRes.json(),
          primeRes.json(),
          jioRes.json(),
          appleRes.json(),
        ]);

        setExploreMovies({
          editorsPicks,
          netflixMovies,
          primeMovies,
          jioMovies,
          appleMovies,
        });
      } catch (err) {
        console.error("Failed to load explore movies:", err);
      }
    };

    loadMovies();
  }, [loaded, token, setExploreMovies]);

  return (
    <div className="min-h-screen px-[5%] pt-20 pb-10">
      <div className="flex items-start">
        <div className="flex-1 min-w-0">
          <h1 className="text-white text-3xl font-bold mb-10">Explore</h1>

          <div className="mb-6 flex items-center gap-3">
            <HeartIcon className="w-7 h-7 text-white-500" />

            <h2 className="text-white text-xl font-semibold">
              Editor's All Time Picks
            </h2>
          </div>

          <div className="flex gap-5 overflow-x-auto overflow-y-hidden mb-12">
            {editorsPicks.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          <MovieSection title="Netflix Originals" movies={netflixMovies} />

          <MovieSection title="Prime Video Picks" movies={primeMovies} />

          <MovieSection title="JioHotstar Collection" movies={jioMovies} />

          <MovieSection title="Apple TV+ Originals" movies={appleMovies} />
        </div>

        <MostInterested />
      </div>
    </div>
  );
}
