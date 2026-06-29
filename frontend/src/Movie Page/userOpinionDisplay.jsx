import { useUserStore } from "../Zustand Store/useUserStore.js";
import { useState, useRef, useEffect } from "react";
import { formatRelativeTime } from "../Util/formatRelativeTime.js";
import {
  EllipsisHorizontalIcon,
  PencilSquareIcon,
  TrashIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

export function UserOpinionDisplayCard({ opinion, onEdit, onDelete }) {
  const profile = useUserStore((state) => state.profile);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const [liked, setLiked] = useState(opinion.likedByCurrentUser);
  const [likesCount, setLikesCount] = useState(opinion.likesCount);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setLiked(opinion.likedByCurrentUser);
    setLikesCount(opinion.likesCount);
  }, [opinion]);

  if (!profile) {
    return <div className="text-white text-center py-6">Loading...</div>;
  }

  if (!opinion) {
    return null;
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
    (item) => item.value === opinion?.opinionType,
  );

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");

      if (liked) {
        const res = await fetch(
          `http://localhost:8080/movies/reviews/${opinion.opinionId}/like`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!res.ok) {
          throw new Error("Failed to unlike review");
        }

        setLiked(false);
        setLikesCount((prev) => prev - 1);
      } else {
        const res = await fetch(
          `http://localhost:8080/movies/reviews/${opinion.opinionId}/like`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!res.ok) {
          throw new Error("Failed to like review");
        }

        setLiked(true);
        setLikesCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-5 text-white">Your Review</h2>

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

            <div>
              <p className="text-xs font-medium text-gray-300">
                {profile.userName}
              </p>

              <p className="text-[11px] text-gray-500 mt-0.5">
                {opinion.updated
                  ? `Edited ${formatRelativeTime(opinion.updatedAt)}`
                  : `Posted ${formatRelativeTime(opinion.createdAt)}`}
              </p>
            </div>
          </div>

          {selectedItem && (
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold text-black ${selectedItem.active}`}
            >
              {selectedItem.label}
            </span>
          )}
        </div>

        {opinion?.comments && (
          <div className="mt-4 px-1">
            <p className="text-sm text-gray-300 whitespace-pre-wrap">
              {opinion.comments}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={handleLike}
          >
            {liked ? (
              <HeartSolidIcon className="w-5 h-5 text-white transition" />
            ) : (
              <HeartIcon className="w-5 h-5 text-black stroke-white group-hover:text-white transition" />
            )}

            <span
              className={`text-sm ${
                liked ? "text-white" : "text-gray-400 group-hover:text-white"
              } transition`}
            >
              {likesCount}
            </span>
          </div>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-full hover:bg-zinc-700 transition"
            >
              <EllipsisHorizontalIcon className="w-5 h-5 text-gray-300" />
            </button>

            {showMenu && (
              <div className="absolute top-full right-0 w-40 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-10">
                {/* Edit */}
                <button
                  onClick={() => {
                    onEdit();
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-200 hover:bg-zinc-700"
                >
                  <PencilSquareIcon className="w-4 h-4" />
                  Edit Review
                </button>

                <button
                  onClick={() => {
                    onDelete();
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-zinc-700"
                >
                  <TrashIcon className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
