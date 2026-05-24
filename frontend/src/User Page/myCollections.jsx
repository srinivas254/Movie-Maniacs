import { useEffect, useState } from "react";
import { CreateCollectionModal } from "./CreateCollectionModal";
import { CollectionCard } from "./CollectionCard";

export function MyCollections() {
  const [open, setOpen] = useState(false);
  const [collections, setCollections] = useState([]);

  const fetchCollections = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8080/movies/collections/my-collections",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch collections");
      }

      const data = await response.json();
      setCollections(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 items-center">
        <div></div>

        <h2 className="text-2xl font-semibold text-white text-center">
          My Collections
        </h2>

        <div className="flex justify-end">
          <button
            onClick={() => setOpen(true)}
            className="
        px-3 py-2 rounded-lg
        bg-purple-400 text-black
        text-sm font-medium
        hover:bg-purple-500
      "
          >
            + Create Collection
          </button>
        </div>
      </div>

      <div
        className="
          grid grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-5
        "
      >
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>

      <CreateCollectionModal open={open} setOpen={setOpen} fetchCollections={fetchCollections} />
    </div>
  );
}
