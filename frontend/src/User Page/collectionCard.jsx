import { GlobeAltIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../Zustand Store/useUserStore.js";

export function CollectionCard({ collection }) {
  const navigate = useNavigate();
  const profile = useUserStore((state) => state.profile);

  const initials = profile?.name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
    onClick={() =>
        navigate(
          `/collections/my-collections/${collection.name}`,
          {
            state: {
              banner: collection.banner,
            },
          }
        )
      }
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
          src={collection.banner}
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
            {collection.itemsCount === 1 ? "item" : "items"}
          </span>
        </div>
      </div>
    </div>
  );
}
