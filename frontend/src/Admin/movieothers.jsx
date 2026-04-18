import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

const GENRE_COLORS = [
  "#A855F7",
  "#3B82F6",
  "#EF4444",
  "#F97316",
  "#10B981",
  "#EC4899",
  "#F59E0B",
  "#06B6D4",
  "#8B5CF6",
  "#84CC16",
];

function VibeChart({ genres = [] }) {
  const canvasRef = useRef(null);
  const [hovered, setHovered] = useState(null);

  const slices = genres.slice(0, 10).map((g, i) => ({
    ...g,
    color: GENRE_COLORS[i % GENRE_COLORS.length],
  }));

  const topGenre = slices[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || slices.length === 0) return;
    const ctx = canvas.getContext("2d");
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const R = 80;
    const r = 52;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let startAngle = -Math.PI / 2;
    slices.forEach((s, i) => {
      const sweep = (s.percentage / 100) * 2 * Math.PI;
      ctx.beginPath();
      ctx.arc(cx, cy, R, startAngle, startAngle + sweep);
      ctx.arc(cx, cy, r, startAngle + sweep, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = hovered === i ? s.color : s.color + "cc";
      ctx.fill();
      startAngle += sweep;
    });
  }, [slices, hovered]);

  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-5">
      <h3 className="text-white font-bold text-lg mb-4">Vibe Chart</h3>
      <div className="flex justify-center mb-4">
        <div className="relative">
          <canvas ref={canvasRef} width={180} height={180} />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-white font-semibold text-sm">{topGenre?.name}</p>
            <p className="text-white font-bold text-xl">{topGenre?.percentage}%</p>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {slices.map((s, i) => (
          <div
            key={i}
            className="flex items-center justify-between cursor-default"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
              <span className="text-white/70 text-sm">{s.name}</span>
            </div>
            <span className="text-white/70 text-sm font-medium">{s.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WatchOnline({ links = [] }) {
  if (!links.length) return null;
  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-5">
      <h3 className="text-white font-bold text-lg mb-3">Watch Online</h3>
      <div className="space-y-2">
        {links.map((l, i) => (
          <a
            key={i}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between group hover:bg-white/5 rounded-xl px-2 py-1.5 -mx-2 transition-colors"
          >
            <div className="flex items-center gap-3">
              {l.logoUrl ? (
                <img src={l.logoUrl} alt={l.name} className="w-8 h-8 rounded-lg object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{l.name[0]}</span>
                </div>
              )}
              <div>
                <p className="text-white font-semibold text-sm">{l.name}</p>
                <p className="text-white/40 text-xs">{l.type}</p>
              </div>
            </div>
            <svg className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M7 7h10v10" />
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
}

function CastCrew({ cast = [], crew = [] }) {
  if (!cast.length && !crew.length) return null;
  return (
    <div className="mt-10">
      {cast.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-5 text-white">Cast</h2>
          <div className="flex gap-5 overflow-x-auto pb-3" style={{ scrollbarWidth: "none" }}>
            {cast.map((person, i) => (
              <div key={i} className="flex flex-col items-center shrink-0 w-24 group cursor-pointer">
                <div className="w-20 h-20 rounded-full overflow-hidden mb-2 ring-2 ring-white/10 group-hover:ring-purple-500 transition-all">
                  {person.photoUrl ? (
                    <img src={person.photoUrl} alt={person.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-white/10 flex items-center justify-center">
                      <span className="text-white/40 text-xl font-bold">{person.name?.[0] || "?"}</span>
                    </div>
                  )}
                </div>
                <p className="text-white text-xs font-semibold text-center leading-tight">{person.name}</p>
                {person.character && (
                  <p className="text-white/40 text-xs text-center mt-0.5 leading-tight">{person.character}</p>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {crew.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-5 text-white">Crew</h2>
          <div className="flex gap-5 flex-wrap">
            {crew.map((person, i) => (
              <div key={i} className="flex flex-col items-center w-24 group cursor-pointer">
                <div className="w-20 h-20 rounded-full overflow-hidden mb-2 ring-2 ring-white/10 group-hover:ring-purple-500 transition-all">
                  {person.photoUrl ? (
                    <img src={person.photoUrl} alt={person.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-white/10 flex items-center justify-center">
                      <span className="text-white/40 text-xl font-bold">{person.name?.[0] || "?"}</span>
                    </div>
                  )}
                </div>
                <p className="text-white text-xs font-semibold text-center leading-tight">{person.name}</p>
                {person.role && (
                  <p className="text-white/40 text-xs text-center mt-0.5 leading-tight">{person.role}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function OpinionMeter({ opinion }) {
  if (!opinion) return null;

  const segments = [
    { label: "Skip", color: "#EF4444", value: opinion.skip || 0 },
    { label: "Timepass", color: "#F59E0B", value: opinion.timepass || 0 },
    { label: "Go for it", color: "#10B981", value: opinion.goForIt || 0 },
    { label: "Perfection", color: "#A855F7", value: opinion.perfection || 0 },
  ];

  const total = segments.reduce((s, x) => s + x.value, 0) || 1;

  const R = 90;
  const cx = 130;
  const cy = 115;
  const strokeW = 16;

  const polarToXY = (deg) => ({
    x: cx + R * Math.cos((deg * Math.PI) / 180),
    y: cy + R * Math.sin((deg * Math.PI) / 180),
  });

  let currentDeg = 180;
  const arcs = segments.map((seg) => {
    const sweep = (seg.value / total) * 180;
    const start = polarToXY(currentDeg);
    const end = polarToXY(currentDeg + sweep);
    const large = sweep > 180 ? 1 : 0;
    const path = `M ${start.x} ${start.y} A ${R} ${R} 0 ${large} 1 ${end.x} ${end.y}`;
    currentDeg += sweep;
    return { ...seg, path };
  });

  const trackStart = polarToXY(180);
  const trackEnd = polarToXY(0);
  const trackPath = `M ${trackStart.x} ${trackStart.y} A ${R} ${R} 0 1 1 ${trackEnd.x} ${trackEnd.y}`;

  const dominantSeg = [...segments].sort((a, b) => b.value - a.value)[0];
  const dominantPct = Math.round((dominantSeg.value / total) * 100);
  const votes = opinion.totalVotes
    ? `${(opinion.perfection || 0).toLocaleString()}/${opinion.totalVotes.toLocaleString()} Votes`
    : null;

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-5 text-white">Opinion Meter</h2>
      <div className="bg-[#1a1a1a] rounded-2xl p-6">
        <div className="flex justify-center">
          <svg width="260" height="130" viewBox="0 0 260 130">
            <path d={trackPath} fill="none" stroke="#2a2a2a" strokeWidth={strokeW} strokeLinecap="round" />
            {arcs.map((arc, i) => (
              <path key={i} d={arc.path} fill="none" stroke={arc.color} strokeWidth={strokeW} strokeLinecap="butt" />
            ))}
            <text x={cx} y={cy - 6} textAnchor="middle" fill="#A855F7" fontSize="28" fontWeight="bold" fontFamily="sans-serif">
              {dominantPct}%
            </text>
            {votes && (
              <text x={cx} y={cy + 14} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="sans-serif">
                {votes}
              </text>
            )}
          </svg>
        </div>
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-1">
          {segments.map((s, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="text-white/60 text-sm">
                {s.label} <span className="text-white font-semibold">{Math.round((s.value / total) * 100)}%</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MovieDetailsPage() {
  const { slug } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    if (!slug) return;
    const getMovie = async () => {
      try {
        const res = await fetch(`http://localhost:8080/movies/${slug}`);
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        console.error(err);
      }
    };
    getMovie();
  }, [slug]);

  const formatDuration = (mins) => {
    if (!mins) return null;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m === 0 ? `${h}h` : `${h}h ${m}m`;
  };

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/10 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  const metaParts = ["Movie", movie.year, formatDuration(movie.duration)].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#111] text-white">

      <div className="relative w-full">

        <div className="relative w-full h-[420px]">
          {movie.posterWideUrl ? (
            <img
              src={movie.posterWideUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-center z-0"
            />
          ) : (
            <div className="absolute inset-0 bg-[#1a1a1a] z-0" />
          )}

          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/10 z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10" />
        </div>

        <div className="absolute inset-0 z-20 flex items-end">
          <div className="w-full max-w-6xl mx-auto px-8 pb-8 flex items-end gap-8">

            <div className="shrink-0 w-[190px] h-[280px] rounded-xl overflow-hidden shadow-2xl">
              {movie.posterSmallUrl ? (
                <img
                  src={movie.posterSmallUrl}
                  alt={movie.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-white/10 border border-white/10" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-white/60 text-sm mb-1">{metaParts.join(" • ")}</p>
              <h1 className="text-4xl font-bold mb-5">{movie.name}</h1>

              <div className="flex flex-wrap gap-x-10 gap-y-3">
                {movie.directedBy && (
                  <div>
                    <p className="text-white/40 text-xs mb-0.5">Directed By</p>
                    <p className="text-white font-semibold text-sm">{movie.directedBy}</p>
                  </div>
                )}
                {movie.country && (
                  <div>
                    <p className="text-white/40 text-xs mb-0.5">Country</p>
                    <p className="text-white font-semibold text-sm">{movie.country}</p>
                  </div>
                )}
                {movie.language && (
                  <div>
                    <p className="text-white/40 text-xs mb-0.5">Language</p>
                    <p className="text-white font-semibold text-sm">{movie.language}</p>
                  </div>
                )}
                {movie.ageRating && (
                  <div>
                    <p className="text-white/40 text-xs mb-0.5">Age Rating</p>
                    <p className="text-white font-semibold text-sm">{movie.ageRating}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="shrink-0 flex flex-col gap-3 w-[260px]">
              <button className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 transition-colors text-white font-semibold text-sm">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                Mark as Watched
              </button>
              <button className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#2a2a2a] hover:bg-[#333] transition-colors text-white font-semibold text-sm">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                </svg>
                Add to Collection
              </button>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 pt-10 pb-20 flex gap-8 items-start">

        {/* Left column: overview + cast/crew + opinion meter */}
        <div className="flex-1 min-w-0">
          {movie.overview && (
            <>
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-white/70 text-base leading-relaxed">{movie.overview}</p>
            </>
          )}

          <CastCrew cast={movie.cast || []} crew={movie.crew || []} />

          <OpinionMeter opinion={movie.opinionMeter} />
        </div>

        {/* Right sidebar: vibe chart + watch online */}
        <div className="shrink-0 w-[300px] flex flex-col gap-4">
          {movie.genres?.length > 0 && <VibeChart genres={movie.genres} />}
          <WatchOnline links={movie.streamingLinks || []} />
        </div>

      </div>
    </div>
  );
}