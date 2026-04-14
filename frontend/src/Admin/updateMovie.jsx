import { useParams } from "react-router-dom";
import { useMovieStore } from "../Zustand Store/useMovieStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function UpdateMoviePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { movie, originalMovie, setMovieField, updateMovie } = useMovieStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "year" || name === "duration") {
      setMovieField(name, Number(value));
    } else {
      setMovieField(name, value);
    }
  };

   const addGenre = () => {
    setMovieField("genres", [...movie.genres, { name: "", percentage: "" }]);
  };

  const updateGenre = (index, field, value) => {
    const updated = movie.genres.map((g, i) =>
      i === index
        ? { ...g, [field]: field === "percentage" ? Number(value) : value }
        : g
    );
    setMovieField("genres", updated);
  };

  const removeGenre = (index) => {
    setMovieField("genres", movie.genres.filter((_, i) => i !== index));
  };

  const addCastCrew = () => {
    setMovieField("castCrew", [
      ...movie.castCrew,
      { type: "", name: "", role: "", characterName: "" },
    ]);
  };

  const updateCastCrew = (index, field, value) => {
    const updated = movie.castCrew.map((c, i) =>
      i === index ? { ...c, [field]: value } : c
    );
    setMovieField("castCrew", updated);
  };

  const removeCastCrew = (index) => {
    setMovieField("castCrew", movie.castCrew.filter((_, i) => i !== index));
  };

  const addWatchLink = () => {
    setMovieField("watchLinks", [
      ...movie.watchLinks,
      { platform: "", url: "", accessType: "" },
    ]);
  };

  const updateWatchLink = (index, field, value) => {
    const updated = movie.watchLinks.map((w, i) =>
      i === index ? { ...w, [field]: value } : w
    );
    setMovieField("watchLinks", updated);
  };

  const removeWatchLink = (index) => {
    setMovieField("watchLinks", movie.watchLinks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanMovie = Object.fromEntries(
      Object.entries(movie)
        .filter(([key]) => key !== "id" && key !== "slugUrl")
         .filter(([key, value]) => {
          if (Array.isArray(value)) {
            return JSON.stringify(value) !== JSON.stringify(originalMovie[key]);
          }
          return value !== originalMovie[key];
        })
        .map(([key, value]) => [key, value === "" ? null : value]),
    );

     if (cleanMovie.castCrew) {
      cleanMovie.castCrew = cleanMovie.castCrew.map((person) =>
        Object.fromEntries(
          Object.entries(person).map(([k, v]) => [k, v === "" ? null : v]),
        ),
      );
    }

    try {
      const res = await fetch(`http://localhost:8080/movies/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanMovie),
      });

      if (!res.ok) throw new Error("Failed to update movie");

      const updatedMovie = await res.json();
      updateMovie(updatedMovie);
      toast.success("Movie updated successfully");
      navigate("/admin");
    } catch (err) {
      console.error(err);
      toast.error("Error updating movie");
    }
  };

   const totalGenrePercentage = movie.genres.reduce(
    (sum, g) => sum + (Number(g.percentage) || 0),
    0
  );


  return (
    <div className="max-w-5xl mx-auto mt-4">
      <h1 className="text-3xl text-center font-semibold text-white mb-8">
        Update Movie
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

          <ArraySection title="Genres" onAdd={addGenre} addLabel="Add Genre">
            {movie.genres.map((genre, i) => (
              <div key={i} className="grid grid-cols-[1fr_120px_auto] gap-3 items-end">
                <FormInput
                  label="Genre Name"
                  name="name"
                  value={genre.name}
                  onChange={(e) => updateGenre(i, "name", e.target.value)}
                />
                <FormInput
                  label="Percentage"
                  name="percentage"
                  value={genre.percentage}
                  onChange={(e) => updateGenre(i, "percentage", e.target.value)}
                />
                <RemoveButton onClick={() => removeGenre(i)} label="Remove Genre" />
              </div>
            ))}
            {movie.genres.length > 0 && (
              <p className={`text-xs mt-1 ${totalGenrePercentage > 100 ? "text-red-400" : "text-gray-500"}`}>
                Total: {totalGenrePercentage}%{totalGenrePercentage > 100 && " — exceeds 100%"}
              </p>
            )}
          </ArraySection>

          {/* Cast & Crew */}
          <ArraySection title="Cast & Crew" onAdd={addCastCrew} addLabel="Add Person">
            {movie.castCrew.map((person, i) => (
              <div key={i} className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-400">Type</label>
                  <select
                    value={person.type}
                    onChange={(e) => updateCastCrew(i, "type", e.target.value)}
                    className="bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 text-white
                    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                  >
                    <option value="">Select type</option>
                    <option value="CAST">CAST</option>
                    <option value="CREW">CREW</option>
                  </select>
                </div>

                <FormInput
                  label="Name"
                  name="name"
                  value={person.name}
                  onChange={(e) => updateCastCrew(i, "name", e.target.value)}
                />

                {person.type === "CREW" && (
                  <FormInput
                    label="Role"
                    name="role"
                    value={person.role}
                    onChange={(e) => updateCastCrew(i, "role", e.target.value)}
                    className="col-span-2"
                  />
                )}

                {person.type === "CAST" && (
                  <FormInput
                    label="Character Name"
                    name="characterName"
                    value={person.characterName}
                    onChange={(e) => updateCastCrew(i, "characterName", e.target.value)}
                    className="col-span-2"
                  />
                )}

                {!person.type && <div className="col-span-2" />}

                <div className="col-span-2 flex justify-end">
                  <RemoveButton onClick={() => removeCastCrew(i)} label="Remove Person" />
                </div>

                {i < movie.castCrew.length - 1 && (
                  <div className="col-span-2 border-t border-neutral-700" />
                )}
              </div>
            ))}
          </ArraySection>

          {/* Watch Links */}
          <ArraySection title="Watch Links" onAdd={addWatchLink} addLabel="Add Link">
            {movie.watchLinks.map((link, i) => (
              <div key={i} className="grid grid-cols-2 gap-3">
                <FormInput
                  label="Platform"
                  name="platform"
                  value={link.platform}
                  onChange={(e) => updateWatchLink(i, "platform", e.target.value)}
                />
                <FormInput
                  label="Access Type"
                  name="accessType"
                  value={link.accessType}
                  onChange={(e) => updateWatchLink(i, "accessType", e.target.value)}
                />
                <FormInput
                  label="URL"
                  name="url"
                  value={link.url}
                  onChange={(e) => updateWatchLink(i, "url", e.target.value)}
                  className="col-span-2"
                />
                <div className="col-span-2 flex justify-end">
                  <RemoveButton onClick={() => removeWatchLink(i)} label="Remove Link" />
                </div>
                {i < movie.watchLinks.length - 1 && (
                  <div className="col-span-2 border-t border-neutral-700" />
                )}
              </div>
            ))}
          </ArraySection>

          <button
            type="submit"
            className="col-span-2 mt-4 bg-purple-600 hover:bg-purple-700
            text-white font-semibold py-3 rounded-xl transition"
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
        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
      />
    </div>
  );
}

function ArraySection({ title, onAdd, addLabel, children }) {
  return (
    <div className="col-span-2 flex flex-col gap-4 border border-neutral-700 rounded-xl p-5">
      <h2 className="text-white font-semibold text-lg">{title}</h2>
      <div className="flex flex-col gap-4">{children}</div>
      <button
        type="button"
        onClick={onAdd}
        className="text-sm bg-neutral-800 hover:bg-neutral-700 text-white
          border border-neutral-600 px-4 py-1.5 rounded-lg transition"
      >
        + {addLabel}
      </button>
    </div>
  );
}

function RemoveButton({ onClick, label = "Remove" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-xs text-red-400 hover:text-red-300 border border-red-800
      hover:border-red-600 px-3 py-1.5 rounded-lg transition"
    >
      {label}
    </button>
  );
}
