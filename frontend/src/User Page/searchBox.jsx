import { useState,useEffect,useRef } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export function SearchBox() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative ml-24">
    { !open && (
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-md text-gray-300 hover:text-purple-500 
        hover:bg-white/5 transition cursor-pointer relative">
        <MagnifyingGlassIcon className="w-5 h-5" />
      </button>
    ) }

      {open && (
        <input
          type="text"
          placeholder="Search movies..."
          autoFocus
          className="
            absolute right-0 w-56 
            rounded-md bg-black border border-white/10
            px-4 py-2 text-sm text-white
            placeholder-gray-400
            focus:outline-none focus:border-purple-500
            transition
          "
        />
      )}
    </div>
  );
}