import { Logo } from "./siteLogo.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const navItems = [
  { id: "hero", label: "Hero" },
  { id: "features", label: "Features" },
  { id: "why-us", label: "Why Us" },
  { id: "help", label: "Help" },
];


export function HomeNavbar() {
  const navigate = useNavigate();
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const sections = navItems
      .map(item => document.getElementById(item.id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-50% 0px -50% 0px", // middle of screen
      }
    );

    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-black border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LOGO */}
        <a href="#hero">
          <Logo className="text-lg cursor-pointer" />
        </a>

        {/* NAV LINKS */}
        <div className="hidden md:flex gap-40 text-gray-300">
          {navItems.map(item => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`relative cursor-pointer text-sm transition
                ${
                    active === item.id
                    ? "text-purple-400"
                    : "text-gray-300 hover:text-purple-400"
                }`}
            >
              {item.label}

              {/* PURPLE GLITTER LINE */}
              <span
                className={`absolute left-0 -bottom-2 h-[2px] w-full
                  bg-purple-400
                  shadow-[0_0_8px_rgba(168,85,247,0.9)]
                  transition-all duration-300
                  ${
                    active === item.id
                      ? "opacity-100 scale-x-50"
                      : "opacity-0 scale-x-0 hover:opacity-60 hover:scale-x-100"
                  }`}
              />
            </a>
          ))}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-12 mr-12">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 text-sm font-medium rounded-md
                       bg-purple-600 hover:bg-purple-700 text-white transition"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="px-4 py-2 text-sm font-medium rounded-md
                       bg-yellow-600 hover:bg-yellow-700 text-white transition"
          >
            Register
          </button>
        </div>
      </div>
    </nav>
  );
}
