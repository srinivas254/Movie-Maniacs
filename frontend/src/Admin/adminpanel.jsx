import { Logo } from "../siteLogo.jsx";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Outlet, useNavigate } from "react-router-dom";
import { useMovieStore } from "../Zustand Store/useMovieStore.js";
import { ConfirmModal } from "../User Page/User settings/confirmationModal.jsx";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

export function AdminPanel() {
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [movieDeleteId, setMovieDeleteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userPage, setUserPage] = useState(0);
  const [userTotalPages, setUserTotalPages] = useState(0);

  const navigate = useNavigate();

  const { movies, setMovies, deleteMovie, setMovie } = useMovieStore();

  const fetchMovies = async (page = 0) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/movies/all?page=${page}`);
      const data = await res.json();
      setMovies(data.content || []);
      setTotalPages(data.totalPages);
      setCurrentPage(data.number);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (movies.length === 0) {
      fetchMovies();
    }
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8080/movies/${id}`, { method: "DELETE" });
      deleteMovie(id);
      setMovieDeleteId(null);
      toast.success("Movie deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Movie deletion failed");
    }
  };

  const filteredMovies = movies.filter((m) =>
    m.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const token = localStorage.getItem("token");

  const fetchUsers = async (page = 0) => {
    setUsersLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/users/all?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      console.log("FULL RESPONSE:", data);
      setUsers(data.content || []);
      setUserTotalPages(data.totalPages);
      setUserPage(data.number);
    } catch (err) {
      console.error(err);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (users.length === 0) {
      fetchUsers();
    }
  }, []);

  const filteredUsers = users.filter((u) =>
    u.userName.toLowerCase().includes(userSearch.trim().toLowerCase()),
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logout successfull");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-neutral-800 text-white px-6 py-6">
      {movieDeleteId && (
        <ConfirmModal
          onCancel={() => setMovieDeleteId(null)}
          onConfirm={() => handleDelete(movieDeleteId)}
          message="This movie data will be permanently deleted."
        />
      )}

      <div className="flex justify-between items-center mb-8">
        <div className="flex-1">
          <Logo className="text-2xl cursor-default" />
        </div>

        <div className="flex-1 flex justify-center">
          <h1 className="text-red-500 font-bold text-2xl">Admin Panel</h1>
        </div>

        <div className="flex-1 flex justify-end">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500
            text-white px-5 py-2 rounded-2xl transition"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />

            <span>Logout</span>
          </button>
        </div>
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

      <div className="flex flex-wrap gap-4 items-center mb-8">
        <button
          onClick={() => {
            fetchUsers(0);
            setShowAllUsers(true);
          }}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-medium"
        >
          Get All Users
        </button>

        <input
          type="text"
          placeholder="Search users..."
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
          className="px-4 py-2 rounded-lg text-black w-64"
        />
      </div>

      {!showAll && search.trim() === "" ? null : (
        <div className="bg-neutral-900 rounded-xl p-3 border border-neutral-700">
          <div className="flex justify-end mb-3">
            <button
              onClick={() => {
                setShowAll(false);
                setSearch("");
              }}
              className="text-gray-400 hover:text-white text-sm px-3 py-1 rounded-lg bg-neutral-700 hover:bg-red-600"
            >
              ✕ Close
            </button>
          </div>

          {loading ? (
            <p className="text-gray-400 text-center">Loading movies...</p>
          ) : filteredMovies.length === 0 ? (
            <p className="text-gray-400 text-center">
              No matching movies found...
            </p>
          ) : (
            <>
              {filteredMovies.map((movie) => (
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
                      onClick={() =>
                        navigate(`/admin-view/movie/${movie.slugUrl}`)
                      }
                      className="bg-blue-900 hover:bg-blue-800 px-3 py-1 rounded"
                    >
                      View
                    </button>

                    <button
                      onClick={() => {
                        setMovie(movie);
                        navigate(`/admin/update-movie/${movie.id}`);
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded"
                    >
                      Update
                    </button>

                    <button
                      onClick={() => setMovieDeleteId(movie.id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              {showAll && search.trim() === "" && (
                <div className="flex justify-center items-center gap-4 mt-4">
                  <button
                    onClick={() => fetchMovies(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="bg-neutral-700 hover:bg-neutral-600 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2 rounded-lg"
                  >
                    Previous
                  </button>

                  <span className="text-gray-400">
                    {currentPage + 1} / {totalPages}
                  </span>

                  <button
                    onClick={() => fetchMovies(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                    className="bg-neutral-700 hover:bg-neutral-600 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2 rounded-lg"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {!showAllUsers && userSearch.trim() === "" ? null : (
        <div className="bg-neutral-900 rounded-xl p-3 border border-neutral-700 mt-6">
          <div className="flex justify-end mb-3">
            <button
              onClick={() => {
                setShowAllUsers(false);
                setUserSearch("");
              }}
              className="text-gray-400 hover:text-white text-sm px-3 py-1 rounded-lg bg-neutral-700 hover:bg-red-600"
            >
              ✕ Close
            </button>
          </div>

          {usersLoading ? (
            <p className="text-gray-400 text-center">Loading users...</p>
          ) : filteredUsers.length === 0 ? (
            <p className="text-gray-400 text-center">
              No matching users found...
            </p>
          ) : (
            <>
              {filteredUsers.map((user) => {
                const initials = user?.name
                  ?.split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between bg-neutral-800 p-4 rounded-lg mb-3"
                  >
                    <div className="flex items-center gap-4">
                      {user.pictureUrl ? (
                        <img
                          src={user.pictureUrl}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-full object-cover"
                          alt={user.userName}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center font-bold text-white">
                          {initials}
                        </div>
                      )}
                      <div>
                        <h2>{user.userName}</h2>
                        <p className="text-gray-400">{user.name}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate(`/user/${user.userName}`)}
                        className="bg-blue-900 hover:bg-blue-800 px-3 py-1 rounded"
                      >
                        View
                      </button>

                      <button
                        onClick={() => console.log("user deletion button")}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}

              {showAllUsers && userSearch.trim() === "" && (
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    onClick={() => fetchUsers(userPage - 1)}
                    disabled={userPage === 0}
                    className="bg-neutral-700 px-4 py-2 rounded"
                  >
                    Previous
                  </button>

                  <span>
                    {userPage + 1} / {userTotalPages}
                  </span>

                  <button
                    onClick={() => fetchUsers(userPage + 1)}
                    disabled={userPage === userTotalPages - 1}
                    className="bg-neutral-700 px-4 py-2 rounded"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <Outlet />
    </div>
  );
}
