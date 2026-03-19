import { Logo } from "./siteLogo.jsx";
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useMovieStore } from "./useMovieStore.js";

export function AdminPanel() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const { movies, setMovies } = useMovieStore();

  const fetchMovies = async () => {
    try {
      const res = await fetch("http://localhost:8080/movies/all");
      const data = await res.json();
      setMovies(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const filteredMovies = movies.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-neutral-800 text-white px-6 py-6">
      <div className="flex justify-between items-center mb-8">
        <Logo className="text-2xl cursor-default" />

        <h1 className="text-red-500 font-bold text-2xl">Admin Panel</h1>
      </div>

      <div className="flex flex-wrap gap-4 items-center mb-8">
        <button
          onClick={() => navigate("/admin/add-movie")}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium"
        >
          + Add Movie
        </button>

        <button
          onClick={fetchMovies}
          className="bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded-lg font-medium"
        >
          Get All Movies
        </button>

        <input
          type="text"
          placeholder="Search movie..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg text-black w-64"
        />
      </div>

      <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-700">
        {filteredMovies.length === 0 ? (
          <p className="text-gray-400">No movies found...</p>
        ) : (
          filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className="flex items-center justify-between bg-neutral-800 p-4 rounded-lg mb-3"
            >

              <div
                className="flex items-center gap-4 cursor-pointer"
                onClick={() => navigate(`/movie/${movie.id}`)}
              >
                <img
                  src={
                    movie.posterSmallUrl || "https://via.placeholder.com/80x100"
                  }
                  alt={movie.name}
                  className="w-16 h-20 object-cover rounded"
                />

                <div>
                  <h2 className="font-semibold">{movie.name}</h2>
                  <p className="text-sm text-gray-400">{movie.year}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded">
                  Update
                </button>

                <button className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Outlet />
    </div>
  );
}
