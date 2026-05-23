import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  FolderIcon,
  BookmarkSquareIcon,
} from "@heroicons/react/24/outline";

export function CollectionsPage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("my-collections");

  const handleNavigate = (tab) => {
    setActiveTab(tab);
    navigate(`/collections/${tab}`);
  };

  return (
    <div
      className="min-h-[calc(100vh-64px)] w-full text-white
                 flex items-start gap-4 px-4 pt-24"
    >
      <div
        className="w-72 p-6 rounded-xl
                   bg-black/60 backdrop-blur-md
                   border border-white/10 shadow-2xl"
      >
        <h2
          className="text-2xl font-bold text-center mb-7
                     bg-gradient-to-r from-white to-gray-400
                     bg-clip-text text-transparent tracking-wide"
        >
          Collections
        </h2>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleNavigate("my-collections")}
            className={`flex items-center gap-3
                        w-full px-4 py-3 rounded-lg
                        text-sm transition
                        ${
                          activeTab === "my-collections"
                            ? "bg-white/10 text-white border border-white/10"
                            : "text-gray-300 hover:bg-white/5 hover:text-white"
                        }`}
          >
            <FolderIcon className="w-5 h-5" />
            My Collections
          </button>

          <button
            onClick={() => handleNavigate("saved")}
            className={`flex items-center gap-3
                        w-full px-4 py-3 rounded-lg
                        text-sm transition
                        ${
                          activeTab === "saved"
                            ? "bg-white/10 text-white border border-white/10"
                            : "text-gray-300 hover:bg-white/5 hover:text-white"
                        }`}
          >
            <BookmarkSquareIcon className="w-5 h-5" />
            Saved
          </button>
        </div>
      </div>

      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}