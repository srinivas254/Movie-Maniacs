import { useState } from "react";
import useUserStore from "../Zustand Store/useUserStore.js";

export function UserOpinionInputCard({ movieId, onSuccess }) {
  const [selectedOpinion, setSelectedOpinion] = useState("TIME_PASS");
  const [loading, setLoading] = useState(false);

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

  const submitOpinion = async () => {
    try {
      setLoading(true);

      const res = await fetch(`http://localhost:8080/movies/${movieId}/opinion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          opinionType: selectedOpinion,
        }),
      });

      const data = await res.json();

      // 🔥 notify parent
      onSuccess(data.opinionType);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 max-w-2xl mx-auto">
      
      <div className="flex items-center gap-3 mb-5">
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

      <div className="bg-zinc-800 rounded-xl p-2 grid grid-cols-4 gap-2 mb-4">
        {opinions.map((item) => (
          <button
            key={item.value}
            onClick={() => setSelectedOpinion(item.value)}
            className={`w-full py-2 rounded-full text-sm font-medium transition ${
              selectedOpinion === item.value
                ? `${item.active} text-black`
                : "text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={submitOpinion}
          disabled={loading}
          className="bg-white text-black px-5 py-2 rounded-full text-sm font-semibold disabled:opacity-50 transition"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>

    </div>
  );
}