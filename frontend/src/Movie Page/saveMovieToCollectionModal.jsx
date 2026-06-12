import { GlobeAltIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import { CreateCollectionModal } from "../User Page/createCollectionModal";
import { fetchCollections } from "../Util/collectionsData";

export function SaveMovieToCollectionModal({
  movieId,
  savedCollections,
  onCollectionsChange,
  onClose,
}) {
  const [collections, setCollections] = useState([]);
  const modalRef = useRef(null);
  const [showCreateCollectionModal, setShowCreateCollectionModal] = useState(false);

  const loadCollections = async () => {
    const data = await fetchCollections();
    const collectionsWithSelection = data.map((collection) => ({
      ...collection,
      selected: savedCollections.some((saved) => saved.id === collection.id),
    }));

    setCollections(collectionsWithSelection);
  };

  useEffect(() => {
    loadCollections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const addMovieToCollection = async (collectionName, movieId) => {
    const response = await fetch(
      `http://localhost:8080/movies/collections/my-collections/${collectionName}/movies/${movieId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to add movie");
    }

    return response.json();
  };

  const removeMovieFromCollection = async (collectionName, movieId) => {
    const response = await fetch(
      `http://localhost:8080/movies/collections/my-collections/${collectionName}/movies/${movieId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to remove movie");
    }
  };

  const handleCollectionToggle = async (collection) => {
    try {

      if (collection.selected) {
        await removeMovieFromCollection(collection.name, movieId);

        setCollections((prev) => {
          const updated = prev.map((c) =>
            c.id === collection.id ? { ...c, selected: false } : c,
          );

          onCollectionsChange(updated.filter((c) => c.selected));
          return updated;
        });
      } else {
        await addMovieToCollection(collection.name, movieId);

        setCollections((prev) => {
          const updated = prev.map((c) =>
            c.id === collection.id ? { ...c, selected: true } : c,
          );

          onCollectionsChange(updated.filter((c) => c.selected));
          return updated;
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="w-[300px] bg-[#181818] rounded-2xl border border-zinc-800 overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <h2 className="text-lg font-semibold text-white">
            Save to Collection
          </h2>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        <div className="max-h-[450px] overflow-y-auto">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="
                flex items-center justify-between
                px-5 py-4
                hover:bg-zinc-800/50
                transition-colors
                cursor-pointer
              "
            >
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={collection.selected}
                  onChange={() => handleCollectionToggle(collection)}
                  className="
                    h-4 w-4
                    accent-white
                    cursor-pointer
                  "
                />

                <span className="text-white font-medium">
                  {collection.name}
                </span>
              </div>

              {collection.visibility === "PUBLIC" ? (
                <GlobeAltIcon className="w-4 h-4" />
              ) : (
                <LockClosedIcon className="w-4 h-4" />
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-zinc-800">
          <button
            onClick={() => {
              console.log("button clicked");
              setShowCreateCollectionModal(true);
            }}
            className="w-full flex items-center gap-3
      px-5 py-4 text-white hover:bg-zinc-800/50 transition-colors"
          >
            <span className="text-xl leading-none">+</span>
            <span>Create New Collection</span>
          </button>
        </div>

        {showCreateCollectionModal && (
          <CreateCollectionModal
            open={showCreateCollectionModal}
            setOpen={setShowCreateCollectionModal}
            onSuccess={loadCollections}
          />
        )}
      </div>
    </div>
  );
}
