import { Logo } from "../siteLogo.jsx";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Outlet, useNavigate } from "react-router-dom";
import { useMovieStore } from "../Zustand Store/useMovieStore.js";
import { ConfirmModal } from "../User Page/User settings/confirmationModal.jsx";

export function AdminPanel() {
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  const { movies, setMovies, deleteMovie, setMovie } = useMovieStore();

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/movies/all");
      const data = await res.json();
      setMovies(data.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8080/movies/${id}`, { method: "DELETE" });
      deleteMovie(id);
      setDeleteId(null); 
      toast.success("Movie deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Movie deletion failed");
    }
  };

  const filteredMovies = movies.filter((m) =>
    m.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-neutral-800 text-white px-6 py-6">
      
      {deleteId && (
        <ConfirmModal
          onCancel={() => setDeleteId(null)}
          onConfirm={() => handleDelete(deleteId)}
          message="This movie data will be permanently deleted."
        />
      )}
      
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
          onClick={() => {
            fetchMovies();
            setShowAll(true);
          }}
          className="bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded-lg font-medium"
        >
          Get All Movies
        </button>

        <input
          type="text"
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg text-black w-64"
        />
      </div>

      {!showAll && search.trim() === "" ? null : (
        <div className="bg-neutral-900 rounded-xl p-3 border border-neutral-700">
          {loading ? (
            <p className="text-gray-400 text-center">Loading movies...</p>
          ) : filteredMovies.length === 0 ? (
            <p className="text-gray-400 text-center">
              No matching movies found...
            </p>
          ) : (
            filteredMovies.map((movie) => (
              <div
                key={movie.id}
                className="flex items-center justify-between bg-neutral-800 p-4 rounded-lg mb-3"
              >
                <div className="flex items-center gap-4 cursor-pointer">
                  <img
                    src={
                      movie.posterSmallUrl ||
                      "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
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
                  <button
                    onClick={() => navigate(`/movie/${movie.slugUrl}`)}
                    className="bg-blue-900 hover:bg-blue-800 px-3 py-1 rounded"
                  >
                    View
                  </button>

                  <button
                    onClick={() =>{ 
                      setMovie(movie);
                      navigate(`/admin/update-movie/${movie.id}`)}}
                    className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded"
                  >
                    Update
                  </button>

                  <button
                    onClick={() => setDeleteId(movie.id)} 
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <Outlet />
    </div>
  );
}