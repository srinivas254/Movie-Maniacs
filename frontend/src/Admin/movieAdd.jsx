import { useMovieStore } from "../Zustand Store/useMovieStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function AddMoviePage() {
  const navigate = useNavigate();
  const { movie, setMovieField, addMovie, clearMovie } = useMovieStore();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "year" || name === "duration") {
      setMovieField(name, Number(value));
    } else {
      setMovieField(name, value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanMovie = Object.fromEntries(
      Object.entries(movie).map(([key, value]) => [
        key,
        value === "" ? null : value,
      ]),
    );

    try {
      const res = await fetch("http://localhost:8080/movies/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanMovie),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw errorData;
      }

      const newMovie = await res.json();
      addMovie(newMovie);
      toast.success("Movie added successfully");

      clearMovie();

      navigate("/admin");
    } catch (err) {
      if (typeof err === "object" && !err.message) {
        Object.values(err).forEach((msg) => toast.error(msg));
      } else {
        toast.error("Error adding movie");
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-4">
      <h1 className="text-3xl text-center font-semibold text-white mb-8">
        Add Movie
      </h1>

      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-8 shadow-lg">
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          <FormInput
            label="Movie Name"
            name="name"
            value={movie.name}
            onChange={handleChange}
          />
          <FormInput
            label="Year"
            name="year"
            value={movie.year}
            onChange={handleChange}
          />
          <FormInput
            label="Duration (minutes)"
            name="duration"
            value={movie.duration}
            onChange={handleChange}
          />
          <FormInput
            label="Director"
            name="directedBy"
            value={movie.directedBy}
            onChange={handleChange}
          />
          <FormInput
            label="Country"
            name="country"
            value={movie.country}
            onChange={handleChange}
          />
          <FormInput
            label="Language"
            name="language"
            value={movie.language}
            onChange={handleChange}
          />
          <FormInput
            label="Age Rating"
            name="ageRating"
            value={movie.ageRating}
            onChange={handleChange}
          />

          <FormInput
            label="Poster Small URL"
            name="posterSmallUrl"
            value={movie.posterSmallUrl}
            onChange={handleChange}
            className="col-span-2"
          />

          <FormInput
            label="Poster Wide URL"
            name="posterWideUrl"
            value={movie.posterWideUrl}
            onChange={handleChange}
            className="col-span-2"
          />

          <div className="flex flex-col gap-2 col-span-2">
            <label className="text-sm text-gray-400">Overview</label>
            <textarea
              name="overview"
              value={movie.overview}
              onChange={handleChange}
              className="bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white
              focus:outline-none focus:ring-2 focus:ring-purple-500 transition h-32 resize-none"
            />
          </div>

          <FormInput
            label="Watch Link"
            name="watchLink"
            value={movie.watchLink}
            onChange={handleChange}
            className="col-span-2"
          />

          <button
            type="submit"
            className="col-span-2 mt-4 bg-purple-600 hover:bg-purple-700
            text-white font-semibold py-3 rounded-xl transition"
          >
            Add Movie
          </button>
        </form>
      </div>
    </div>
  );
}

function FormInput({ label, name, value, onChange, className = "" }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-sm text-gray-300">{label}</label>

      <input
        name={name}
        value={value}
        onChange={onChange}
        className="bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 text-white
        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500
        transition"
      />
    </div>
  );
}
