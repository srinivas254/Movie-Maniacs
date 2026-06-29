import { useNavigate } from "react-router-dom";

const runtimes = [
  { label: "Under 120 min", path: "under-120" },
  { label: "120–140 min", path: "120-140" },
  { label: "140–160 min", path: "140-160" },
  { label: "160+ min", path: "160-plus" },
];

export function RuntimePage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-6 pt-20 pb-10">
      <div className="mb-12">
        <h1 className="mt-3 text-4xl font-bold text-white">
          Browse by Runtime
        </h1>

        <div className="mt-3 h-[2px] w-16 rounded-full bg-red-500"></div>

        <p className="mt-5 text-neutral-400 max-w-xl leading-relaxed">
          Find movies that match the time you have available.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-5 justify-items-center">
        {runtimes.map((runtime) => (
          <button
            key={runtime.path}
            onClick={() => navigate(`/explore/runtime/${runtime.path}`)}
            className="w-48 px-4 py-3 rounded-xl border border-neutral-700
                       bg-neutral-900 text-neutral-300 text-sm font-medium
                       hover:bg-white hover:text-black
                       transition-all duration-200"
          >
            {runtime.label}
          </button>
        ))}
      </div>
    </div>
  );
}