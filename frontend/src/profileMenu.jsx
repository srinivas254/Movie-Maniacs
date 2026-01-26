import { UserCircleIcon,Cog6ToothIcon,ArrowRightStartOnRectangleIcon } 
from "@heroicons/react/24/outline";
import { useState,useEffect,useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


export function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
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
        className="p-2 rounded-full text-gray-300 hover:text-purple-500 hover:bg-white/5 
        transition cursor-pointer"
      >
        <UserCircleIcon className="w-7 h-7" />
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
          <button onClick={() => navigate("/profile")}
          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-purple-400 transition">
            <UserCircleIcon className="w-4 h-4" />
            Profile
          </button>

          <button onClick={() => navigate("/settings")}
          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-purple-400 transition">
            <Cog6ToothIcon className="w-4 h-4" />
            Settings
          </button>

          <div className="h-px bg-white/10 my-1" />

          <button onClick={handleLogout}
          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-white/5 transition">
            <ArrowRightStartOnRectangleIcon className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}