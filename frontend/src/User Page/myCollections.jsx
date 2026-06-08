import { useEffect, useState } from "react";
import { CreateCollectionModal } from "./CreateCollectionModal";
import { CollectionCard } from "./CollectionCard";
import { Outlet } from "react-router-dom";
import { fetchCollections } from "../Util/collectionsData";

const banners = [
  "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200",
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200",
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200",
  "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1200",
  "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1200",
];

export function MyCollections() {
  const [open, setOpen] = useState(false);
  const [collections, setCollections] = useState([]);

  const loadCollections = async () => {
    try {
      const data = await fetchCollections();
      const updatedCollections = data.map((collection) => ({
        ...collection,
        banner: banners[collection.id % banners.length],
      }));
      setCollections(updatedCollections);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadCollections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  <CreateCollectionModal
    open={open}
    setOpen={setOpen}
    onSuccess={loadCollections}
  />;

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

      {open && (
        <CreateCollectionModal
          open={open}
          setOpen={setOpen}
          onSuccess={loadCollections}
        />
      )}

      <Outlet />
    </div>
  );
}
