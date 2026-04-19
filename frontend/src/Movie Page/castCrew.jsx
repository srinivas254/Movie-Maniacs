import { UserCircleIcon } from "@heroicons/react/24/solid";

export function CastCrew({ castCrew = [] }) {
  if (!castCrew.length) return null;

  const cast = castCrew.filter(person => person.type === "CAST");
  const crew = castCrew.filter(person => person.type === "CREW");

  return (
    <div className="mt-10">

      {cast.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-5 text-white">
            Cast
          </h2>

          <div
            className="flex gap-5 overflow-x-auto pb-3"
            style={{ scrollbarWidth: "none" }}
          >
            {cast.map((person, i) => (
              <div
                key={i}
                className="flex flex-col items-center shrink-0 w-24 group cursor-pointer"
              >
                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-2 ring-2 ring-white/10 group-hover:ring-white/40 transition-all">
                  <UserCircleIcon className="w-full h-full text-white/30" />
                </div>

                <p className="text-white text-xs font-semibold text-center leading-tight">
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

      {crew.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-5 text-white">
            Crew
          </h2>

          <div
            className="flex gap-5 overflow-x-auto pb-3"
            style={{ scrollbarWidth: "none" }}
          >
            {crew.map((person, i) => (
              <div
                key={i}
                className="flex flex-col items-center shrink-0 w-24 group cursor-pointer"
              >
                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-2 ring-2 ring-white/10 group-hover:ring-white/40 transition-all">
                  <UserCircleIcon className="w-full h-full text-white/30" />
                </div>

                <p className="text-white text-xs font-semibold text-center leading-tight">
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