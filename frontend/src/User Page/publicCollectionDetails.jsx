import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { BookmarkIcon, RectangleStackIcon } from "@heroicons/react/24/outline";
import { MovieCard } from "../Movie Page/movieCard";
import toast from "react-hot-toast";

export function PublicCollectionDetails() {
  const { userName, collectionName } = useParams();
  const location = useLocation();
  const [saved, setSaved] = useState(false);

  const banner = location.state?.banner;

  const [collection, setCollection] = useState(null);

  const fetchCollection = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/users/${userName}/collections/public/${collectionName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch collection");
      }

      const data = await response.json();
      setCollection(data);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSavedCollection = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/users/${userName}/collections/public/${collectionName}/save`,
        {
          method: saved ? "DELETE" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update saved collection.");
      }

      if (saved) {
        toast.success("Removed from saved collections.");
      } else {
        toast.success("Added to saved collections.");
      }

      setSaved((prev) => !prev);
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
  };

  const fetchSavedStatus = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/users/${userName}/collections/public/${collectionName}/saved`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to fetch saved status.");
      }

      const data = await response.json();
      setSaved(data.saved);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCollection();
    fetchSavedStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!collection) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="flex flex-col">
      <div className="flex gap-3 h-[360px]">
        <div className="flex-1 rounded-3xl overflow-hidden relative">
          <img
            src={banner}
            alt="banner"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="rounded-3xl p-8 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">{collection.name}</h1>

          <button
            onClick={toggleSavedCollection}
            className="
    w-14 h-14
    rounded-full
    bg-white/10
    hover:bg-white/20
    transition
    flex
    items-center
    justify-center
  "
          >
            {saved ? (
              <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
                <path d="M6 3a2 2 0 0 0-2 2v16l8-4 8 4V5a2 2 0 0 0-2-2H6z" />
              </svg>
            ) : (
              <svg
                className="w-7 h-7"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 3h12a2 2 0 0 1 2 2v16l-8-4-8 4V5a2 2 0 0 1 2-2z" />
              </svg>
            )}
          </button>
        </div>

        <h3 className="text-gray-400 mt-1 font-semibold">
          {collection.description}
        </h3>

        <div className="flex flex-col">
          <span className="text-gray-400 text-sm">
            {collection.itemsCount}{" "}
            {collection.itemsCount === 1 ? "item" : "items"}
          </span>
        </div>

        {collection.itemsCount === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center py-16">
            <RectangleStackIcon className="w-16 h-16 text-zinc-600" />
            <h3 className="text-xl font-semibold text-white">
              No movies found
            </h3>
            <p className="text-gray-400 text-center">
              This collection is empty.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {collection.movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
