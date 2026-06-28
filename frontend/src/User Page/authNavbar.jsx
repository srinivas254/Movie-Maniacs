import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Logo } from "../siteLogo.jsx";
import { SearchBox } from "./searchBox.jsx";
import { ProfileMenu } from "./profileMenu.jsx";
import { GridModal } from "./gridModal.jsx";
import { NotificationsModal } from "./notificationsModal.jsx";

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
    label: "Explore",
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
    path: "/collections/my-collections",
    icon: BookmarkIcon,
    underline: true,
    label: "Collections",
  },
];

export function AuthNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeModal, setActiveModal] = useState(null);
  const gridRef = useRef(null);
  const notificationsRef = useRef(null);

useEffect(() => {
  function handleClickOutside(e) {
    if (
      gridRef.current && !gridRef.current.contains(e.target) &&
      notificationsRef.current && !notificationsRef.current.contains(e.target)
    ) {
      setActiveModal(null);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

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
      setActiveModal(activeModal === item.id ? null : item.id);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-black border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/explore">
          <Logo className="text-lg cursor-pointer" />
        </Link>

        <div className="hidden md:flex items-center gap-10 text-gray-300">
          <div className="flex items-center gap-10">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);

              return (
                <div
                  key={item.id}
                  ref={
                    item.id === "grid"
                      ? gridRef
                      : item.id === "notifications"
                        ? notificationsRef
                        : null
                  }
                  onClick={() => handleClick(item)}
                  className={`relative flex flex-col items-center gap-1 cursor-pointer transition
                    ${
                      active
                        ? "text-white"
                        : "text-white/40 hover:text-white/70"
                    }
                  `}
                >
                  <Icon className="h-6 w-6" />

                  {item.label && active && (
                    <span className="text-xs font-medium tracking-wide whitespace-nowrap">
                      {item.label}
                    </span>
                  )}

                  {item.type === "route" && item.underline && (
                    <span
                      className={`absolute -bottom-3 h-[2px] w-6
                       bg-white
                       shadow-[0_0_8px_rgba(255,255,255,0.5)]
                       transition-all duration-300
                       ${active ? "opacity-100 scale-x-50" : "opacity-0 scale-x-0"}
                      `}
                    />
                  )}

                  {item.id === "grid" && active && (
                    <GridModal
                      onNavigate={(path) => {
                        navigate(path);
                        setActiveModal(null);
                      }}
                    />
                  )}

                  {item.id === "notifications" && active && (
                    <NotificationsModal />
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <SearchBox />
            <ProfileMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}
