import { useNavigate } from "react-router-dom";

const languages = [
  "English",
  "Hindi",
  "Tamil",
  "Kannada",
  "Malayalam",
  "French",
  "German",
  "Spanish",
  "Portuguese",
  "Italian",
  "Korean",
];

export function LanguagePage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-6 pt-20 pb-10">
      <div className="mb-12">
        <h1 className="mt-3 text-4xl font-bold text-white">
          Browse by Language
        </h1>

        <div className="mt-3 h-[2px] w-16 rounded-full bg-red-500"></div>

        <p className="mt-5 text-neutral-400 max-w-xl leading-relaxed">
          Discover movies in your preferred language.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-x-6 gap-y-4 justify-items-center">
        {languages.map((language) => (
          <button
            key={language}
            onClick={() =>
              navigate(`/explore/language/${language.toLowerCase()}`)
            }
            className="w-36 px-3 py-2 rounded-xl border border-neutral-700
                       bg-neutral-900 text-neutral-300 text-sm font-medium
                       hover:bg-white hover:text-black
                       transition-all duration-200"
          >
            {language}
          </button>
        ))}
      </div>
    </div>
  );
}