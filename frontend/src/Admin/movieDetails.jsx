import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

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

        <div className="flex-1 min-w-0">
          {movie.overview && (
            <>
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-white/70 text-base leading-relaxed">{movie.overview}</p>
            </>
          )}
        </div>

      </div>
    </div>
  );
}