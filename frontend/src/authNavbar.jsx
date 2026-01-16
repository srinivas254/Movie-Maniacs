import { SearchBox } from "./searchBox.jsx"
import { ProfileMenu } from "./profileMenu.jsx"
import { Logo } from "./siteLogo.jsx"
import { useNavigate,Link } from "react-router-dom";
import {
  SparklesIcon,
  Squares2X2Icon,
  BellIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";

export function AuthNavbar() {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full z-50 bg-black border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/explore">
           <Logo className="text-lg cursor-pointer"/>  
        </Link>

        {/* Links */}
        <div className="hidden md:flex gap-24 text-gray-300 
          [&>a]:cursor-pointer [&>a:hover]:text-purple-400 [&>a]:transition">

           <a onClick={() => navigate("/explore")}
           className="flex flex-col items-center gap-1 cursor-pointer
                          hover:text-purple-400 transition">
            <SparklesIcon className="h-6 w-6" />
            <span className="text-xs">Explore</span>
          </a>

          <div className="flex flex-col items-center gap-1 cursor-pointer
                          hover:text-purple-400 transition">
            <Squares2X2Icon className="h-6 w-6" />
            <span className="text-xs">Browse</span>
          </div>

          <div className="flex flex-col items-center gap-1 cursor-pointer
                          hover:text-purple-400 transition">
            <BellIcon className="h-6 w-6" />
            <span className="text-xs">Notifications</span>
          </div>

          <div onClick={() => navigate("/collections")}
          className="flex flex-col items-center gap-1 cursor-pointer
                          hover:text-purple-400 transition">
            <BookmarkIcon className="h-6 w-6" />
            <span className="text-xs">Collections</span>
          </div>
        </div>

        {/* Auth */}
        <SearchBox />

        <ProfileMenu />

      </div>
    </nav>
  );
}




