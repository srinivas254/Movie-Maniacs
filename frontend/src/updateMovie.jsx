import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useMovieStore } from "./useMovieStore";
import toast from "react-hot-toast";

export function UpdateMoviePage() {

  const { id } = useParams();

  const { movie, setMovieField } = useMovieStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovieField(name, value);
  };

  useEffect(() => {
    async function fetchMovie() {
      try {
        const res = await fetch(`http://localhost:8080/movies/${id}`);

        if (!res.ok) throw new Error("Failed to fetch movie");

        const data = await res.json();

        // fill zustand store field by field
        Object.entries(data).forEach(([key, value]) => {
          setMovieField(key, value);
        });

      } catch (err) {
        console.error(err);
        toast.error("Failed to load movie");
      }
    }

    fetchMovie();
  }, [id, setMovieField]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:8080/movies/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(movie),
      });

      if (!res.ok) throw new Error("Failed to update movie");

      toast.success("Movie updated successfully 🎬");

    } catch (err) {
      console.error(err);
      toast.error("Error updating movie");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-neutral-900 to-purple-900 px-6 py-12">
      <div className="w-full max-w-4xl bg-black/40 backdrop-blur-lg border border-neutral-800 rounded-2xl shadow-xl p-10">

        <h1 className="text-3xl font-semibold text-white mb-10 text-center">
          Update Movie
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-7">

          <FormInput label="Movie Name" name="name" value={movie.name} onChange={handleChange} />
          <FormInput label="Year" name="year" value={movie.year} onChange={handleChange} />
          <FormInput label="Duration (minutes)" name="duration" value={movie.duration} onChange={handleChange} />
          <FormInput label="Director" name="directedBy" value={movie.directedBy} onChange={handleChange} />
          <FormInput label="Country" name="country" value={movie.country} onChange={handleChange} />
          <FormInput label="Language" name="language" value={movie.language} onChange={handleChange} />
          <FormInput label="Age Rating" name="ageRating" value={movie.ageRating} onChange={handleChange} />

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
            <label className="text-sm text-gray-300">Overview</label>

            <textarea
              name="overview"
              value={movie.overview}
              onChange={handleChange}
              className="bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white
              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500
              transition h-32 resize-none"
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
            className="col-span-2 mt-4 bg-gradient-to-r from-purple-600 to-purple-800
            hover:from-purple-500 hover:to-purple-700
            text-white font-semibold py-4 rounded-xl
            transition-all duration-200 shadow-lg"
          >
            Update Movie
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
        value={value || ""}
        onChange={onChange}
        className="bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 text-white
        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500
        transition"
      />
    </div>
  );
}