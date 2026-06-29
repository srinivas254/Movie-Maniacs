import {
  FilmIcon,
  CalendarIcon,
  LanguageIcon,
  GlobeAltIcon,
  ClockIcon,
  TvIcon,
} from "@heroicons/react/24/outline";

const filterOptions = [
  { label: "Genre", path: "/explore/genre", icon: FilmIcon },
  { label: "Decade", path: "/explore/decade", icon: CalendarIcon },
  { label: "Language", path: "/explore/language", icon: LanguageIcon },
  { label: "Country", path: "/explore/country", icon: GlobeAltIcon },
  { label: "Runtime", path: "/explore/runtime", icon: ClockIcon },
  { label: "OTT", path: "/explore/ott", icon: TvIcon },
];

export function GridModal({ onNavigate }) {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-black/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-md p-4 z-50">
      <div className="mb-4 border-b border-white/10 pb-3">
        <h3 className="text-white text-sm font-semibold tracking-wide">
          Browse By
        </h3>
        <p className="text-xs text-white/50 mt-1">
          Find movies the way you like.
        </p>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {filterOptions.map((opt) => {
          const Icon = opt.icon;
          return (
            <button
              key={opt.path}
              onClick={() => onNavigate(opt.path)}
              className="flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-xl
        text-white/40 hover:text-white hover:bg-white/5
        transition-all duration-200 text-xs font-medium tracking-wide"
            >
              <Icon className="w-5 h-5" />
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
