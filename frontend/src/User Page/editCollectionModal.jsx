import {
  LockClosedIcon,
  GlobeAltIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function EditCollectionModal({
  open,
  setOpen,
  collection,
  collectionName,
}) {
  const [visibility, setVisibility] = useState("private");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (open && collection) {
      setName(collection.name || "");
      setDescription(collection.description || "");
      setVisibility(
        collection.visibility?.toLowerCase() || "private",
      );
    }
  }, [open, collection]);

  if (!open) return null;

  const handleEditCollection = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/movies/collections/my-collections/${collectionName}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            description,
            visibility: visibility.toUpperCase(),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update collection",
        );
      }

      toast.success("Collection updated successfully");

      setOpen(false);
      navigate("/collections/my-collections");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/70 backdrop-blur-sm
      "
    >
      <div
        className="
          w-full max-w-md p-6 rounded-2xl
          bg-zinc-900/95 border border-white/10
          shadow-2xl text-white
          backdrop-blur-xl
        "
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold">
            Edit Collection
          </h2>

          <button onClick={() => setOpen(false)}>
            <XMarkIcon className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-300">
                Collection Name
              </label>

              <span className="text-xs text-gray-500">
                {name.length}/30
              </span>
            </div>

            <input
              type="text"
              value={name}
              maxLength={30}
              onChange={(e) => setName(e.target.value)}
              className="
                px-4 py-3 rounded-lg
                bg-black/40 border border-white/10
                outline-none text-sm
                focus:border-white/20
              "
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-300">
                Description
              </label>

              <span className="text-xs text-gray-500">
                {description.length}/150
              </span>
            </div>

            <textarea
              rows={4}
              value={description}
              maxLength={150}
              onChange={(e) => setDescription(e.target.value)}
              className="
                px-4 py-3 rounded-lg
                bg-black/40 border border-white/10
                outline-none text-sm resize-none
                focus:border-white/20
              "
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm text-gray-300">
              Visibility
            </label>

            <div
              className="
                flex overflow-hidden rounded-xl
                border border-white/10
                bg-black/30
              "
            >
              <button
                type="button"
                onClick={() => setVisibility("private")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm ${
                  visibility === "private"
                    ? "bg-white/10 text-white"
                    : "text-gray-400"
                }`}
              >
                <LockClosedIcon className="w-4 h-4" />
                Private
              </button>

              <button
                type="button"
                onClick={() => setVisibility("public")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm ${
                  visibility === "public"
                    ? "bg-white/10 text-white"
                    : "text-gray-400"
                }`}
              >
                <GlobeAltIcon className="w-4 h-4" />
                Public
              </button>
            </div>
          </div>

          <button
            onClick={handleEditCollection}
            className="
              mt-2 py-3 rounded-lg
              bg-purple-500 hover:bg-purple-600
              text-sm font-medium text-white
            "
          >
            Edit Changes
          </button>
        </div>
      </div>
    </div>
  );
}