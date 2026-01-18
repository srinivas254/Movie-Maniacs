import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Logo } from "./siteLogo.jsx";
import { SearchBox } from "./searchBox.jsx";
import { ProfileMenu } from "./profileMenu.jsx";

import {
  SparklesIcon,
  Squares2X2Icon,
  BellIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";

const navItems = [
  {
    id: "explore",
    type: "route",
    path: "/explore",
    icon: SparklesIcon,
    underline: true,
  },
  {
    id: "grid",
    type: "modal",
    icon: Squares2X2Icon,
  },
  {
    id: "notifications",
    type: "modal",
    icon: BellIcon,
  },
  {
    id: "collections",
    type: "route",
    path: "/collections",
    icon: BookmarkIcon,
    underline: true,
  },
];

export function AuthNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeModal, setActiveModal] = useState(null);

  const isActive = (item) => {
    if (item.type === "route") {
      return location.pathname === item.path;
    }
    return activeModal === item.id;
  };

  const handleClick = (item) => {
    if (item.type === "route") {
      navigate(item.path);
      setActiveModal(null);
    } else {
      setActiveModal(item.id);
      // open modal here if needed
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-black border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LOGO */}
        <Link to="/explore">
          <Logo className="text-lg cursor-pointer" />
        </Link>

        {/* ICONS + SEARCH + PROFILE */}
        <div className="hidden md:flex items-center gap-10 text-gray-300">

          {/* ICON NAV */}
          <div className="flex items-center gap-10">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);

              return (
                <div
                  key={item.id}
                  onClick={() => handleClick(item)}
                  className={`relative flex flex-col items-center gap-1 cursor-pointer transition
                    ${
                      active
                        ? "text-purple-400"
                        : "text-gray-300 hover:text-purple-400"
                    }
                  `}
                >
                  <Icon className="h-6 w-6" />

                  {/* PURPLE GLITTER LINE → ONLY FOR ROUTES */}
                  {item.type === "route" && item.underline && (
                    <span
                      className={`absolute -bottom-3 h-[2px] w-6
                        bg-purple-400
                        shadow-[0_0_8px_rgba(168,85,247,0.9)]
                        transition-all duration-300
                        ${
                          active
                            ? "opacity-100 scale-x-50"
                            : "opacity-0 scale-x-0"
                        }
                      `}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* SEARCH + PROFILE */}
          <div className="flex items-center gap-4">
            <SearchBox />
            <ProfileMenu />
          </div>

        </div>
      </div>
    </nav>
  );
}
