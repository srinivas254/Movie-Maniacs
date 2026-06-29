import { useNavigate } from "react-router-dom";

const genres = [
  "Action",
  "Adventure",
  "Anthology",
  "Biography",
  "Comedy",
  "Coming-of-Age",
  "Crime",
  "Drama",
  "Educational",
  "Family",
  "Fantasy",
  "Folklore",
  "Friendship",
  "Historical",
  "Horror",
  "Mystery",
  "Political",
  "Psychological",
  "Romance",
  "Sci-Fi",
  "Spy",
  "Thriller",
  "War",
];

export function GenrePage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-6 pt-20 pb-10">
      <div className="mb-12">

        <h1 className="mt-3 text-4xl font-bold text-white">Browse by Genre</h1>

        <div className="mt-3 h-[2px] w-16 rounded-full bg-red-500"></div>

        <p className="mt-5 text-neutral-400 max-w-xl leading-relaxed">
          Choose a genre and discover movies curated just for your taste.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-x-6 gap-y-4 justify-items-center">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => navigate(`/explore/genre/${genre.toLowerCase()}`)}
            className="w-32 px-3 py-2 rounded-xl border border-neutral-700
                   bg-neutral-900 text-neutral-300 text-sm font-medium
                   hover:bg-white hover:text-black
                   transition-all duration-200"
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
}
