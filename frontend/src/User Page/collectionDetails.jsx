import { useEffect, useState, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { RectangleStackIcon } from "@heroicons/react/24/outline";
import { AddMovieToCollectionModal } from "./addMovieToCollectionModal";
import { MovieCard } from "../Movie Page/movieCard";
import { CreateCollectionModal } from "./createCollectionModal";
import { EditCollectionModal } from "./editCollectionModal";
import { EditableMovieCard } from "./editableMovieCard";
import { ConfirmModal } from "./User settings/confirmationModal";

import {
  GlobeAltIcon,
  LockClosedIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

import useUserStore from "../Zustand Store/useUserStore";

export function CollectionDetails() {
  const { collectionName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const banner = location.state?.banner;

  const profile = useUserStore((state) => state.profile);
  const [collection, setCollection] = useState(null);
  const [showAddContentModal, setShowAddContentModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const [showEditCollectionModal, setShowEditCollectionModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [editingList, setEditingList] = useState(false);
  const [editedMovies, setEditedMovies] = useState([]);

  const fetchCollection = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/movies/collections/my-collections/${collectionName}`,
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
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCollection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!collection) {
    return <div className="text-white">Loading...</div>;
  }

  const initials = profile?.name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex flex-col">
      <div
        className="
      flex gap-3
      h-[360px]
    "
      >
        <div
          className="
        w-[20%]
        rounded-2xl
        p-6
        flex flex-col
        justify-center
        gap-7
      "
        >
          <button
            onClick={async () => {
              if (editingList) {
                try {
                  const token = localStorage.getItem("token");
                  const movieIds = editedMovies.map((m) => m.id);

                  const response = await fetch(
                    `http://localhost:8080/movies/collections/my-collections/${collectionName}/movies`,
                    {
                      method: "PUT",
                      headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(movieIds),
                    },
                  );

                  if (!response.ok) {
                    throw new Error("Failed to save");
                  }

                  await fetchCollection();

                  setEditingList(false);
                  navigate(``, { state: { banner } });
                } catch (err) {
                  console.error(err);
                }
              } else {
                setShowAddContentModal(true);
              }
            }}
            className="
    w-22 h-10
    px-4 py-2 rounded-xl
    font-medium text-sm
    bg-zinc-100 text-black
    hover:bg-zinc-300
    transition
  "
          >
            {editingList ? "Done" : "+ Add Content"}
          </button>

          <div ref={menuRef} className="relative">
            <button
              onClick={() => setShowMenu((prev) => !prev)}
              className="
      w-12 h-12
      rounded-full
      p-3
      bg-zinc-100 text-black
      hover:bg-zinc-300
      transition
      flex items-center
      justify-center
    "
            >
              <PencilIcon className="w-5 h-5" />
            </button>

            {showMenu && (
              <div
                className="
        absolute
        left-12
        top-6
        z-50
        w-48
        bg-white
        border border-zinc-200
        rounded-xl
        shadow-xl
        overflow-hidden
      "
              >
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowEditCollectionModal(true);
                  }}
                  className="
          w-full
          px-4 py-3
          flex items-center gap-3
          text-black
          hover:bg-zinc-200
        "
                >
                  <PencilIcon className="w-5 h-5" />
                  Edit Collection
                </button>

                <button
                  onClick={() => {
                    setEditedMovies(collection.movies);
                    setEditingList(true);
                    setShowMenu(false);
                    navigate(`?edit=true`, { state: { banner } });
                  }}
                  className="
          w-full
          px-4 py-3
          flex items-center gap-3
          text-black
          hover:bg-zinc-200
        "
                >
                  <RectangleStackIcon className="w-5 h-5" />
                  Edit List
                </button>

                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowConfirmModal(true);
                  }}
                  className="
          w-full
          px-4 py-3
          flex items-center gap-3
          text-red-500
          hover:bg-zinc-200
        "
                >
                  <TrashIcon className="w-5 h-5" />
                  Delete Collection
                </button>
              </div>
            )}
          </div>
        </div>

        <div
          className="
        flex-1
        rounded-3xl
        overflow-hidden
        relative
      "
        >
          <img
            src={banner}
            alt="banner"
            className="
          absolute inset-0
          w-full h-full
          object-cover
        "
          />
        </div>
      </div>

      <div
        className="
      rounded-3xl
      p-8
      flex flex-col gap-3
    "
      >
        <div className="flex items-center gap-4">
          <h1
            className="
      text-2xl font-bold text-white
    "
          >
            {collection.name}
          </h1>

          <div
            className="
      px-3 py-1.5
      rounded-full
      bg-white/10
      border border-white/10
      backdrop-blur-sm
      flex items-center gap-2
    "
          >
            {collection.visibility === "PUBLIC" ? (
              <>
                <span className="text-sm text-gray-200">Public</span>
                <GlobeAltIcon className="w-4 h-4 text-gray-300" />
              </>
            ) : (
              <>
                <span className="text-sm text-gray-200">Private</span>
                <LockClosedIcon className="w-4 h-4 text-gray-300" />
              </>
            )}
          </div>
        </div>

        <h3 className="text-gray-400 mt-1 font-semibold">
          {collection.description}
        </h3>

        <div
          className="
        flex items-center gap-3
      "
        >
          {profile?.pictureUrl ? (
            <img
              src={profile.pictureUrl}
              referrerPolicy="no-referrer"
              alt="profile"
              className="
            w-10 h-10 rounded-full
            object-cover
          "
            />
          ) : (
            <div
              className="
            w-10 h-10 rounded-full
            bg-zinc-700
            flex items-center justify-center
            text-sm font-semibold
            text-gray-200
          "
            >
              {initials}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <span className="text-gray-400 text-sm">
            {collection.itemsCount}{" "}
            {collection.itemsCount === 1 ? "item" : "items"}
          </span>
        </div>

        {collection.itemsCount === 0 ? (
          <div
            className="
      mt-12
      flex flex-col
      items-center
      justify-center
      gap-4
      py-16
    "
          >
            <RectangleStackIcon className="w-16 h-16 text-zinc-600" />

            <h3 className="text-xl font-semibold text-white">
              No movies found
            </h3>

            <p className="text-gray-400 text-center">
              This collection is empty.
            </p>
          </div>
        ) : (
          <div
            className="
      mt-8
      grid
      grid-cols-2
      md:grid-cols-3
      lg:grid-cols-5
      gap-6
    "
          >
            {editingList
              ? editedMovies.map((movie) => (
                  <EditableMovieCard
                    key={movie.id}
                    movie={movie}
                    onRemove={() =>
                      setEditedMovies((prev) =>
                        prev.filter((m) => m.id !== movie.id),
                      )
                    }
                  />
                ))
              : collection.movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
          </div>
        )}
      </div>

      <AddMovieToCollectionModal
        open={showAddContentModal}
        onClose={() => setShowAddContentModal(false)}
        collectionMovies={collection.movies}
        collectionName={collectionName}
        fetchCollection={fetchCollection}
      />

      <EditCollectionModal
        open={showEditCollectionModal}
        setOpen={setShowEditCollectionModal}
        collection={collection}
        collectionName={collectionName}
        fetchCollection={fetchCollection}
      />

      {showConfirmModal && (
        <ConfirmModal
          message="This will permanently delete this collection and all its contents."
          onCancel={() => setShowConfirmModal(false)}
          onConfirm={async () => {
            try {
              const token = localStorage.getItem("token");
              const response = await fetch(
                `http://localhost:8080/movies/collections/my-collections/${collectionName}`,
                {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                },
              );

              if (!response.ok) throw new Error("Failed to delete collection");

              navigate("/collections/my-collections");
            } catch (err) {
              console.error(err);
            } finally {
              setShowConfirmModal(false);
            }
          }}
        />
      )}
    </div>
  );
}
