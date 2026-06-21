import { useState } from "react";
import { FolderOpenIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

export function MyReviewsAndPublicCollections() {
  const [activeTab, setActiveTab] = useState("reviews");

  return (
    <div className="flex-1 bg-neutral-900 rounded-2xl p-6">
      <div className="flex w-full gap-4 border-b border-neutral-800 pb-4">
        <button
          onClick={() => setActiveTab("reviews")}
          className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg transition ${
            activeTab === "reviews"
              ? "bg-neutral-700 text-white"
              : "bg-neutral-800 text-neutral-400"
          }`}
        >
          <PencilSquareIcon className="w-5 h-5" />
          Reviews
        </button>

        <button
          onClick={() => setActiveTab("collections")}
          className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg transition ${
            activeTab === "collections"
              ? "bg-neutral-700 text-white"
              : "bg-neutral-800 text-neutral-400"
          }`}
        >
          <FolderOpenIcon className="w-5 h-5 flex-shrink-0" />
          <span>Collections</span>
        </button>
      </div>

      <div className="mt-6">
        {activeTab === "reviews" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">My Reviews</h2>

            <div className="bg-neutral-800 rounded-xl p-4">
              Reviews will appear here.
            </div>
          </div>
        )}

        {activeTab === "collections" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Public Collections</h2>

            <div className="bg-neutral-800 rounded-xl p-4">
              Collections will appear here.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
