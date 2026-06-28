import { useNavigate } from "react-router-dom";

export function PublicCollectionCard({ collection, userName }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() =>
        navigate(`/user/${userName}/collections/public/${collection.name}`, {
          state: {
            banner: collection.banner,
          },
        })
      }
      className="
        rounded-2xl overflow-hidden
        bg-zinc-900 border border-white/10
        hover:border-white/20
        transition-all duration-300
        cursor-pointer group
      "
    >
      <div className="h-18 overflow-hidden">
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

      <div className="p-3">
        <h2
          className="
            text-white font-medium
            text-sm line-clamp-1
          "
        >
          {collection.name}
        </h2>

        <div
          className="
            mt-2 flex items-center
            gap-2 text-xs text-gray-400
          "
        >
          <span>
            {collection.itemsCount}{" "}
            {collection.itemsCount === 1 ? "item" : "items"}
          </span>
        </div>
      </div>
    </div>
  );
}
