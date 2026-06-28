import { UserCircleIcon } from "@heroicons/react/24/solid";
import { FaUserCircle } from "react-icons/fa";

export function CastCrew({ castCrew = [] }) {
  if (!castCrew.length) return null;

  const cast = castCrew.filter((person) => person.type === "CAST");
  const crew = castCrew.filter((person) => person.type === "CREW");

  return (
    <div className="mt-10">
      {cast.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-5 text-white">Cast</h2>

          <div
            className="flex gap-6 overflow-x-auto pb-6"
            style={{ scrollbarWidth: "none" }}
          >
            {cast.map((person, i) => (
              <div
                key={i}
                className="flex flex-col items-center shrink-0 w-28 group cursor-pointer"
              >
                <div className="w-20 h-20 rounded-full p-[2px] ring-2 ring-white/10 group-hover:ring-white/40 transition-all">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white/10">
                    <FaUserCircle className="w-full h-full text-white/30" />
                  </div>
                </div>

                <p className="mt-4 text-white text-xs font-semibold text-center leading-tight">
                  {person.name}
                </p>

                {person.characterName && (
                  <p className="text-white/40 text-xs text-center mt-0.5 leading-tight">
                    {person.characterName}
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      <div className="border-b border-white/10"></div>

      {crew.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-5 text-white">Crew</h2>

          <div
            className="flex gap-6 overflow-x-auto pb-3"
            style={{ scrollbarWidth: "none" }}
          >
            {crew.map((person, i) => (
              <div
                key={i}
                className="flex flex-col items-center shrink-0 w-28 group cursor-pointer"
              >
                <div className="w-20 h-20 rounded-full p-[2px] ring-2 ring-white/10 group-hover:ring-white/40 transition-all">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white/10">
                    <FaUserCircle className="w-full h-full text-white/30" />
                  </div>
                </div>

                <p className="mt-4 text-white text-xs font-semibold text-center leading-tight">
                  {person.name}
                </p>

                {person.role && (
                  <p className="text-white/40 text-xs text-center mt-0.5 leading-tight">
                    {person.role}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
