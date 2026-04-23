import useUserStore from "../Zustand Store/useUserStore.js";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";

export function UserOpinionDisplayCard({ opinionType }) {
  const profile = useUserStore((state) => state.profile);

  if (!profile) {
    return <div className="text-white text-center py-6">Loading...</div>;
  }

  const initials = profile.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const opinions = [
    { label: "Skip", value: "SKIP", active: "bg-pink-500" },
    { label: "Timepass", value: "TIME_PASS", active: "bg-yellow-500" },
    { label: "Go for it", value: "GO_FOR_IT", active: "bg-emerald-500" },
    { label: "Perfection", value: "PERFECTION", active: "bg-purple-500" },
  ];

  const selectedItem = opinions.find(
    (item) => item.value === opinionType
  );

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 max-w-2xl mx-auto">
      
      <div className="flex items-center justify-between">
    
        <div className="flex items-center gap-3">
          {profile.pictureUrl ? (
            <img
              src={profile.pictureUrl}
              alt={`${profile.name} profile`}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-semibold text-gray-200">
              {initials}
            </div>
          )}

          <p className="text-xs font-medium text-gray-300">
            {profile.userName}
          </p>
        </div>

        {selectedItem && (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold text-black ${selectedItem.active}`}
          >
            {selectedItem.label}
          </span>
        )}
      </div>

      <div className="flex justify-end mt-2">
        <button className="p-2 rounded-full hover:bg-zinc-700 transition">
          <EllipsisHorizontalIcon className="w-5 h-5 text-gray-300" />
        </button>
      </div>

    </div>
  );
}