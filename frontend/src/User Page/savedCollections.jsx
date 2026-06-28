import { useEffect, useState } from "react";
import { PublicCollectionCard } from "./PublicCollectionCard";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import { Outlet } from "react-router-dom";

const banners = [
  "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200",
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200",
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200",
  "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1200",
  "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1200",
];

export function SavedCollections() {
  const [collections, setCollections] = useState([]);

  const loadSavedCollections = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8080/users/collections/saved",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to fetch saved collections.");
      }

      const data = await response.json();

      const updatedCollections = data.map((collection) => ({
        ...collection,
        banner: banners[collection.id % banners.length],
      }));

      setCollections(updatedCollections);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadSavedCollections();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-semibold text-white text-center">
        Saved Collections
      </h2>

      {collections.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center py-16">
          <div className="rounded-full bg-zinc-800/70 p-5">
            <BookmarkIcon className="w-12 h-12 text-zinc-500" />
          </div>

          <h3 className="mt-6 text-xl font-semibold text-white">
            No saved collections
          </h3>

          <p className="mt-2 max-w-sm text-center text-gray-400">
            Save public collections to quickly access them later. They'll appear
            here.
          </p>
        </div>
      ) : (
        <div
          className="
      grid grid-cols-1
      md:grid-cols-2
      xl:grid-cols-3
      gap-5
    "
        >
          {collections.map((collection) => (
            <PublicCollectionCard
              key={collection.id}
              collection={collection}
              userName={collection.userName}
            />
          ))}
        </div>
      )}

      <Outlet />
    </div>
  );
}
