import { useNavigate } from "react-router-dom";

const platforms = [
  "Netflix",
  "Amazon Prime Video",
  "Apple TV",
  "Jio Hotstar",
  "Sony Liv",
  "Zee 5",
  "Aha",
  "YouTube",
];

export function OttPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-6 pt-20 pb-10">
      <div className="mb-12">
        <h1 className="mt-3 text-4xl font-bold text-white">
          Browse by OTT
        </h1>

        <div className="mt-3 h-[2px] w-16 rounded-full bg-red-500"></div>

        <p className="mt-5 text-neutral-400 max-w-xl leading-relaxed">
          Find movies available on your favorite streaming platforms.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-x-6 gap-y-4 justify-items-center">
        {platforms.map((platform) => (
          <button
            key={platform}
            onClick={() =>
              navigate(
                `/explore/ott/${encodeURIComponent(platform.toLowerCase())}`
              )
            }
            className="w-40 px-3 py-2 rounded-xl border border-neutral-700
                       bg-neutral-900 text-neutral-300 text-sm font-medium
                       hover:bg-white hover:text-black
                       transition-all duration-200"
          >
            {platform}
          </button>
        ))}
      </div>
    </div>
  );
}