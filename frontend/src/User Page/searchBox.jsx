import { useEffect, useRef, useState } from "react";
import {
  MagnifyingGlassIcon,
  FilmIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export function SearchBox() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("movies");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const modalRef = useRef(null);

  const closeModal = () => {
    setOpen(false);
    setQuery("");
    setResults([]);
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        closeModal();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      try {
        const BASE_URL = "http://localhost:8080";
        const endpoint =
          activeTab === "movies"
            ? `${BASE_URL}/movies/search?q=${query}`
            : `${BASE_URL}/users/search?q=${query}`;

        const res = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        setResults(data);
      } catch (err) {
        console.log(err);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [query, activeTab, token]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="
          p-2 rounded-lg
          text-white/45
          hover:text-white
          hover:bg-white/5
          transition-all duration-200
          cursor-pointer
        "
      >
        <MagnifyingGlassIcon className="w-5 h-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex justify-center pt-10">
          <div
            ref={modalRef}
            className="
              w-[650px]
              bg-[#0f0f0f]
              border border-white/10
              rounded-2xl
              shadow-2xl
              overflow-hidden
            "
          >
            {/* TOP BAR */}
            <div className="flex items-center px-4 py-4 border-b border-white/10">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 mr-3" />

              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${activeTab}...`}
                className="
                  flex-1 bg-transparent
                  text-white
                  placeholder-gray-500
                  outline-none
                  text-sm
                "
              />

              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="flex border-b border-white/10">
              <button
                onClick={() => setActiveTab("movies")}
                className={`
                  flex items-center gap-2 px-6 py-3 text-sm transition
                  ${
                    activeTab === "movies"
                      ? "text-purple-400 border-b-2 border-purple-400"
                      : "text-gray-400 hover:text-white"
                  }
                `}
              >
                <FilmIcon className="w-4 h-4" />
                Movies
              </button>

              <button
                onClick={() => setActiveTab("users")}
                className={`
                  flex items-center gap-2 px-6 py-3 text-sm transition
                  ${
                    activeTab === "users"
                      ? "text-purple-400 border-b-2 border-purple-400"
                      : "text-gray-400 hover:text-white"
                  }
                `}
              >
                <UserIcon className="w-4 h-4" />
                Users
              </button>
            </div>

            <div className="max-h-[450px] overflow-y-auto">
              {results.length === 0 ? (
                <div className="py-16 text-center text-gray-500 text-sm">
                  {query ? `No ${activeTab} found` : `Search for ${activeTab}`}
                </div>
              ) : (
                <div className="p-3 space-y-2">
                  {results.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        closeModal();

                        if (activeTab === "movies") {
                          navigate(`/movie/${item.slugUrl}`);
                        } else {
                          navigate(`/user/${item.userName}`);
                        }
                      }}
                      className="
                        flex items-center gap-4
                        p-3 rounded-xl
                        hover:bg-white/5
                        transition cursor-pointer
                      "
                    >
                      {activeTab === "movies" ? (
                        <img
                          src={item.posterSmallUrl}
                          alt=""
                          className="w-14 h-14 rounded-lg object-cover"
                        />
                      ) : item.pictureUrl ? (
                        <img
                          src={item.pictureUrl}
                          alt=""
                          className="w-14 h-14 rounded-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-14 h-14 rounded-full bg-zinc-700 flex items-center 
                          justify-center text-sm font-semibold text-gray-200"
                        >
                          {item.name
                            ?.split(" ")
                            .map((w) => w[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                      )}

                      <div>
                        <h3 className="text-white text-sm font-medium">
                          {item.name}
                        </h3>

                        <p className="text-gray-400 text-xs">
                          {activeTab === "movies" ? item.year : item.userName}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
