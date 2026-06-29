import { useState, useEffect } from "react";
import { formatRelativeTime } from "../Util/formatRelativeTime.js";
import {
  HeartIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

export function CommunityReviewCard({ review }) {
  const [liked, setLiked] = useState(review.likedByCurrentUser);
  const [likesCount, setLikesCount] = useState(review.likesCount);

  useEffect(() => {
    setLiked(review.likedByCurrentUser);
    setLikesCount(review.likesCount);
  }, [review]);

  const initials = review.userName
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
    (item) => item.value === review.opinionType,
  );

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");

      const method = liked ? "DELETE" : "POST";

      const res = await fetch(
        `http://localhost:8080/movies/reviews/${review.opinionId}/like`,
        {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error("Failed to update like.");
      }

      setLiked(!liked);
      setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {review.pictureUrl ? (
            <img
              src={review.pictureUrl}
              alt={review.userName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-semibold text-gray-200">
              {initials}
            </div>
          )}

          <div>
            <p className="text-sm font-medium text-white">
              {review.userName}
            </p>

            <p className="text-[11px] text-gray-500">
              {review.updated
                ? `Edited ${formatRelativeTime(review.updatedAt)}`
                : `Posted ${formatRelativeTime(review.createdAt)}`}
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

      {review.comments && (
        <div className="mt-4 px-1">
          <p className="text-sm text-gray-300 whitespace-pre-wrap">
            {review.comments}
          </p>
        </div>
      )}

      <div className="flex items-center mt-4">
        <button
          onClick={handleLike}
          className="flex items-center gap-2 group"
        >
          {liked ? (
            <HeartSolidIcon className="w-5 h-5 text-white" />
          ) : (
            <HeartIcon className="w-5 h-5 text-black stroke-white group-hover:text-white transition" />
          )}

          <span
            className={`text-sm ${
              liked
                ? "text-white"
                : "text-gray-400 group-hover:text-white"
            } transition`}
          >
            {likesCount}
          </span>
        </button>
      </div>
    </div>
  );
}