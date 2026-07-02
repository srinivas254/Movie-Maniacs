import { useNavigate } from "react-router-dom";

const decades = [
  "1970s",
  "1980s",
  "1990s",
  "2000s",
  "2010s",
  "2020s",
];

export function DecadePage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-6 pt-20 pb-10">
      <div className="mb-12">
        <h1 className="mt-3 text-4xl font-bold text-white">
          Browse by Decade
        </h1>

        <div className="mt-3 h-[2px] w-16 rounded-full bg-red-500"></div>

        <p className="mt-5 text-neutral-400 max-w-xl leading-relaxed">
          Explore movies from your favorite decade.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-x-6 gap-y-4 justify-items-center">
        {decades.map((decade) => (
          <button
            key={decade}
            onClick={() =>
              navigate(`/explore/decade/${decade}`)
            }
            className="w-36 px-3 py-2 rounded-xl border border-neutral-700
                       bg-neutral-900 text-neutral-300 text-sm font-medium
                       hover:bg-white hover:text-black
                       transition-all duration-200"
          >
            {decade}
          </button>
        ))}
      </div>
    </div>
  );
}