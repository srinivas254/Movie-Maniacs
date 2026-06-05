import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { RectangleStackIcon } from "@heroicons/react/24/outline";
import { AddMovieToCollectionModal } from "./addMovieToCollectionModal";

import {
  GlobeAltIcon,
  LockClosedIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";

import useUserStore from "../Zustand Store/useUserStore";

export function CollectionDetails() {
  const { collectionName } = useParams();
  const location = useLocation();

  const banner = location.state?.banner;

  const profile = useUserStore((state) => state.profile);
  const [collection, setCollection] = useState(null);
  const [showAddContentModal, setShowAddContentModal] = useState(false);
  const [selectedMovies, setSelectedMovies] = useState([]);
  window.selectedMovies = selectedMovies;

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
            onClick={() => setShowAddContentModal(true)}
            className="
            w-22 h-10
          px-4 py-2 rounded-xl
          font-medium text-sm
          bg-zinc-100 text-black
          hover:bg-zinc-300
          transition
        "
          >
            + Add Content
          </button>

          <button
            className="
           w-12 h-12
           rounded-full
          p-3 rounded-2xl
           bg-zinc-100 text-black
          hover:bg-zinc-300
          transition
          flex items-center
          justify-center
        "
          >
            <PencilIcon className="w-5 h-5" />
          </button>
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
            {collection.movies.map((movie) => (
              <div
                key={movie.id}
                className="
          flex flex-col
          gap-2
          cursor-pointer
          hover:scale-105
          transition
        "
              >
                <img
                  src={movie.posterSmallUrl}
                  alt={movie.name}
                  className="
            w-full
            aspect-[2/3]
            object-cover
            rounded-xl
          "
                />

                <h4 className="text-white font-medium truncate">
                  {movie.name}
                </h4>

                <span className="text-gray-400 text-sm">{movie.year}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddMovieToCollectionModal
        open={showAddContentModal}
        onClose={() => setShowAddContentModal(false)}
        selectedMovies={selectedMovies}
        setSelectedMovies={setSelectedMovies}
      />
    </div>
  );
}
