import {
  GlobeAltIcon,
  LockClosedIcon,
} from "@heroicons/react/24/solid";

import useUserStore from "../Zustand Store/useUserStore.js";

const banners = [
  "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200",
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200",
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200",
  "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1200",
  "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1200",
];

export function CollectionCard({ collection }) {

   const profile = useUserStore((state) => state.profile);

  const banner =
    banners[collection.id % banners.length];

  const initials = profile?.name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="
        rounded-2xl overflow-hidden
        bg-zinc-900 border border-white/10
        hover:border-white/20
        transition-all duration-300
        cursor-pointer group
      "
    >
      <div className="h-28 overflow-hidden">
        <img
          src={banner}
          alt="banner"
          className="
            w-full h-full object-cover
            group-hover:scale-105
            transition duration-500
          "
        />
      </div>

      <div className="p-4">

        <h2
          className="
            text-white font-semibold
            text-base line-clamp-1
          "
        >
          {collection.name}
        </h2>

        <div
          className="
            mt-3 flex items-center
            gap-2 text-sm text-gray-400
          "
        >

          {profile?.pictureUrl ? (
            <img
              src={profile.pictureUrl}
              alt="profile"
              referrerPolicy="no-referrer"
              className="
                w-5 h-5 rounded-full
                object-cover
              "
            />
          ) : (
            <div
              className="
                w-5 h-5 rounded-full
                bg-zinc-700 flex
                items-center justify-center
                text-[10px] font-semibold
                text-gray-200
              "
            >
              {initials}
            </div>
          )}

          <span>•</span>

          {collection.visibility === "PUBLIC" ? (
            <GlobeAltIcon className="w-4 h-4" />
          ) : (
            <LockClosedIcon className="w-4 h-4" />
          )}

          <span>•</span>

          <span>
            {collection.itemsCount}{" "}
            {collection.itemsCount === 1
              ? "item"
              : "items"}
          </span>

        </div>
      </div>
    </div>
  );
}