import {
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useUserStore from "./useUserStore.js";

export function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const profile = useUserStore((state) => state.profile);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logout successfull");
    setOpen(false);
    navigate("/");
  };

  return (
    <div ref={menuRef} className="relative mr-6">
      {/* Profile Icon */}
      <button
        onClick={() => setOpen(!open)}
        className="p-1 rounded-full hover:ring-2 hover:ring-gray-500 transition"
      >
        {profile?.pictureUrl ? (
          <img
            src={profile.pictureUrl}
            alt="profile"
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div
            className="w-8 h-8 rounded-full 
                 bg-zinc-700 flex items-center justify-center 
                 text-sm font-semibold text-gray-200"
          >
            {profile?.name
              ?.split(" ")
              .map((word) => word.charAt(0))
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute right-0 mt-2 w-44
            rounded-md bg-black border border-white/10
            shadow-lg z-30
          "
        >
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-purple-400 transition"
          >
            <UserCircleIcon className="w-4 h-4" />
            Profile
          </button>

          <button
            onClick={() => navigate("/settings/edit-profile")}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-purple-400 transition"
          >
            <Cog6ToothIcon className="w-4 h-4" />
            Settings
          </button>

          <div className="h-px bg-white/10 my-1" />

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-white/5 transition"
          >
            <ArrowRightStartOnRectangleIcon className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
